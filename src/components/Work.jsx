import { Link } from 'react-router-dom'
import { ArrowRightIcon, GitHubIcon } from '../components/Icons.jsx'
import projectsData from '../data/projects.json'
import SafeImage from '../components/SafeImage.jsx'

function LiveDemoIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  )
}

function ProjectLinkButtons({ project }) {
  if (!project.liveUrl && !project.githubUrl) return null

  return (
    <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} — live demo`}
          title="Live demo"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-700 shadow-sm backdrop-blur transition-colors hover:border-accent hover:text-accent dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300"
        >
          <LiveDemoIcon />
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} — GitHub repo`}
          title="GitHub"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-700 shadow-sm backdrop-blur transition-colors hover:border-accent hover:text-accent dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300"
        >
          <GitHubIcon className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}

const { projects: allProjects } = projectsData

// Pull the projects flagged `featured: true` in data/projects.js.
// If none are flagged yet, fall back to the first three so this section
// never renders empty.
const featured = allProjects.filter((p) => p.featured)
const FEATURED_PROJECTS = (featured.length > 0 ? featured : allProjects.slice(0, 3)).slice(0, 3)

export default function Work() {
  return (
    <section id="work" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="reveal mb-3 text-xs font-medium uppercase tracking-widest text-accent">Portfolio</p>
            <h2 className="reveal d1 font-display text-4xl font-bold text-zinc-900 dark:text-white md:text-5xl">
              Selected work
            </h2>
          </div>
          <Link
            to="/projects"
            className="reveal d1 nl self-start text-sm font-medium text-zinc-500 transition-colors hover:text-accent dark:text-zinc-400 sm:self-auto"
          >
            All projects →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {FEATURED_PROJECTS.map((p, index) => {
            const isLead = index === 0
            const delay = ['d1', 'd2', 'd3'][index] ?? 'd3'

            return (
              <article
                key={p.id}
                className={`card-h reveal ${delay} group overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-100 hover:border-accent dark:border-zinc-800 dark:bg-zinc-900 ${
                  isLead ? 'md:row-span-2' : ''
                }`}
              >
                <div className={`pf relative w-full ${isLead ? 'h-64 md:h-80' : 'h-48'}`}>
                  <SafeImage src={p.img} alt={p.title} loading="lazy" />
                  <ProjectLinkButtons project={p} />
                </div>
                <div className={isLead ? 'p-7' : 'p-6'}>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-3 py-1 text-xs ${
                          tag === p.categoryLabel
                            ? 'border border-orange-200 bg-orange-50 text-accent dark:border-zinc-700 dark:bg-zinc-800'
                            : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link to={`/projects/${p.slug}`}>
                    <h3
                      className={`mb-1.5 font-display font-bold text-zinc-900 dark:text-white ${isLead ? 'mb-2 text-2xl' : 'text-xl'}`}
                    >
                      {p.title}
                    </h3>
                  </Link>
                  <p className={`text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 ${isLead ? 'mb-5' : 'mb-4'}`}>
                    {p.desc}
                  </p>
                  <Link
                    to={`/projects/${p.slug}`}
                    className="nl inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-white"
                  >
                    View case study {isLead ? <ArrowRightIcon /> : '→'}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
