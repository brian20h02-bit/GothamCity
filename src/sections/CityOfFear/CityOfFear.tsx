import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useInView } from '@/hooks/useInView'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const PHRASES = [
  'Fear is contagious.',
  'Every corner tells a story.',
  'Nobody walks alone after midnight.',
  'The city is always watching.',
  'Some crimes never disappear.',
  'Darkness has an address.',
  'The rain never washes everything away.',
]

const PHRASE_DURATION = 5000  // ms total per phrase
const FADE_DURATION   = 900   // ms in/out

// Typewriter: reveals character by character after fade-in settles
function Typewriter({ text, active }: { text: string; active: boolean }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active) { setDisplayed(''); setDone(false); return }

    // Start typing after fade-in + small buffer
    const startDelay = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) { clearInterval(interval); setDone(true) }
      }, 48)
      return () => clearInterval(interval)
    }, FADE_DURATION + 100)

    return () => clearTimeout(startDelay)
  }, [text, active])

  return (
    <span>
      {displayed}
      {active && !done && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
          style={{ display: 'inline-block', width: '2px', height: '1em', background: 'var(--light)', marginLeft: '3px', verticalAlign: 'middle' }}
        />
      )}
    </span>
  )
}

export default function CityOfFear() {
  const sectionRef = useRef<HTMLElement>(null)
  const [contentRef, inView] = useInView(0.2)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  // Start rotating once section is in view
  useEffect(() => {
    if (!inView) return
    setVisible(true)

    const cycle = () => {
      setVisible(false)
      setTimeout(() => {
        setPhraseIndex(prev => (prev + 1) % PHRASES.length)
        setVisible(true)
      }, FADE_DURATION + 60)
    }

    const interval = setInterval(cycle, PHRASE_DURATION)
    return () => clearInterval(interval)
  }, [inView])

  return (
    <section
      id="city-of-fear"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* ── Background — callejón luz roja ────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute bg-cover bg-center bg-no-repeat"
        style={{
          y: bgY,
          backgroundImage: `url('/images/callejon-luz-roja.png')`,
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
            '  rgba(5,5,5,0.88) 0%,',
            '  rgba(5,5,5,0.60) 35%,',
            '  rgba(5,5,5,0.60) 65%,',
            '  rgba(5,5,5,0.92) 100%)',
          ].join('\n'),
        }}
      />

      {/* ── Blood-red atmospheric tint ────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 50%, rgba(100,0,0,0.10) 0%, transparent 60%)',
        }}
      />

      {/* ── Content ──────────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen
                   px-6 sm:px-14 lg:px-28 text-center"
      >
        {/* Top label */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.0, ease: EASE }}
          className="font-body block mb-14"
          style={{ fontSize: '9px', letterSpacing: '6px', color: 'var(--text-muted)' }}
        >
          GOTHAM CITY — ACTIVE INTELLIGENCE
        </motion.span>

        {/* Rotating phrases */}
        <div
          className="relative"
          style={{ minHeight: 'clamp(4rem, 10vw, 8rem)' }}
        >
          <AnimatePresence mode="wait">
            {visible && (
              <motion.div
                key={phraseIndex}
                initial={{ opacity: 0, filter: 'blur(6px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(4px)', y: -8 }}
                transition={{ duration: FADE_DURATION / 1000, ease: EASE }}
                className="font-display text-white text-center"
                style={{
                  fontSize: 'clamp(2.2rem, 5.5vw, 4.8rem)',
                  letterSpacing: '2px',
                  lineHeight: 1.1,
                  maxWidth: '820px',
                }}
              >
                <Typewriter text={PHRASES[phraseIndex]} active={visible} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Case file stamp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.0, delay: 0.5 }}
          className="mt-16 flex items-center gap-4"
        >
          <div className="h-px w-10" style={{ background: 'rgba(139,0,0,0.6)' }} />
          <span
            className="font-body"
            style={{ fontSize: '9px', letterSpacing: '4px', color: 'rgba(139,0,0,0.7)' }}
          >
            CLASSIFIED — GCPD INTELLIGENCE DIVISION
          </span>
          <div className="h-px w-10" style={{ background: 'rgba(139,0,0,0.6)' }} />
        </motion.div>

        {/* Phrase counter dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 flex gap-2"
        >
          {PHRASES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width:  i === phraseIndex ? '16px' : '4px',
                height: '4px',
                background: i === phraseIndex ? 'rgba(229,229,229,0.5)' : 'rgba(229,229,229,0.15)',
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
