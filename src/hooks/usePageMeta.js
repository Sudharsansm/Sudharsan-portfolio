import { useEffect } from 'react'
import { SITE } from '../config/site.js'

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector)
  if (el && value != null) el.setAttribute(attr, value)
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!href) {
    link?.remove()
    return
  }
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

/**
 * Per-route <title>, description, canonical and social tags.
 * Pass `noindex` for pages that should not be indexed (404).
 */
export default function usePageMeta({ title, description = SITE.description, image, path, noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE.shortName}` : `${SITE.name} — ${SITE.role}`
    const pagePath = path ?? window.location.pathname
    const url = SITE.url ? `${SITE.url}${pagePath}` : ''
    const imageUrl = image ? (image.startsWith('http') ? image : `${SITE.url}${image}`) : `${SITE.url}${SITE.ogImage}`

    document.title = fullTitle
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow')
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[property="og:image"]', 'content', imageUrl)
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', description)
    setMeta('meta[name="twitter:image"]', 'content', imageUrl)
    setCanonical(noindex ? '' : url)
  }, [title, description, image, path, noindex])
}
