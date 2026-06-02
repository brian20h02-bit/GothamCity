import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from '@/hooks/useInView'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// Ambient particle blob — almost invisible humidity/dust
function AmbientParticle({
  x, y, size, duration, delay,
}: {
  x: string; y: string; size: number; duration: number; delay: number
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(200,210,220,0.6) 0%, transparent 70%)',
        filter: 'blur(1px)',
      }}
      animate={{
        y: [0, -28, 8, -14, 0],
        x: [0, 12, -8, 6, 0],
        opacity: [0, 0.18, 0.1, 0.15, 0],
        scale: [0.8, 1.2, 0.9, 1.1, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

const PARTICLES = [
  { x: '12%',  y: '30%', size: 3, duration: 9,  delay: 0    },
  { x: '25%',  y: '60%', size: 2, duration: 11, delay: 1.5  },
  { x: '40%',  y: '20%', size: 4, duration: 13, delay: 0.8  },
  { x: '55%',  y: '75%', size: 2, duration: 10, delay: 2.2  },
  { x: '68%',  y: '40%', size: 3, duration: 12, delay: 0.3  },
  { x: '78%',  y: '15%', size: 2, duration: 14, delay: 3.0  },
  { x: '88%',  y: '55%', size: 3, duration: 8,  delay: 1.0  },
  { x: '6%',   y: '80%', size: 2, duration: 10, delay: 2.7  },
  { x: '48%',  y: '50%', size: 2, duration: 15, delay: 0.5  },
  { x: '92%',  y: '70%', size: 3, duration: 11, delay: 1.8  },
  { x: '33%',  y: '88%', size: 2, duration: 9,  delay: 4.0  },
  { x: '72%',  y: '90%', size: 2, duration: 13, delay: 2.0  },
]

export default function GothamUnderground() {
  const sectionRef = useRef<HTMLElement>(null)
  const [contentRef, inView] = useInView(0.18)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY        = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const fogOpacity = useTransform(scrollYProgress, [0.15, 0.55], [0, 0.65])

  return (
    <section
      id="gotham-underground"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* ── Background — calle con autos ─────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute bg-cover bg-center bg-no-repeat"
        style={{
          y: bgY,
          backgroundImage: `url('/images/calle-autos.png')`,
          inset: '-12% 0',
        }}
      />

      {/* ── Base overlay ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(to bottom,',
            '  rgba(5,5,5,0.97) 0%,',
            '  rgba(5,5,5,0.50) 25%,',
            '  rgba(5,5,5,0.42) 65%,',
            '  rgba(5,5,5,0.94) 100%)',
          ].join('\n'),
        }}
      />

      {/* ── Dynamic fog on scroll ─────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '55%',
          opacity: fogOpacity,
          background: 'linear-gradient(to top, rgba(5,5,5,0.85) 0%, transparent 100%)',
        }}
      />

      {/* ── Ambient particles ─────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p, i) => (
          <AmbientParticle key={i} {...p} />
        ))}
      </div>

      {/* ── Red light bleed — urban atmosphere ───────────────── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '35%',
          right: '-5%',
          width: '45%',
          height: '45%',
          background: 'radial-gradient(ellipse, rgba(139,0,0,0.07) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* ── Content ──────────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-end min-h-screen
                   px-6 sm:px-14 lg:px-28 pb-24 pt-24 max-w-6xl mx-auto w-full"
      >
        <div className="space-y-5 max-w-xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            className="flex items-center gap-3"
          >
            <div className="w-5 h-px" style={{ background: 'rgba(229,229,229,0.2)' }} />
            <span
              className="font-body"
              style={{ fontSize: '10px', letterSpacing: '5px', color: 'var(--text-muted)' }}
            >
              GOTHAM DISTRICT REPORT
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '3px' }}
          >
            GOTHAM<br />UNDERGROUND
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.32, ease: EASE }}
            className="font-body font-light italic"
            style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}
          >
            The city beneath the headlines.
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            style={{ originX: 0, height: '1px', width: '48px', background: 'rgba(229,229,229,0.15)' }}
          />

          {/* Body text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.58, ease: 'easeOut' }}
            className="font-body font-light leading-[1.95] max-w-sm"
            style={{ fontSize: 'clamp(0.78rem, 1vw, 0.88rem)', color: 'var(--text-secondary)' }}
          >
            While the towers shine above the clouds, entire districts survive in darkness.
            Forgotten by politicians. Controlled by fear.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
