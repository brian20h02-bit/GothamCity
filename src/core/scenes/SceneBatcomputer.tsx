// @refresh reset
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const BOOT_STEPS = [
  'INITIALIZING SECURE CONNECTION',
  'ACCESSING WAYNE NETWORK',
  'DECRYPTING FILES',
  'AUTHENTICATION COMPLETE',
  'ACCESS GRANTED',
  'BATCOMPUTER ONLINE',
] as const

function BootSequence({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timings = [0, 140, 280, 420, 560, 700]
    const timers: ReturnType<typeof setTimeout>[] = []
    timings.forEach((t, i) => { timers.push(setTimeout(() => setStep(i), t)) })
    timers.push(setTimeout(() => { setTimeout(onDone, 120) }, 880))
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center pointer-events-auto"
      style={{ background: '#000', zIndex: 8500 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="relative w-full max-w-lg px-8 space-y-3">
        {BOOT_STEPS.map((label, i) => (
          <motion.div
            key={label}
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: i <= step ? 1 : 0, x: i <= step ? 0 : -8 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="flex-shrink-0 w-1.5 h-1.5 rounded-full"
              style={{ background: i <= step ? 'rgba(100,180,130,0.5)' : 'transparent' }}
            />
            <p className="font-body" style={{ fontSize: '8px', letterSpacing: '4px', color: i <= step ? 'rgba(100,180,130,0.45)' : 'transparent' }}>
              {label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/** Solo atmósfera — paneles vía BatcomputerPanelLayer; evidencia vía InteractionLayers */
export default function SceneBatcomputer() {
  const [booting, setBooting] = useState(true)
  const handleBootDone = useCallback(() => setBooting(false), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,8,4,0.22) 100%)' }}
      />

      <AnimatePresence>
        {booting && <BootSequence onDone={handleBootDone} />}
      </AnimatePresence>

      {!booting && (
        <motion.p
          className="absolute bottom-6 left-1/2 font-body pointer-events-none"
          style={{ transform: 'translateX(-50%)', fontSize: '6px', letterSpacing: '3px', color: 'rgba(100,200,140,0.2)', zIndex: 2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          SELECT A DISPLAY TO ACCESS — OR ENABLE DETECTIVE MODE TO SCAN
        </motion.p>
      )}
    </div>
  )
}
