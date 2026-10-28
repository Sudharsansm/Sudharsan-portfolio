# Sudharsan SM — Portfolio

Personal portfolio for **Sudharsan SM**, AI/ML Engineer & Python Developer. Built with React 18, Vite 7, Tailwind CSS 3 and React Router 7.

- Home page with services, selected work, about, skills, blog preview and a contact form
- `/projects` (filterable) and `/projects/:slug` case studies
- `/blog` and `/blog/:slug` articles
- Dark mode (no flash on load), reduced-motion support, keyboard-accessible navigation
- All content lives in JSON files — no code changes needed to add a project or post

## Quick start

Requires Node.js **20.19+** (see `.nvmrc`).

```bash
npm install
cp .env.example .env     # then fill in the values
npm run dev              # http://localhost:5173
```

## Scripts

| Command                           | What it does                                          |
| --------------------------------- | ----------------------------------------------------- |
| `npm run dev`                     | Start the dev server                                  |
| `npm run build`                   | Production build into `dist/`                         |
| `npm run preview`                 | Serve the production build locally (port 4173)        |
| `npm run lint` / `lint:fix`       | ESLint (React, hooks, a11y rules)                     |
| `npm run format` / `format:check` | Prettier (with Tailwind class sorting)                |
| `npm test`                        | Content-integrity tests (slugs, image paths, URLs)    |
| `npm run check`                   | Lint + format check + tests + build — run before a PR |

## Configuration

Set in `.env` locally or in your host's dashboard. Only `VITE_*` values reach the browser, so never store secrets here.

| Variable             | Purpose                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| `VITE_SITE_URL`      | Public origin, e.g. `https://sudharsan.dev`. Drives canonical URLs, social cards and `sitemap.xml` |
| `VITE_FORM_ENDPOINT` | Formspree endpoint for the contact form (falls back to the current form)                           |

Personal constants (name, email, LinkedIn, GitHub) are in `src/config/site.js`.

> **Set `VITE_SITE_URL` before launch.** Without it, canonical/Open Graph URLs and the sitemap are omitted rather than emitted broken.

## Editing content

| To change…              | Edit                                                      |
| ----------------------- | --------------------------------------------------------- |
| Projects & case studies | `src/data/projects.json` (`featured: true` shows on home) |
| Blog posts              | `src/data/blog.json`                                      |
| Skills grid / services  | `src/data/skills.json` / `src/data/services.json`         |
| Resume                  | replace `public/document/sudharsan_sm_resume.pdf`         |

Image rules (enforced by `npm test`):

- Put local images in `public/images/` and reference them with an **absolute path** (`/images/foo.webp`) — relative paths break on nested routes such as `/projects/swify`.
- Use WebP/JPEG at the size it's displayed (≈1200px wide max). Large originals hurt load time.
- Slugs must be lowercase-kebab-case and unique.

Blog `html` fields are rendered with `dangerouslySetInnerHTML`. That's safe for content you author in the repo, but **never** feed it user-generated or third-party content without sanitizing it first.

## Project structure

```
src/
  components/   Header, Footer, home sections, SafeImage, ErrorBoundary, icons
  config/       site.js — site-wide constants
  data/         projects.json, blog.json, skills.json, services.json
  hooks/        useDarkMode, useReveal, useSectionSpy, usePageMeta, …
  lib/          storage.js — safe localStorage wrapper
  pages/        Home, Projects, CaseStudy, Blog, BlogArticle, NotFound (all but Home are lazy-loaded)
public/         static files: images, favicons, manifest, theme-init.js, resume PDF
tests/          content-integrity tests
```

## Deployment

The app is a static single-page app: any host works as long as unknown paths fall back to `index.html`.

- **Vercel** — import the repo; `vercel.json` already sets the SPA rewrite, cache headers and security headers (CSP, HSTS, etc.). Add `VITE_SITE_URL` under _Environment Variables_.
- **Netlify** — build command `npm run build`, publish directory `dist`. `public/_redirects` and `public/_headers` are included.
- **Docker / any VPS** — `docker build --build-arg VITE_SITE_URL=https://your-domain.com -t portfolio . && docker run -p 8080:8080 portfolio` (nginx, non-root, gzip, immutable asset caching, `/healthz`).

The CSP assumes the current third-party origins: Google Fonts, Formspree, and HTTPS images (Unsplash, jsDelivr, etc.). If you add another service (analytics, a new form backend), add its origin to the CSP in `vercel.json`, `public/_headers` and `nginx.conf`.

CI (`.github/workflows/ci.yml`) runs lint, format check, tests, build and `npm audit` on every push and PR; Dependabot keeps dependencies current.

## SEO note

This is a client-rendered SPA. Titles, descriptions and canonical tags are updated per route in the browser (Google handles this fine), but link-preview crawlers (LinkedIn, Slack, X) read only the static `index.html`, so every shared link shows the site-wide card. If per-article previews matter, add pre-rendering (e.g. `vite-react-ssg`) later.

## Credits

Based on the "Folio" template by Laurent Begey, distributed by ThemeWagon. Developed by [Bitsophia](https://www.linkedin.com/company/bitsophia-ai/).
