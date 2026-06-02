import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from '@/hooks/useInView'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function CrimeAlley() {
  const sectionRef = useRef<HTMLElement>(null)
  const [contentRef, inView] = useInView(0.2)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Parallax for background image
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  // Fog intensifies as section enters view
  const fogOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0, 0.7])

  return (
    <section
      id="crime-alley"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* ── Background image with parallax ───────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute bg-cover bg-center bg-no-repeat"
        style={{
          y: bgY,
          backgroundImage: `url('/images/frente-crime-alley.png')`,
          inset: '-15% 0',
        }}
      />

      {/* ── Base dark overlay ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(to bottom,',
            '  rgba(5,5,5,0.92) 0%,',
            '  rgba(5,5,5,0.45) 25%,',
            '  rgba(5,5,5,0.45) 75%,',
            '  rgba(5,5,5,0.95) 100%)',
          ].join('\n'),
        }}
      />

      {/* ── Fog that intensifies on scroll ───────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '50%',
          opacity: fogOpacity,
          background: 'linear-gradient(to top, rgba(5,5,5,0.8) 0%, transparent 100%)',
        }}
      />

      {/* ── Subtle red light bleed (danger accent) ────────────── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '30%',
          left: '-5%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(ellipse, rgba(139,0,0,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* ── Content ──────────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-end min-h-screen px-6 sm:px-14 lg:px-28 pb-24 pt-24 max-w-6xl mx-auto w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: EASE }}
          className="space-y-4 max-w-lg"
        >
          {/* Case file label */}
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-px"
              style={{ background: 'var(--blood)' }}
            />
            <span
              className="font-body"
              style={{
                fontSize: '10px',
                letterSpacing: '5px',
                color: 'var(--blood)',
              }}
            >
              CASE FILE 001
            </span>
          </div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            className="font-display text-white leading-none"
            style={{
              fontSize: 'clamp(3.5rem, 9vw, 7.5rem)',
              letterSpacing: '3px',
            }}
          >
            CRIME ALLEY
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.3, ease: EASE }}
            className="font-body font-light leading-[1.9] italic"
            style={{
              fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
              color: 'var(--text-secondary)',
            }}
          >
            Every city has a wound. Gotham never recovered from this one.
          </motion.p>

          {/* Metadata row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-6 pt-2"
          >
            {[
              ['LOCATION', 'Park Row, Gotham'],
              ['STATUS',   'OPEN'],
              ['THREAT',   'CRITICAL'],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <span
                  className="font-body"
                  style={{ fontSize: '8px', letterSpacing: '3px', color: 'var(--text-muted)' }}
                >
                  {label}
                </span>
                <span
                  className="font-body font-medium"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '1px',
                    color: value === 'CRITICAL' ? 'var(--blood)' : 'var(--text-secondary)',
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
