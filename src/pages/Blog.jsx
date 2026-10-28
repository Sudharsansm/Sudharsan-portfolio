import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import useReveal from '../hooks/useReveal.js'
import usePageMeta from '../hooks/usePageMeta.js'
import blogData from '../data/blog.json'
import SafeImage from '../components/SafeImage.jsx'

const { posts: allPosts } = blogData

export default function Blog() {
  const [active, setActive] = useState('all')
  usePageMeta({
    title: 'Blog',
    description: 'Articles on AI, Python, web scraping and building intelligent products by Sudharsan SM.',
  })
  useReveal([active])

  // Pick the first post flagged `featured` for the hero slot, falling back
  // to the first post in the list if none are flagged.
  const featured = useMemo(() => allPosts.find((p) => p.featured) ?? allPosts[0], [])

  // Exclude only that one specific post from the grid below — not every
  // post marked featured. Previously this filtered out ALL featured posts,
  // which hid every article except the hero whenever more than one post
  // was flagged featured.
  const rest = useMemo(() => allPosts.filter((p) => p.id !== featured?.id), [featured])

  // Categories are derived from whatever tags actually exist in the data,
  // instead of a hardcoded list — so filter buttons never go stale or
  // mismatch when posts use new/different tags.
  const categories = useMemo(() => {
    const uniqueTags = [...new Set(allPosts.map((p) => p.tag))]
    return [{ value: 'all', label: 'All' }, ...uniqueTags.map((tag) => ({ value: tag.toLowerCase(), label: tag }))]
  }, [])

  const visible = useMemo(
    () => (active === 'all' ? rest : rest.filter((p) => p.tag.toLowerCase() === active)),
    [active, rest]
  )

  return (
    <>
      <Header mode="page" current="blog" />

      <main id="main">
        {/* HERO BLOG */}
        <section className="relative overflow-hidden pb-16 pt-36">
          <div
            className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <p className="reveal mb-3 text-xs font-medium uppercase tracking-widest text-accent">Writing</p>
            <h1 className="reveal d1 mb-4 font-display text-5xl font-bold leading-tight text-zinc-900 dark:text-white md:text-6xl">
              The Blog
            </h1>
            <p className="reveal d2 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
              Thoughts on Crazy ideas, bold code, and turning imagination into something impactful. No fluff.
            </p>

            <div className="reveal d3 mt-8 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setActive(c.value)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    active === c.value
                      ? 'border-accent bg-accent text-white'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED ARTICLE */}
        {featured && (
          <section className="pb-16">
            <div className="mx-auto max-w-6xl px-6">
              <Link
                to={`/blog/${featured.slug}`}
                className="reveal group block overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-50 transition-colors hover:border-accent dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="grid md:grid-cols-2">
                  <div className="pf h-64 md:h-auto">
                    <SafeImage src={featured.img} alt={featured.title} loading="lazy" />
                  </div>
                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs text-accent dark:border-zinc-700 dark:bg-zinc-800">
                        {featured.tag}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {featured.date}
                        {featured.readTime ? ` · ${featured.readTime}` : ''}
                      </span>
                    </div>
                    <h2 className="mb-4 font-display text-2xl font-bold text-zinc-900 transition-colors group-hover:text-accent dark:text-white md:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mb-6 leading-relaxed text-zinc-500 dark:text-zinc-400">{featured.desc}</p>
                    <span className="nl inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                      Read article →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ALL ARTICLES GRID */}
        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 md:grid-cols-3">
              {visible.map((post, i) => (
                <article
                  key={post.id}
                  className={`reveal d${(i % 4) + 1} card-h group overflow-hidden rounded-2xl border border-zinc-100 bg-white hover:border-accent dark:border-zinc-800 dark:bg-zinc-900`}
                >
                  <div className="pf h-44 w-full">
                    <SafeImage src={post.img} alt={post.title} loading="lazy" />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs text-accent dark:border-zinc-700 dark:bg-zinc-800">
                        {post.tag}
                      </span>
                      <span className="text-xs text-zinc-400">{post.date}</span>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="mb-2 font-display text-lg font-bold text-zinc-900 transition-colors group-hover:text-accent dark:text-white">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="mb-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{post.desc}</p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="nl inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-white"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {visible.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-sm text-zinc-400">No articles in this category yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
