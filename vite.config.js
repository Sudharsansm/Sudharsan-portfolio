import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

// Injects the deployed origin into index.html (canonical + social-card URLs must be absolute and
// present in the static HTML, because crawlers do not execute JavaScript).
// If VITE_SITE_URL isn't set, tags that need an absolute URL are dropped instead of shipping broken ones.
function siteUrlPlugin(siteUrl) {
  return {
    name: 'site-url-html',
    transformIndexHtml(html) {
      if (!siteUrl) {
        return html.replace(/^[ \t]*<(?:meta|link)[^>]*data-site-url[^>]*>\r?\n/gm, '').replace(/%SITE_URL%/g, '')
      }
      return html.replace(/ data-site-url/g, '').replace(/%SITE_URL%/g, siteUrl)
    },
  }
}

const readJson = (rel) => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'))

// Emits robots.txt and (when the site URL is known) a sitemap.xml built from the project/blog data,
// so new entries in src/data/*.json are picked up automatically on the next build.
function seoFilesPlugin(siteUrl) {
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /']
      if (siteUrl) robots.push('', `Sitemap: ${siteUrl}/sitemap.xml`)
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots.join('\n') + '\n' })

      if (!siteUrl) return
      const projects = readJson('./src/data/projects.json').projects.map((p) => `/projects/${p.slug}`)
      const posts = readJson('./src/data/blog.json').posts.map((p) => `/blog/${p.slug}`)
      const urls = ['/', '/projects', '/blog', ...projects, ...posts]
      const lastmod = new Date().toISOString().slice(0, 10)
      const xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls.map((u) => `  <url><loc>${siteUrl}${u}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n') +
        '\n</urlset>\n'
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml })
    },
  }
}

export default defineConfig(({ mode }) => {
  // prefix '' makes loadEnv merge in every process.env var too (not just VITE_-prefixed ones),
  // so env.URL/env.DEPLOY_PRIME_URL/env.VERCEL_URL below see whatever the host set, with no
  // .env file involved.
  const env = loadEnv(mode, process.cwd(), '')
  // An explicit VITE_SITE_URL always wins. Otherwise fall back to what the hosting platform
  // hands the build automatically, with zero configuration: Netlify sets URL (and
  // DEPLOY_PRIME_URL for branch/preview deploys), Vercel sets VERCEL_URL (bare domain, no
  // scheme). Without this fallback, forgetting to set VITE_SITE_URL by hand silently strips
  // og:url/og:image/canonical from every page's HTML at build time — this is what makes the
  // fix work out of the box instead of depending on a dashboard setting that's easy to miss.
  const vercelUrl = env.VERCEL_URL ? `https://${env.VERCEL_URL}` : ''
  const siteUrl = (env.VITE_SITE_URL || env.URL || env.DEPLOY_PRIME_URL || vercelUrl || '')
    .trim()
    .replace(/^["']+|["']+$/g, '')
    .replace(/\/+$/, '')

  return {
    plugins: [react(), siteUrlPlugin(siteUrl), seoFilesPlugin(siteUrl)],
    server: { port: 5173, open: false },
    preview: { port: 4173 },
    build: {
      target: 'es2020',
      sourcemap: false,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
  }
})
