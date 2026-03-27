export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="border-t border-ink/8 bg-paper px-6 py-10 md:px-10 lg:px-16"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Logo + tagline */}
        <div className="flex flex-col gap-1">
          <a
            href="#"
            aria-label="Awanish Verma — back to top"
            className="font-heading text-base font-semibold tracking-tight text-ink transition-colors hover:text-cobalt"
          >
            Awanish.
          </a>
          <p className="font-heading text-xs text-ink/35">
            Designed with precision &amp; care.
          </p>
        </div>

        {/* Copyright */}
        <p className="font-heading text-xs text-ink/30">
          © {new Date().getFullYear()} Awanish Verma. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
