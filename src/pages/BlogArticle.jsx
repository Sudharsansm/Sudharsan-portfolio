import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import ReadingProgress from '../components/ReadingProgress.jsx'
import useReveal from '../hooks/useReveal.js'
import { ArrowLeftIcon, Bitsophia, LinkedInIcon } from '../components/Icons.jsx'
import blogData from '../data/blog.json'
import { SITE } from '../config/site.js'
import SafeImage from '../components/SafeImage.jsx'

const { author, posts: allPosts } = blogData

export default function BlogArticle() {
  const { slug } = useParams()
  useReveal()

  const post = useMemo(() => allPosts.find((p) => p.slug === slug), [slug])
  usePageMeta({
    title: post?.title ?? 'Article not found',
    description: post?.desc,
    image: post?.img,
    noindex: !post,
  })

  const related = useMemo(() => allPosts.filter((p) => p.slug !== slug).slice(0, 3), [slug])

  if (!post) {
    return (
      <>
        <Header mode="page" current="blog" />
        <main id="main" className="px-6 pb-24 pt-40 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">Not found</p>
          <h1 className="mb-6 font-display text-3xl font-bold text-zinc-900 dark:text-white">
            We couldn't find that article.
          </h1>
          <Link to="/blog" className="nl text-sm font-medium text-accent">
            Back to the blog →
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  const body = post.body

  return (
    <>
      <ReadingProgress />
      <Header mode="page" current="blog" />

      <main id="main">
        <article>
          <header className="mx-auto max-w-3xl px-6 pb-12 pt-32">
            <Link
              to="/blog"
              className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-accent dark:text-zinc-400"
            >
              <ArrowLeftIcon />
              Back to blog
            </Link>

            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs text-accent dark:border-zinc-700 dark:bg-zinc-800">
                {post.tag}
              </span>
              <span className="text-xs text-zinc-400">
                {post.date}
                {post.readTime ? ` · ${post.readTime}` : ''}
              </span>
            </div>

            <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-zinc-900 dark:text-white md:text-5xl">
              {post.title}
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-zinc-500 dark:text-zinc-400">{post.desc}</p>

            {author && (
              <div className="flex items-center gap-4 border-b border-t border-zinc-100 py-6 dark:border-zinc-900">
                <div className="pf h-12 w-12 shrink-0 rounded-full">
                  <SafeImage src={author.avatar} alt={author.name} loading="lazy" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{author.name}</p>
                  <p className="text-xs text-zinc-500">{author.role}</p>
                </div>
                <div className="ml-auto flex gap-3">
                  <a
                    href={SITE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:border-accent hover:text-accent dark:border-zinc-800"
                    aria-label="Sudharsan on LinkedIn"
                  >
                    <LinkedInIcon className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={SITE.company.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:border-accent hover:text-accent dark:border-zinc-800"
                    aria-label="Bitsophia on LinkedIn"
                  >
                    <Bitsophia />
                  </a>
                </div>
              </div>
            )}
          </header>

          <div className="mx-auto mb-12 max-w-4xl px-6">
            <div className="pf h-72 w-full rounded-2xl md:h-96">
              <SafeImage src={body?.heroImg ?? post.img} alt={post.title} loading="lazy" />
            </div>
          </div>

          {!body ? (
            <div className="prose-article mx-auto max-w-3xl px-6 pb-16 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">
                The full article isn't published yet — check back soon, or{' '}
                <Link to="/blog" className="nl text-accent">
                  browse the rest of the blog
                </Link>{' '}
                in the meantime.
              </p>
            </div>
          ) : (
            <div className="prose-article mx-auto max-w-3xl px-6 pb-16">
              {body.blocks.map((block, i) => {
                if (block.type === 'heading') {
                  return <h2 key={i} dangerouslySetInnerHTML={{ __html: block.html }} />
                }
                if (block.type === 'paragraph') {
                  return <p key={i} dangerouslySetInnerHTML={{ __html: block.html }} />
                }
                if (block.type === 'blockquote') {
                  return (
                    <blockquote key={i}>
                      <p dangerouslySetInnerHTML={{ __html: block.html }} />
                    </blockquote>
                  )
                }
                if (block.type === 'list') {
                  return (
                    <ul key={i}>
                      {block.items.map((item, j) => (
                        <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                      ))}
                    </ul>
                  )
                }
                if (block.type === 'divider') {
                  return <hr key={i} />
                }
                return null
              })}
            </div>
          )}
        </article>

        {/* RELATED ARTICLES */}
        <section className="bg-zinc-50 py-16 dark:bg-zinc-900/50">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-8 font-display text-2xl font-bold text-zinc-900 dark:text-white">More from the blog</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <article
                  key={r.slug}
                  className="reveal card-h group overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-colors hover:border-accent dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <Link to={`/blog/${r.slug}`} className="pf block h-40 w-full">
                    <SafeImage src={r.img} alt={r.title} loading="lazy" />
                  </Link>
                  <div className="p-5">
                    <span className="mb-2 block text-xs text-zinc-400">
                      {r.date} · {r.tag}
                    </span>
                    <Link to={`/blog/${r.slug}`}>
                      <h3 className="mb-2 font-display text-base font-bold text-zinc-900 transition-colors group-hover:text-accent dark:text-white">
                        {r.title}
                      </h3>
                    </Link>
                    <Link to={`/blog/${r.slug}`} className="nl text-sm font-medium text-accent">
                      Read →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
