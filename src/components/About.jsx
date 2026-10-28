export default function About() {
  return (
    <section id="about" className="bg-zinc-50 py-24 dark:bg-zinc-900/40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div className="reveal order-2 md:order-1">
            <div className="pf mx-auto aspect-square w-full max-w-sm rounded-3xl">
              <img
                src="/images/sudharsan.webp"
                alt="Sudharsan SM, AI/ML Engineer"
                width="1000"
                height="750"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <p className="reveal mb-3 text-xs font-medium uppercase tracking-widest text-accent">About me</p>
            <h2 className="reveal d1 mb-6 font-display text-4xl font-bold leading-tight text-zinc-900 dark:text-white md:text-5xl">
              A bit about
              <br />
              who I am
            </h2>
            <p className="reveal d2 mb-4 leading-relaxed text-zinc-500 dark:text-zinc-400">
              I'm Sudharsan SM, AI/ML Engineer with hands-on experience in Python, SQL, FastAPI, MongoDB, Generative AI,
              Machine Learning, Deep Learning and Agentic AI.
            </p>
            <p className="reveal d3 mb-8 leading-relaxed text-zinc-500 dark:text-zinc-400">
              Built multiple AI-driven and full-stack projects focused on intelligent automation and scalable software
              solutions with AI. Participated as an Analog Astronaut, gaining exposure to space-mission simulations and
              mission-oriented problem-solving.
            </p>
            <p className="reveal d3 mb-8 leading-relaxed text-zinc-500 dark:text-zinc-400">
              NASA Citizen Scientist and Youth Astronomy Congress prize winner, passionate about applying AI to
              real-world and mission-driven problems.
            </p>
            <p className="reveal d3 mb-8 leading-relaxed text-zinc-500 dark:text-zinc-400">
              I believe great interfaces are invisible — they get out of the user's way. My work is fast, accessible and
              built to last. When I'm not coding, you'll find me hiking or hunting for a good espresso.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
