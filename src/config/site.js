// Single source of truth for site-wide constants.
// Override the deploy-specific values through environment variables (see .env.example).

const env = import.meta.env

export const SITE = {
  name: 'Sudharsan SM',
  shortName: 'Sudharsan',
  role: 'AI/ML Engineer & Python Developer',
  description:
    'Sudharsan SM — AI/ML Engineer and Python Developer building intelligent applications with Generative AI, FastAPI, machine learning and agentic AI.',
  // Absolute origin of the deployed site, without a trailing slash. Used for canonical + social tags.
  url: (env.VITE_SITE_URL || '').replace(/\/+$/, ''),
  email: 'sudharsanmani423@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sudharsansm',
  github: 'https://github.com/sudharsansm',
  company: { name: 'Bitsophia', linkedin: 'https://www.linkedin.com/company/bitsophia-ai/' },
  formEndpoint: env.VITE_FORM_ENDPOINT || 'https://formspree.io/f/moeedobz',
  ogImage: '/og-image.jpg',
}
