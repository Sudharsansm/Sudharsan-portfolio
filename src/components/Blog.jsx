import { Link } from 'react-router-dom'
import blogData from '../data/blog.json'
import SafeImage from '../components/SafeImage.jsx'

const { posts: allPosts = [] } = blogData

// Show only featured blogs, limited to 3 posts.
const RECENT_POSTS = allPosts.filter((post) => post.featured === true).slice(0, 3)

export default function Blog() {
  return (
    <section id="blog" className="bg-zinc-50 py-24 dark:bg-zinc-900/40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="reveal mb-3 text-xs font-medium uppercase tracking-widest text-accent">Thoughts</p>
            <h2 className="reveal d1 font-display text-4xl font-bold text-zinc-900 dark:text-white md:text-5xl">
              From the blog
            </h2>
          </div>

          <Link
            to="/blog"
            className="reveal d1 nl self-start text-sm font-medium text-zinc-500 transition-colors hover:text-accent dark:text-zinc-400 sm:self-auto"
          >
            All articles →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {RECENT_POSTS.map((post, i) => (
            <article
              key={post.slug}
              className={`reveal d${i + 1} card-h group overflow-hidden rounded-2xl border border-zinc-100 bg-white hover:border-accent dark:border-zinc-800 dark:bg-zinc-900`}
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
      </div>
    </section>
  )
}
