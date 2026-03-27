'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/data'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) setActiveSection('#' + visible.target.id)
      },
      { threshold: 0.35 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-paper/90 backdrop-blur-md border-b border-ink/8'
          : 'bg-transparent',
      ].join(' ')}
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10 lg:px-16"
      >
        {/* Logo */}
        <a
          href="#"
          aria-label="Awanish Verma — home"
          className="font-heading text-lg font-semibold tracking-tight text-ink transition-colors hover:text-cobalt"
        >
          Awanish.
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={[
                'group relative font-heading text-sm font-medium transition-colors',
                activeSection === href ? 'text-cobalt' : 'text-ink/50 hover:text-ink',
              ].join(' ')}
            >
              {label}
              <span
                className={[
                  'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-300 ease-out',
                  activeSection === href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                ].join(' ')}
              />
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden rounded-full bg-cobalt px-5 py-2 font-heading text-sm font-medium text-paper transition-all hover:bg-cobalt/85 active:scale-95 md:block"
        >
          Let's Talk
        </a>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-md p-2 text-ink transition-colors hover:text-cobalt md:hidden"
        >
          {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 z-40 flex flex-col gap-1 bg-paper px-6 py-8 md:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="rounded-lg px-4 py-4 font-heading text-2xl font-semibold text-ink transition-colors hover:text-cobalt"
            >
              {label}
            </a>
          ))}
          <div className="mt-auto">
            <a
              href="#contact"
              onClick={closeMenu}
              className="block rounded-full bg-cobalt px-6 py-3 text-center font-heading text-sm font-medium text-paper transition-all hover:bg-cobalt/85"
            >
              Let's Talk
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
