import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from '@/hooks/useInView'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Memorial() {
  const sectionRef = useRef<HTMLElement>(null)
  const [contentRef, inView] = useInView(0.15)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY   = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section
      id="memorial"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* ── Background image — blurs into focus on enter ──────── */}
      <motion.div
        aria-hidden="true"
        className="absolute bg-cover bg-center bg-no-repeat"
        initial={{ filter: 'blur(14px)', scale: 1.06 }}
        animate={inView ? { filter: 'blur(0px)', scale: 1 } : {}}
        transition={{ duration: 2.2, ease: EASE }}
        style={{
          y: bgY,
          backgroundImage: `url('/images/rosas-calle.png')`,
          inset: '-12% 0',
        }}
      />

      {/* ── Dark overlay — heavier at top and bottom ─────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(to bottom,',
            '  rgba(5,5,5,0.96) 0%,',
            '  rgba(5,5,5,0.55) 30%,',
            '  rgba(5,5,5,0.38) 60%,',
            '  rgba(5,5,5,0.90) 100%)',
          ].join('\n'),
        }}
      />

      {/* ── Atmospheric red tint near roses (very subtle) ────── */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 3.0, ease: 'easeOut' }}
        className="absolute pointer-events-none"
        style={{
          bottom: '20%',
          right: '20%',
          width: '35%',
          height: '30%',
          background: 'radial-gradient(ellipse, rgba(139,0,0,0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* ── Content — mostly negative space, minimal text ────── */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-center min-h-screen px-6 sm:px-14 lg:px-28 max-w-6xl mx-auto w-full"
      >
        {/* Upper third: label only */}
        <div className="mb-auto pt-24">
          <motion.span
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            className="font-body"
            style={{
              display: 'inline-block',
              fontSize: '10px',
              letterSpacing: '5px',
              color: 'var(--text-muted)',
            }}
          >
            ARCHIVE NOTE
          </motion.span>
        </div>

        {/* Center: just the title — vast negative space around it */}
        <div className="py-20 max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.6, delay: 0.6, ease: EASE }}
            className="font-display text-white leading-[1.05]"
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              letterSpacing: '2px',
            }}
          >
            SOME STORIES BEGIN
            <br />
            WITH A TRAGEDY.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1.4, delay: 1.2, ease: 'easeOut' }}
            className="mt-8 font-body font-light leading-[2] max-w-sm"
            style={{
              fontSize: 'clamp(0.8rem, 1.1vw, 0.9rem)',
              color: 'var(--text-secondary)',
            }}
          >
            Certain events never leave a city.
            <br />
            They become part of its foundations.
          </motion.p>
        </div>

        {/* Bottom: thin separator line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 1.8, ease: EASE }}
          className="pb-16 mt-auto"
          style={{ originX: 0 }}
        >
          <div className="h-px w-24" style={{ background: 'rgba(229,229,229,0.12)' }} />
        </motion.div>
      </div>
    </section>
  )
}
