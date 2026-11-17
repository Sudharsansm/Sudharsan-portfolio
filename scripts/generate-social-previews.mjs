// Runs after `vite build`. The site is a client-rendered SPA: index.html always ships the
// same <meta og:*> tags, and src/hooks/usePageMeta.js only rewrites them in the DOM with
// JavaScript. Social/chat crawlers (WhatsApp, Facebook, X/Twitter, LinkedIn, Telegram,
// Slack, Discord, iMessage...) fetch the raw HTML and do NOT run JavaScript, so every shared
// link — every project, every blog post — showed the same fallback og:image forever.
//
// Fix: emit a real dist/projects/<slug>/index.html and dist/blog/<slug>/index.html for every
// entry in src/data/projects.json and src/data/blog.json, each a copy of the built index.html
// with that item's own title/description/image baked into the static tags. Both Netlify
// (public/_redirects, unforced "/* /index.html 200") and Vercel (vercel.json rewrites) only
// apply their SPA catch-all when no real file matches the request path first — so a crawler
// hitting /projects/<slug> gets this file with the right image, while a browser gets the same
// file too, mounts the same React app into #root, and client-side routing takes over exactly
// as before. Nothing about the app's behavior for real visitors changes.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

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

// The base index.html hardcodes og:image:width=1200 / og:image:height=630 because that
// matches og-image.jpg exactly. Copying those same numbers onto every project/blog page was
// wrong: inbits-promo.webp is 1200x800, swify.webp is a square 800x800, bitsopay.png is
// 1672x941 — telling Facebook/LinkedIn/WhatsApp "this is 1200x630" when it's actually a
// different shape makes them crop it badly or refuse to render it at all. Read each file's
// real header instead of trusting a borrowed number. No image library needed — PNG/JPEG/WEBP
// all store their dimensions in a few fixed bytes near the start of the file.
function getImageSize(buffer) {
  // PNG: 8-byte signature + 4-byte chunk length + "IHDR", then width/height as big-endian u32.
  if (buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
  }
  // JPEG: walk the marker segments until an SOF marker (frame header) is found.
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2
    while (offset + 9 < buffer.length && buffer[offset] === 0xff) {
      const marker = buffer[offset + 1]
      if (marker === 0xd8 || marker === 0xd9) {
        offset += 2
        continue
      }
      const length = buffer.readUInt16BE(offset + 2)
      const isSOF = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
      if (isSOF) {
        return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) }
      }
      offset += 2 + length
    }
  }
  // WEBP: RIFF container; the three sub-formats (lossy/lossless/extended) each pack
  // width/height differently right after the "VP8 "/"VP8L"/"VP8X" fourCC.
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    const format = buffer.toString('ascii', 12, 16)
    if (format === 'VP8 ') {
      return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff }
    }
    if (format === 'VP8L') {
      const bits = buffer.readUInt32LE(21)
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
    }
    if (format === 'VP8X') {
      return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) }
    }
  }
  return null
}

// Local images (anything not already an absolute http(s) URL) live in dist/ after the Vite
// build copies public/ over, so their real dimensions can be read straight off disk — no
// network call needed. Remote images (e.g. an Unsplash URL used as a placeholder) can't be
// measured without fetching them, so their width/height tags are simply omitted; crawlers
// measure the image themselves when no hint is given, which is normal and safe.
const sizeCache = new Map()
function measureLocalImage(path) {
  if (!path || path.startsWith('http')) return null
  if (sizeCache.has(path)) return sizeCache.get(path)
  let size = null
  try {
    const filePath = join(distDir, path.replace(/^\//, ''))
    size = getImageSize(readFileSync(filePath))
  } catch {
    size = null
  }
  sizeCache.set(path, size)
  return size
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

function renderPage({ title, description, image, path }) {
  const fullTitle = `${title} | ${shortName}`
  const desc = description || defaultDescription
  const url = `${siteUrl}${path}`
  const resolvedImage = image || defaultOgImage
  const img = absoluteUrl(resolvedImage)
  const size = measureLocalImage(resolvedImage)

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
  if (size) {
    html = setContent(html, /<meta[^>]*property="og:image:width"[^>]*>/, String(size.width))
    html = setContent(html, /<meta[^>]*property="og:image:height"[^>]*>/, String(size.height))
  } else {
    // Couldn't measure it (remote image, or the file wasn't found) — a wrong hint is worse
    // than no hint, so drop the tags rather than ship stale 1200x630 numbers.
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
  writeRoute(
    `/projects/${p.slug}`,
    renderPage({ title: p.title, description: p.desc, image: p.img, path: `/projects/${p.slug}` })
  )
  count++
}

for (const post of posts) {
  writeRoute(
    `/blog/${post.slug}`,
    renderPage({ title: post.title, description: post.desc, image: post.img, path: `/blog/${post.slug}` })
  )
  count++
}

// The listing pages get their own stable preview too, instead of silently keeping whichever
// item's tags vite build happened to leave in dist/index.html.
writeRoute(
  '/projects',
  renderPage({ title: 'Projects', description: defaultDescription, image: defaultOgImage, path: '/projects' })
)
writeRoute(
  '/blog',
  renderPage({ title: 'Blog', description: defaultDescription, image: defaultOgImage, path: '/blog' })
)
count += 2

console.log(`[social-previews] Generated ${count} static preview page(s) with per-item og:image tags.`)
