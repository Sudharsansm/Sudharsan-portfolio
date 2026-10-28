import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = (rel) => fileURLToPath(new URL(`../${rel}`, import.meta.url))
const json = (rel) => JSON.parse(readFileSync(root(rel), 'utf8'))

const { projects, filterOptions } = json('src/data/projects.json')
const blog = json('src/data/blog.json')
const posts = blog.posts
const skills = json('src/data/skills.json')
const services = json('src/data/services.json')

// Collect every string value under a given key name, anywhere in the object tree.
function collect(node, keys, out = []) {
  if (Array.isArray(node)) node.forEach((n) => collect(n, keys, out))
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (keys.includes(k) && typeof v === 'string') out.push(v)
      else collect(v, keys, out)
    }
  }
  return out
}

const unique = (arr) => new Set(arr).size === arr.length

describe('content data integrity', () => {
  it('has unique ids and URL-safe slugs for projects and posts', () => {
    for (const list of [projects, posts]) {
      expect(unique(list.map((i) => i.id))).toBe(true)
      expect(unique(list.map((i) => i.slug))).toBe(true)
      list.forEach((i) => expect(i.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
    }
  })

  it('assigns every project to a known filter category', () => {
    const known = new Set(filterOptions.map((f) => f.value))
    projects.forEach((p) => expect(known.has(p.category), `${p.slug}: ${p.category}`).toBe(true))
  })

  it('has unique ids for skills and services', () => {
    expect(unique(skills.map((s) => s.id))).toBe(true)
    expect(unique(services.map((s) => s.id))).toBe(true)
  })

  it('only references local images that exist in /public, with absolute paths', () => {
    const imgs = [
      ...collect(projects, ['img', 'heroImg', 'processImg']),
      ...collect(blog, ['img', 'heroImg', 'avatar']),
    ]
    for (const src of imgs.filter((s) => !/^https?:\/\//.test(s))) {
      expect(src.startsWith('/'), `relative path breaks on nested routes: ${src}`).toBe(true)
      expect(existsSync(root(`public${src}`)), `missing file: public${src}`).toBe(true)
    }
  })

  it('uses https for every external URL', () => {
    const urls = [
      ...collect(projects, ['liveUrl', 'githubUrl', 'img', 'heroImg', 'processImg']),
      ...collect(blog, ['img', 'heroImg', 'avatar']),
      ...collect(skills, ['avatar']),
    ].filter((u) => /^https?:/.test(u))
    urls.forEach((u) => expect(u.startsWith('https://'), u).toBe(true))
  })
})
