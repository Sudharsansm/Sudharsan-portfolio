import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import ReadingProgress from '../components/ReadingProgress.jsx'
import useReveal from '../hooks/useReveal.js'
import { GitHubIcon } from '../components/Icons.jsx'
import projectsData from '../data/projects.json'
import SafeImage from '../components/SafeImage.jsx'

const { projects: allProjects } = projectsData

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
    <div className="flex items-center gap-2">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} — live demo`}
          title="Live demo"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 transition-colors hover:border-accent hover:text-accent dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
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
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 transition-colors hover:border-accent hover:text-accent dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <GitHubIcon className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  useReveal()

  const project = useMemo(() => allProjects.find((p) => p.slug === slug), [slug])
  usePageMeta({
    title: project?.title ?? 'Project not found',
    description: project?.desc,
    image: project?.img,
    noindex: !project,
  })

  const moreProjects = useMemo(() => allProjects.filter((p) => p.slug !== slug).slice(0, 3), [slug])

  if (!project) {
    return (
      <>
        <Header mode="page" current="work" />
        <main id="main" className="px-6 pb-24 pt-40 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">Not found</p>
          <h1 className="mb-6 font-display text-3xl font-bold text-zinc-900 dark:text-white">
            We couldn't find that project.
          </h1>
          <Link to="/projects" className="nl text-sm font-medium text-accent">
            Back to all projects →
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  const cs = project.caseStudy

  return (
    <>
      <ReadingProgress />
      <Header mode="page" current="work" />

      <main id="main">
        <article>
          <header className="mx-auto max-w-4xl px-6 pb-10 pt-32">
            <Link
              to="/projects"
              className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-accent dark:text-zinc-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to projects
            </Link>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      tag === project.categoryLabel
                        ? 'border border-orange-200 bg-orange-50 text-accent dark:border-zinc-700 dark:bg-zinc-800'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                {cs?.duration && <span className="ml-1 text-xs text-zinc-400">{cs.duration}</span>}
              </div>
              <ProjectLinkButtons project={project} />
            </div>

            <h1 className="reveal mb-6 font-display text-4xl font-bold leading-tight text-zinc-900 dark:text-white md:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            <p className="reveal d1 mb-10 max-w-2xl text-xl leading-relaxed text-zinc-500 dark:text-zinc-400">
              {project.desc}
            </p>

            {cs?.meta && (
              <div className="reveal d2 grid grid-cols-2 gap-4 border-b border-t border-zinc-100 py-8 dark:border-zinc-900 md:grid-cols-4">
                <div>
                  <p className="mb-1 text-xs uppercase tracking-widest text-zinc-400">Client</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{cs.meta.client}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-widest text-zinc-400">Role</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{cs.meta.role}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-widest text-zinc-400">Timeline</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{cs.meta.timeline}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-widest text-zinc-400">Deliverables</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{cs.meta.deliverables}</p>
                </div>
              </div>
            )}
          </header>

          <div className="mx-auto mb-16 max-w-6xl px-6">
            <div className="reveal pf h-72 w-full rounded-3xl md:h-[480px]">
              <SafeImage src={cs?.heroImg ?? project.img} alt={`${project.title} hero`} loading="eager" />
            </div>
          </div>

          {!cs ? (
            <div className="prose-cs mx-auto max-w-3xl px-6 pb-16 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">
                The full write-up for this project isn't published yet — check back soon, or{' '}
                <Link to="/projects" className="nl text-accent">
                  browse the rest of the portfolio
                </Link>{' '}
                in the meantime.
              </p>
            </div>
          ) : (
            <>
              {cs.stats && (
                <div className="mx-auto mb-16 max-w-4xl px-6">
                  <div className="reveal grid grid-cols-2 gap-4 md:grid-cols-4">
                    {cs.stats.map((stat) => (
                      <div key={stat.label} className="stat-card rounded-2xl bg-zinc-50 p-5 pl-6 dark:bg-zinc-900">
                        <p
                          className={`font-display text-3xl font-bold ${stat.accent ? 'text-accent' : 'text-zinc-900 dark:text-white'}`}
                        >
                          {stat.value}
                        </p>
                        <p className="mt-1 text-xs leading-snug text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cs.brief && (
                <div className="prose-cs mx-auto max-w-3xl px-6 pb-4">
                  <h2>The brief</h2>
                  {cs.brief.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}

                  {cs.briefQuote && (
                    <blockquote>
                      <p>"{cs.briefQuote}"</p>
                    </blockquote>
                  )}

                  {cs.research && (
                    <>
                      <h2>Discovery &amp; research</h2>
                      <h3>User interviews</h3>
                      <p>{cs.research.interviewsIntro}</p>
                      <ul>
                        {cs.research.interviewFindings.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                      <h3>Heuristic audit</h3>
                      <p>{cs.research.heuristicAudit}</p>
                    </>
                  )}
                </div>
              )}

              {cs.research?.img && (
                <div className="mx-auto mb-4 max-w-5xl px-6">
                  <div className="reveal pf h-56 w-full rounded-2xl md:h-80">
                    <SafeImage src={cs.research.img} alt={`${project.title} research audit`} loading="lazy" />
                  </div>
                  <p className="img-caption">{cs.research.imgCaption}</p>
                </div>
              )}

              {cs.principles && (
                <>
                  <div className="prose-cs mx-auto max-w-3xl px-6 pb-4">
                    <h2>Design strategy</h2>
                    <p>{cs.strategyIntro}</p>
                  </div>

                  <div className="mx-auto mb-12 max-w-5xl px-6">
                    <div className="reveal grid gap-5 md:grid-cols-3">
                      {cs.principles.map((p) => (
                        <div
                          key={p.title}
                          className="rounded-2xl border border-zinc-100 bg-zinc-50 p-7 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-zinc-800">
                            <svg
                              className="h-5 w-5 text-accent"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={p.icon} />
                            </svg>
                          </div>
                          <h3
                            className="mb-2 font-display font-bold text-zinc-900 dark:text-white"
                            style={{ fontSize: '1rem', margin: '0 0 .5rem', color: 'inherit' }}
                          >
                            {p.title}
                          </h3>
                          <p
                            className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400"
                            style={{ margin: 0, color: 'inherit' }}
                          >
                            {p.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {cs.processIntro && (
                <div className="prose-cs mx-auto max-w-3xl px-6 pb-4">
                  <h2>Process</h2>
                  <h3>{cs.processIntro.heading}</h3>
                  <p>{cs.processIntro.body}</p>
                </div>
              )}

              {cs.steps && (
                <div className="mx-auto mb-12 max-w-4xl px-6">
                  <div className="reveal space-y-4">
                    {cs.steps.map((s) => (
                      <div
                        key={s.n}
                        className="flex gap-5 rounded-2xl border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900"
                      >
                        <div className="step-badge mt-0.5 shrink-0">{s.n}</div>
                        <div>
                          <p className="mb-1 font-display font-bold text-zinc-900 dark:text-white">{s.title}</p>
                          <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cs.processImg && (
                <div className="mx-auto mb-4 max-w-5xl px-6">
                  <div className="reveal pf h-56 w-full rounded-2xl md:h-80">
                    <SafeImage src={cs.processImg} alt={`${project.title} hi-fi screens`} loading="lazy" />
                  </div>
                  <p className="img-caption">{cs.processImgCaption}</p>
                </div>
              )}

              {cs.beforeAfter && (
                <div className="mx-auto mb-12 max-w-5xl px-6">
                  <div className="reveal grid gap-4 md:grid-cols-2">
                    {cs.beforeAfter.map((b) => (
                      <div key={b.caption}>
                        <div className="pf h-52 w-full rounded-2xl">
                          <SafeImage src={b.img} alt={b.caption} loading="lazy" />
                        </div>
                        <p className="img-caption mt-2">{b.caption}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(cs.decisions || cs.results || cs.reflections) && (
                <div className="prose-cs mx-auto max-w-3xl px-6 pb-16">
                  {cs.decisions && (
                    <>
                      <h2>Key design decisions</h2>
                      {cs.decisions.map((d) => (
                        <div key={d.title}>
                          <h3>{d.title}</h3>
                          <p>{d.body}</p>
                        </div>
                      ))}
                    </>
                  )}

                  {cs.results && (
                    <>
                      <h2>Results</h2>
                      <p>{cs.resultsIntro}</p>
                      <ul>
                        {cs.results.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {cs.resultsQuote && (
                    <blockquote>
                      <p>"{cs.resultsQuote}"</p>
                    </blockquote>
                  )}

                  {cs.reflections && (
                    <>
                      <h2>Reflections</h2>
                      {cs.reflections.map((r, i) => (
                        <p key={i}>{r}</p>
                      ))}
                    </>
                  )}

                  <hr />
                  <p>
                    <em>
                      Interested in a similar engagement? <Link to="/#contact">Get in touch</Link> — I'm available for
                      new projects.
                    </em>
                  </p>
                </div>
              )}
            </>
          )}
        </article>

        {/* MORE PROJECTS */}
        <section className="bg-zinc-50 py-16 dark:bg-zinc-900/50">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">More projects</h2>
              <Link to="/projects" className="nl hidden text-sm font-medium text-accent md:block">
                View all →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {moreProjects.map((p) => (
                <article
                  key={p.id}
                  className="reveal card-h group overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-colors hover:border-accent dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <Link to={`/projects/${p.slug}`} className="pf block h-44 w-full">
                    <SafeImage src={p.img} alt={p.title} loading="lazy" />
                  </Link>
                  <div className="p-5">
                    <div className="mb-2 flex gap-2">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {p.categoryLabel}
                      </span>
                    </div>
                    <Link to={`/projects/${p.slug}`}>
                      <h3 className="mb-2 font-display text-base font-bold text-zinc-900 transition-colors group-hover:text-accent dark:text-white">
                        {p.title}
                      </h3>
                    </Link>
                    <Link to={`/projects/${p.slug}`} className="nl text-sm font-medium text-accent">
                      View project →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link to="/projects" className="text-sm font-medium text-accent">
                View all projects →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
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
                <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">Got a similar project?</h2>
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
