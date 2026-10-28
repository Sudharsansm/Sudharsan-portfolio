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
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || '').trim().replace(/^["']+|["']+$/g, '').replace(/\/+$/, '')

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
