import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import useReveal from '../hooks/useReveal.js'
import Hero from '../components/Hero.jsx'
import Services from '../components/Services.jsx'
import Work from '../components/Work.jsx'
import About from '../components/About.jsx'
import Skills from '../components/Skills.jsx'
import Blog from '../components/Blog.jsx'
import Contact from '../components/Contact.jsx'

export default function Home() {
  usePageMeta({ path: '/' })
  useReveal()

  return (
    <>
      <Header mode="home" />

      <main id="main">
        {/* HERO */}
        <Hero />

        {/* SERVICES */}
        <Services />

        {/* WORK */}
        <Work />

        {/* ABOUT */}
        <About />

        {/* SKILLS */}
        <Skills />

        {/* BLOG */}
        <Blog />

        {/* CONTACT */}
        <Contact />
      </main>

      <Footer />
    </>
  )
}
