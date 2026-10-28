import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import useReveal from '../hooks/useReveal.js'
import usePageMeta from '../hooks/usePageMeta.js'
import { GitHubIcon } from '../components/Icons.jsx'
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
          onClick={(e) => e.stopPropagation()}
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
          onClick={(e) => e.stopPropagation()}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-700 shadow-sm backdrop-blur transition-colors hover:border-accent hover:text-accent dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300"
        >
          <GitHubIcon className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}

const { filterOptions, projects: allProjects } = projectsData

export default function Projects() {
  const [filter, setFilter] = useState('all')
  usePageMeta({
    title: 'Projects',
    description:
      'AI, web and developer-tool projects built by Sudharsan SM — case studies, live demos and source code.',
  })
  useReveal([filter])

  const visibleCount = useMemo(
    () => (filter === 'all' ? allProjects.length : allProjects.filter((p) => p.category === filter).length),
    [filter]
  )

  // Build "Label (count)" for each filter button without hardcoding counts in the data.
  const filtersWithCounts = useMemo(
    () =>
      filterOptions.map((f) => ({
        ...f,
        count: f.value === 'all' ? allProjects.length : allProjects.filter((p) => p.category === f.value).length,
      })),
    []
  )

  return (
    <>
      <Header mode="page" current="work" />

      <main id="main">
        <section className="relative overflow-hidden pb-12 pt-36">
          <div
            className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <p className="reveal mb-3 text-xs font-medium uppercase tracking-widest text-accent">Portfolio</p>
            <h1 className="reveal mb-4 font-display text-5xl font-bold leading-tight text-zinc-900 dark:text-white md:text-6xl">
              All Projects
            </h1>
            <p className="reveal mb-8 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
              Crazy ideas. Bold experiments. Things that matter.
            </p>
            <div className="reveal flex flex-wrap gap-2">
              {filtersWithCounts.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  aria-pressed={filter === f.value}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    filter === f.value
                      ? 'border-accent bg-accent text-white'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allProjects
                .filter((p) => filter === 'all' || p.category === filter)
                .map((p) => (
                  <div key={p.id}>
                    <article className="project-card card-h group h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-colors hover:border-accent dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="pf relative h-52 w-full">
                        <SafeImage src={p.img} alt={p.title} loading="lazy" />
                        <ProjectLinkButtons project={p} />
                      </div>
                      <div className="p-6">
                        <div className="mb-3 flex flex-wrap gap-2">
                          {p.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`rounded-full px-2.5 py-1 text-xs ${
                                tag === p.categoryLabel
                                  ? 'border border-orange-200 bg-orange-50 text-accent dark:border-zinc-700 dark:bg-zinc-800'
                                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link to={`/projects/${p.slug}`}>
                          <h3 className="mb-2 font-display text-lg font-bold text-zinc-900 transition-colors group-hover:text-accent dark:text-white">
                            {p.title}
                          </h3>
                        </Link>
                        <p className="mb-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{p.desc}</p>
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/projects/${p.slug}`}
                            className="nl inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-white"
                          >
                            View project →
                          </Link>
                          <span className="text-xs text-zinc-400">{p.year}</span>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
            </div>
            {visibleCount === 0 && (
              <div className="py-20 text-center">
                <p className="text-sm text-zinc-400">No projects in this category yet.</p>
              </div>
            )}
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900 p-10 text-center dark:bg-zinc-800 md:p-14">
              <div
                className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-accent/10 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative z-10">
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-accent">Ready to start?</p>
                <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">Want your project here?</h2>
                <p className="mx-auto mb-8 max-w-md text-zinc-400">
                  I'm available for new projects. Tell me about what you're building and let's see if we're a good fit.
                </p>
                <Link
                  to="/#contact"
                  className="shimmer inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-medium text-white transition-colors hover:bg-accent-light"
                >
                  Start a project →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
