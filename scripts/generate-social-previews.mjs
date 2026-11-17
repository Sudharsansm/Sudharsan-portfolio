// Runs after `vite build`. The site is a client-rendered SPA: index.html always ships the
// same <meta og:*> tags, and src/hooks/usePageMeta.js only rewrites them in the DOM with
// JavaScript. Social/chat crawlers (WhatsApp, Facebook, X/Twitter, LinkedIn, Telegram,
// Slack, Discord, iMessage...) fetch the raw HTML and do NOT run JavaScript, so every shared
// link — every project, every blog post — showed the same fallback og:image forever.
//
// Fix, part 1: emit a real dist/projects/<slug>/index.html and dist/blog/<slug>/index.html
// for every entry in src/data/projects.json and src/data/blog.json, each a copy of the built
// index.html with that item's own title/description/image baked into the static tags. Both
// Netlify (public/_redirects, unforced "/* /index.html 200") and Vercel (vercel.json
// rewrites) only apply their SPA catch-all when no real file matches the request path first —
// so a crawler hitting /projects/<slug> gets this file with the right image, while a browser
// gets the same file too, mounts the same React app into #root, and client-side routing takes
// over exactly as before. Nothing about the app's behavior for real visitors changes.
//
// Fix, part 2: the homepage's "big image" preview isn't just about having an og:image — it's
// that og-image.jpg is exactly 1200x630 (the ~1.91:1 ratio WhatsApp/Telegram/Facebook expect
// for the large banner-style card). The real project/post images are all different shapes
// (1200x800, a square 800x800, 1672x941...), so even with the right file and correct
// width/height tags, several platforms fall back to a small square thumbnail instead of the
// big banner. So for every item this script renders its own image onto a 1200x630 canvas
// (cropping to fill, same way a phone wallpaper picker crops a photo) and uses THAT as the
// og:image/twitter:image — never the raw source file. Every shared link now gets the same big
// card shape as the homepage, just with that item's own picture in it.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const OG_WIDTH = 1200
const OG_HEIGHT = 630

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const distDir = join(root, 'dist')
const indexPath = join(distDir, 'index.html')

if (!existsSync(indexPath)) {
  console.error('[social-previews] dist/index.html not found — run `vite build` first.')
  process.exit(1)
}

// Vite's own .env loading (via loadEnv in vite.config.js) never touches process.env — it
// only feeds import.meta.env inside the bundled client code. On Netlify/Vercel the build
// command gets VITE_SITE_URL as a real env var, so process.env has it there. Locally, fall
// back to reading .env directly so `npm run build` behaves the same way on both.
function readDotEnvVar(name) {
  const envPath = join(root, '.env')
  if (!existsSync(envPath)) return ''
  const match = readFileSync(envPath, 'utf8').match(new RegExp(`^${name}=(.*)$`, 'm'))
  return match ? match[1].trim() : ''
}

// Same resolution rule vite.config.js uses for the base index.html: without a known public
// origin, absolute og:image/og:url/canonical tags can't be built, so skip instead of shipping
// broken ones.
const siteUrl = (process.env.VITE_SITE_URL || readDotEnvVar('VITE_SITE_URL') || '')
  .trim()
  .replace(/^["']+|["']+$/g, '')
  .replace(/\/+$/, '')

if (!siteUrl) {
  console.warn(
    '[social-previews] VITE_SITE_URL is not set — skipping per-page previews (Open Graph tags must be absolute URLs).'
  )
  process.exit(0)
}

// Pull shortName/description/ogImage straight from the source of truth instead of
// hardcoding a second copy that could drift out of sync.
const siteJsSrc = readFileSync(join(root, 'src/config/site.js'), 'utf8')
const extract = (re, fallback) => siteJsSrc.match(re)?.[1] ?? fallback
const shortName = extract(/shortName:\s*'([^']+)'/, 'Sudharsan')
const defaultDescription = extract(/description:\s*'([^']+)'/, '')
const defaultOgImage = extract(/ogImage:\s*'([^']+)'/, '/og-image.jpg')

const readJson = (rel) => JSON.parse(readFileSync(join(root, rel), 'utf8'))
const { projects } = readJson('src/data/projects.json')
const { posts } = readJson('src/data/blog.json')

const template = readFileSync(indexPath, 'utf8')

const escapeHtml = (value = '') =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const absoluteUrl = (path) => (!path ? '' : path.startsWith('http') ? path : `${siteUrl}${path}`)

// One 1200x630 JPEG per distinct source image, written to dist/og/<name>.jpg. `fit: 'cover'`
// scales the source up or down and crops it so it completely fills the 1200x630 frame (never
// letterboxed/squashed); `position: 'attention'` has sharp pick the crop that keeps the most
// visually interesting region instead of blindly cropping from the centre. Remote images
// (e.g. an Unsplash placeholder) are downloaded first — this needs outbound network access at
// build time, which Netlify/Vercel's build servers have; if a particular build environment
// doesn't, this just warns and that one item keeps its original image/tags instead of failing
// the whole build.
const ogDir = join(distDir, 'og')
mkdirSync(ogDir, { recursive: true })
const ogCache = new Map()

