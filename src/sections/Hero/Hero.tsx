import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.0, delay, ease: EASE },
})

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.9, delay, ease: 'easeOut' },
})

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Parallax: background shifts by 20% of the section height as we scroll past
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  // Content fades out slightly on scroll
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const contentY       = useTransform(scrollYProgress, [0, 0.6], ['0%', '-8%'])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[640px] overflow-hidden flex flex-col"
    >
      {/* ── Layer 1: Parallax background image ───────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute bg-cover bg-center bg-no-repeat"
        style={{
          y: bgY,
          backgroundImage: `url('/images/balcon-rejas.png')`,
          inset: '-15% 0',
        }}
      />

      {/* ── Layer 2: Dark cinematic overlay ──────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(to bottom,',
            '  rgba(5,5,5,0.50) 0%,',
            '  rgba(5,5,5,0.28) 35%,',
            '  rgba(5,5,5,0.55) 70%,',
            '  rgba(5,5,5,0.98) 100%)',
          ].join('\n'),
        }}
      />

      {/* ── Layer 3: Local fog (bottom) ───────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-56 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.4) 60%, transparent 100%)',
        }}
      />

      {/* ── Layer 5: Content ──────────────────────────────────── */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-14 lg:px-28 max-w-6xl mx-auto w-full"
      >
        {/* Classification tag */}
        <motion.div {...fadeIn(0.2)} className="mb-7">
          <span
            className="inline-flex items-center gap-2.5 font-body text-[var(--text-secondary)]"
            style={{ fontSize: '10px', letterSpacing: '4px' }}
          >
            <span className="block w-4 h-px bg-[var(--text-muted)]" />
            CLASSIFIED CITY ARCHIVES
            <span className="block w-4 h-px bg-[var(--text-muted)]" />
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          {...fadeUp(0.38)}
          className="font-display text-white leading-none"
          style={{
            fontSize: 'clamp(4.5rem, 13vw, 11rem)',
            letterSpacing: '4px',
          }}
        >
          GOTHAM CITY
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.55)}
          className="mt-3 font-body font-light italic"
          style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
            color: 'var(--text-secondary)',
            letterSpacing: '1px',
          }}
        >
          A city built on fear.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          className="mt-7 mb-7 h-px w-16"
          style={{ originX: 0, background: 'rgba(229,229,229,0.25)' }}
        />

        {/* Description */}
        <motion.p
          {...fadeUp(0.8)}
          className="max-w-md font-body font-normal leading-[1.8]"
          style={{
            fontSize: 'clamp(0.82rem, 1.1vw, 0.93rem)',
            color: 'var(--text-secondary)',
          }}
        >
          Explore classified records, forgotten locations and the events that transformed
          Gotham into the most dangerous city in America.
        </motion.p>

        {/* CTA buttons */}
        <motion.div {...fadeUp(1.0)} className="mt-10 flex flex-wrap gap-4">
          {/* Primary */}
          <button
            className="group relative px-8 py-3.5 overflow-hidden font-body font-medium text-black transition-all duration-500"
            style={{
              fontSize: '11px',
              letterSpacing: '3px',
              background: 'var(--light)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--light)' }}
          >
            ENTER ARCHIVES
          </button>

          {/* Secondary */}
          <button
            className="px-8 py-3.5 font-body font-medium text-[var(--light)] border border-[var(--border)] transition-all duration-500 hover:border-[var(--light)]"
            style={{ fontSize: '11px', letterSpacing: '3px', background: 'transparent' }}
          >
            EXPLORE CITY
          </button>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <motion.div
        {...fadeIn(1.4)}
        className="relative z-10 pb-10 flex flex-col items-center gap-3 self-center"
      >
        <span
          className="font-body text-[var(--text-muted)]"
          style={{ fontSize: '9px', letterSpacing: '4px' }}
        >
          SCROLL TO INVESTIGATE
        </span>
        <div className="relative w-px h-12 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="absolute top-0 left-0 w-full"
            style={{ height: '40%', background: 'var(--light)' }}
            animate={{ y: ['0%', '260%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          />
        </div>
      </motion.div>
    </section>
  )
}
