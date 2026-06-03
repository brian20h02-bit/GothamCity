import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDetective } from '@/core/detective/DetectiveContext'
import { useScene } from '@/core/navigation/SceneContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function DetectiveHUD() {
  const { currentScene } = useScene()
  const {
    active,
    toggleDetectiveMode,
    triggerScan,
    foundCount,
    totalCount,
    arkhamCaseCompletion,
    wayneCaseCompletion,
    mainInvestigationCompletion,
    scanPhase,
  } = useDetective()

  const scanning = scanPhase !== 'idle'

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.repeat) return
    const tag = (e.target as HTMLElement)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return
    if (e.key === 'q' || e.key === 'Q') {
      e.preventDefault()
      if (active && !scanning) triggerScan(currentScene.id)
    }
    if (e.key === 'd' || e.key === 'D') {
      e.preventDefault()
      toggleDetectiveMode()
    }
  }, [triggerScan, toggleDetectiveMode, active, currentScene.id, scanning])

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  return (
    <motion.div
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[600] flex flex-col items-end gap-2 pointer-events-auto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
    >
      <div
        className="px-4 py-2 text-right"
        style={{
          background: 'rgba(5,5,5,0.82)',
          border: `1px solid ${active ? 'rgba(80,200,140,0.25)' : 'rgba(229,229,229,0.08)'}`,
        }}
      >
        <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.35)' }}>
          CASE COMPLETION
        </p>
        <p className="font-body mt-1" style={{ fontSize: '6px', letterSpacing: '1.5px', color: 'rgba(100,200,140,0.55)' }}>
          ARKHAM {arkhamCaseCompletion}% · WAYNE {wayneCaseCompletion}%
        </p>
        <p className="font-body" style={{ fontSize: '6px', letterSpacing: '1.5px', color: 'rgba(100,200,140,0.45)' }}>
          MAIN {mainInvestigationCompletion}%
        </p>
        <p className="font-display text-white mt-2" style={{ fontSize: '0.85rem', letterSpacing: '2px' }}>
          {String(foundCount).padStart(2, '0')} / {totalCount} EVIDENCE
        </p>
      </div>

      <div className="flex gap-2">
        <motion.button
          type="button"
          className="font-body px-4 py-3"
          style={{
            background: 'rgba(5,5,5,0.85)',
            border: `1px solid ${active ? 'rgba(80,200,140,0.5)' : 'rgba(229,229,229,0.12)'}`,
            fontSize: '7px',
            letterSpacing: '3px',
            color: active ? 'rgba(120,220,160,0.95)' : 'rgba(229,229,229,0.55)',
            cursor: 'none',
            opacity: active && !scanning ? 1 : 0.45,
          }}
          onClick={() => active && !scanning && triggerScan(currentScene.id)}
          disabled={!active || scanning}
          whileHover={active && !scanning ? { borderColor: 'rgba(80,200,140,0.9)' } : {}}
          onMouseEnter={() => active && window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: { actionLine: 'SCAN', targetLine: 'EVIDENCE' } }))}
          onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
        >
          SCAN <span style={{ opacity: 0.4, marginLeft: 6 }}>[Q]</span>
        </motion.button>

        <motion.button
          type="button"
          className="font-body px-4 py-3 min-w-[140px]"
          style={{
            background: active ? 'rgba(4,18,12,0.9)' : 'rgba(5,5,5,0.85)',
            border: `1px solid ${active ? 'rgba(80,200,140,0.55)' : 'rgba(229,229,229,0.12)'}`,
            cursor: 'none',
          }}
          onClick={toggleDetectiveMode}
          whileHover={{ borderColor: active ? 'rgba(80,200,140,0.9)' : 'rgba(229,229,229,0.35)' }}
        >
          <p style={{ fontSize: '6px', letterSpacing: '3px', color: active ? 'rgba(80,200,140,0.7)' : 'rgba(229,229,229,0.35)' }}>
            DETECTIVE MODE
          </p>
          <p
            className="font-display mt-0.5"
            style={{
              fontSize: '0.95rem',
              letterSpacing: '3px',
              color: active ? 'rgba(140,230,180,1)' : 'rgba(229,229,229,0.7)',
            }}
          >
            [ {active ? 'ACTIVE' : 'OFF'} ]
          </p>
        </motion.button>
      </div>
    </motion.div>
  )
}
