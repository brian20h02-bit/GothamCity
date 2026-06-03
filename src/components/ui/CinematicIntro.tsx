import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { immersionAudio } from '@/sound/ImmersionAudioEngine'
import { getIntroAtmosphere } from '@/data/sceneAtmosphere'
import SceneFog from '@/components/immersion/SceneFog'
import AtmosphericHaze from '@/components/atmosphere/AtmosphericHaze'

interface CinematicIntroProps {
  onComplete: () => void
}

type Phase =
  | 'dark'
  | 'wayne'
  | 'network'
  | 'accessing'
  | 'encrypted'
  | 'loaded'
  | 'welcome'
  | 'exit'

const TIMINGS: Record<Phase, number> = {
  dark:       700,
  wayne:      900,
  network:    700,
  accessing:  800,
  encrypted:  800,
  loaded:     800,
  welcome:    900,
  exit:       600,
}

const EASE_CINEMA: [number, number, number, number] = [0.22, 1, 0.36, 1]

const textVariants = {
  hidden:  { opacity: 0, filter: 'blur(12px)', y: 8 },
  visible: { opacity: 1, filter: 'blur(0px)',  y: 0 },
  exit:    { opacity: 0, filter: 'blur(6px)',  y: -4 },
}

const LINES: { phase: Phase; text: string; size?: 'lg' | 'sm' }[] = [
  { phase: 'wayne',      text: 'WAYNE ARCHIVES',              size: 'lg' },
  { phase: 'network',    text: 'GOTHAM CITY NETWORK',         size: 'sm' },
  { phase: 'accessing',  text: 'ACCESSING FILES...',          size: 'sm' },
  { phase: 'encrypted',  text: 'ENCRYPTED CONNECTION ESTABLISHED', size: 'sm' },
  { phase: 'loaded',     text: 'CASE DATABASE LOADED',        size: 'sm' },
  { phase: 'welcome',    text: 'WELCOME DETECTIVE',           size: 'sm' },
]

const INTRO_PROFILE = getIntroAtmosphere()

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<Phase>('dark')
  const [visible, setVisible] = useState(true)
  const [shownPhases, setShownPhases] = useState<Set<Phase>>(new Set())

  useEffect(() => {
    const startAmbience = () => {
      immersionAudio.playIntroAmbience()
      window.removeEventListener('pointerdown', startAmbience)
      window.removeEventListener('keydown', startAmbience)
    }
    window.addEventListener('pointerdown', startAmbience, { once: true })
    window.addEventListener('keydown', startAmbience, { once: true })

    const sequence: Phase[] = [
      'dark', 'wayne', 'network', 'accessing', 'encrypted', 'loaded', 'welcome', 'exit',
    ]
    let accumulated = 0
    const timers: ReturnType<typeof setTimeout>[] = []

    sequence.forEach((p) => {
      timers.push(setTimeout(() => {
        setPhase(p)
        if (p !== 'dark' && p !== 'exit') {
          setShownPhases(prev => new Set([...prev, p]))
        }
      }, accumulated))
      accumulated += TIMINGS[p]
    })

    timers.push(setTimeout(() => {
      setVisible(false)
      immersionAudio.stopIntroAmbience()
      setTimeout(onComplete, 700)
    }, accumulated))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  const activeLines = LINES.filter(l => shownPhases.has(l.phase))

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cinematic-intro"
          className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden"
          style={{ zIndex: 10000 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE_CINEMA }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <AtmosphericHaze level={INTRO_PROFILE.humidity} region="gotham" zIndex={1} />
            <SceneFog
              density={INTRO_PROFILE.fogDensity}
              variant={INTRO_PROFILE.fogVariant}
              region="gotham"
              tint={INTRO_PROFILE.fogTint}
              windAngle={INTRO_PROFILE.rainWind}
              strength={0.85}
              zIndex={2}
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 3,
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,8,12,0.55) 100%)',
            }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ zIndex: 11, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 4.5, ease: 'linear', repeat: Infinity }}
          />

          <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center select-none min-h-[200px]">
            <AnimatePresence mode="popLayout">
              {activeLines.map((line) => (
                <motion.div
                  key={line.phase}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.65, ease: EASE_CINEMA }}
                >
                  {line.size === 'lg' ? (
                    <h1
                      className="font-display text-white"
                      style={{
                        fontSize: 'clamp(2rem, 7vw, 5.5rem)',
                        letterSpacing: '10px',
                        lineHeight: 1,
                      }}
                    >
                      {line.text}
                    </h1>
                  ) : (
                    <p
                      className="font-body text-[var(--text-secondary)]"
                      style={{
                        fontSize: 'clamp(0.55rem, 1.1vw, 0.72rem)',
                        letterSpacing: line.phase === 'welcome' ? '6px' : '4px',
                        color: line.phase === 'welcome' ? 'var(--light)' : undefined,
                      }}
                    >
                      {line.text}
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {phase !== 'dark' && phase !== 'exit' && (
              <motion.span
                className="mt-4 font-body text-[var(--text-muted)]"
                style={{ fontSize: '9px', letterSpacing: '3px' }}
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                ▌
              </motion.span>
            )}
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10" aria-hidden="true">
            <motion.span
              className="font-body text-[var(--text-muted)]"
              style={{ fontSize: '9px', letterSpacing: '3px' }}
              animate={{ opacity: [0.25, 0.5, 0.25] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              GIN — GOTHAM INTELLIGENCE NETWORK — CLASSIFIED
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