async function buildOgImage(resolvedImage, outName) {
  if (ogCache.has(resolvedImage)) return ogCache.get(resolvedImage)

  let result = null
  try {
    const inputBuffer = resolvedImage.startsWith('http')
      ? await fetch(resolvedImage)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            return res.arrayBuffer()
          })
          .then(Buffer.from)
      : readFileSync(join(distDir, resolvedImage.replace(/^\//, '')))

    const outputBuffer = await sharp(inputBuffer)
      .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 85 })
      .toBuffer()

    const fileName = `${outName}.jpg`
    writeFileSync(join(ogDir, fileName), outputBuffer)
    result = { url: `/og/${fileName}`, width: OG_WIDTH, height: OG_HEIGHT }
  } catch (err) {
    console.warn(`[social-previews] Couldn't build a 1200x630 preview for ${resolvedImage}: ${err.message}`)
  }

  ogCache.set(resolvedImage, result)
  return result
}

// tagPattern matches the whole <meta ...> / <link ...> tag by a unique attribute inside it;
// [^>]* also matches newlines (it's a character class, not "."), so this works whether the
// tag is written on one line or wrapped across several, as it is in index.html.
function setContent(html, tagPattern, newValue) {
  return html.replace(tagPattern, (tag) => tag.replace(/(content=")[^"]*(")/, `$1${escapeHtml(newValue)}$2`))
}
function setHref(html, tagPattern, newValue) {
  return html.replace(tagPattern, (tag) => tag.replace(/(href=")[^"]*(")/, `$1${escapeHtml(newValue)}$2`))
}
function removeTag(html, tagPattern) {
  return html.replace(tagPattern, '')
}

async function renderPage({ title, description, image, path, ogName }) {
  const fullTitle = `${title} | ${shortName}`
  const desc = description || defaultDescription
  const url = `${siteUrl}${path}`
  const resolvedImage = image || defaultOgImage
  const built = await buildOgImage(resolvedImage, ogName)
  const img = built ? absoluteUrl(built.url) : absoluteUrl(resolvedImage)

  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`)
  html = setContent(html, /<meta[^>]*name="description"[^>]*>/, desc)
  html = setContent(html, /<meta[^>]*property="og:title"[^>]*>/, fullTitle)
  html = setContent(html, /<meta[^>]*property="og:description"[^>]*>/, desc)
  html = setContent(html, /<meta[^>]*property="og:url"[^>]*>/, url)
  html = setContent(html, /<meta[^>]*property="og:image"[^>]*>/, img)
  html = setContent(html, /<meta[^>]*name="twitter:title"[^>]*>/, fullTitle)
  html = setContent(html, /<meta[^>]*name="twitter:description"[^>]*>/, desc)
  html = setContent(html, /<meta[^>]*name="twitter:image"[^>]*>/, img)
  html = setHref(html, /<link[^>]*rel="canonical"[^>]*>/, url)
  if (built) {
    // Every generated preview is exactly 1200x630, same as the homepage's og-image.jpg — the
    // "big image" card shape — so this is always correct, never a guess.
    html = setContent(html, /<meta[^>]*property="og:image:width"[^>]*>/, String(built.width))
    html = setContent(html, /<meta[^>]*property="og:image:height"[^>]*>/, String(built.height))
  } else {
    // The image build failed for this one item — a wrong width/height hint is worse than no
    // hint, so drop the tags rather than ship stale 1200x630 numbers for a differently-shaped
    // fallback image.
    html = removeTag(html, /\s*<meta[^>]*property="og:image:width"[^>]*>\n?/)
    html = removeTag(html, /\s*<meta[^>]*property="og:image:height"[^>]*>\n?/)
  }
  return html
}

function writeRoute(path, html) {
  const outDir = join(distDir, path.replace(/^\//, ''))
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
}

let count = 0

for (const p of projects) {
  const html = await renderPage({
    title: p.title,
    description: p.desc,
    image: p.img,
    path: `/projects/${p.slug}`,
    ogName: `projects-${p.slug}`,
  })
  writeRoute(`/projects/${p.slug}`, html)
  count++
}

for (const post of posts) {
  const html = await renderPage({
    title: post.title,
    description: post.desc,
    image: post.img,
    path: `/blog/${post.slug}`,
    ogName: `blog-${post.slug}`,
  })
  writeRoute(`/blog/${post.slug}`, html)
  count++
}

// The listing pages get their own stable preview too (the site's default og-image.jpg is
// already 1200x630, so no cropping is needed there), instead of silently keeping whichever
// item's tags vite build happened to leave in dist/index.html.
writeRoute(
  '/projects',
  await renderPage({
    title: 'Projects',
    description: defaultDescription,
    image: defaultOgImage,
    path: '/projects',
    ogName: 'projects-index',
  })
)
writeRoute(
  '/blog',
  await renderPage({
    title: 'Blog',
    description: defaultDescription,
    image: defaultOgImage,
    path: '/blog',
    ogName: 'blog-index',
  })
)
count += 2

console.log(`[social-previews] Generated ${count} static preview page(s), each with its own 1200x630 og:image.`)
