export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative w-full py-12 px-6 sm:px-14 lg:px-28"
      style={{ background: 'var(--background)' }}
    >
      {/* Top divider */}
      <div
        className="h-px mb-10"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
      />

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Brand */}
        <div className="space-y-2">
          <span
            className="font-display text-white block"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', letterSpacing: '5px' }}
          >
            GOTHAM ARCHIVES
          </span>
          <span
            className="font-body block"
            style={{ fontSize: '9px', letterSpacing: '3px', color: 'var(--text-muted)' }}
          >
            CLASSIFIED — RESTRICTED ACCESS
          </span>
        </div>

        {/* Year notice */}
        <span
          className="font-body"
          style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--text-muted)' }}
        >
          MONITORING GOTHAM SINCE 2005 &mdash; {year}
        </span>
      </div>
    </footer>
  )
}

