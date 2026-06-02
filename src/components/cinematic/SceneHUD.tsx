import { motion, AnimatePresence } from 'framer-motion'
import { useScene } from '@/core/navigation/SceneContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * SceneHUD — minimal bottom-left overlay showing current archive code + location.
 * Also renders subtle prev/next navigation arrows that feel part of the world.
 */
export default function SceneHUD() {
  const { currentScene, navigateNext, navigatePrev, canGoNext, canGoPrev, transition } = useScene()

  const visible = !transition.active

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={currentScene.id + '-hud'}
          className="fixed bottom-8 left-6 sm:left-10 z-[500] flex flex-col gap-1.5 pointer-events-none"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Archive code */}
          <span
            className="font-body"
            style={{ fontSize: '8px', letterSpacing: '3px', color: 'rgba(229,229,229,0.3)' }}
          >
            {currentScene.archiveCode}
          </span>

          {/* Location */}
          <span
            className="font-display text-white"
            style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)', letterSpacing: '3px' }}
          >
            {currentScene.location}
          </span>
        </motion.div>
      )}

      {/* ── Nav arrows ─────────────────────────────────────── */}
      {visible && (
        <motion.div
          key={currentScene.id + '-nav'}
          className="fixed bottom-8 right-6 sm:right-10 z-[500] flex items-center gap-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          {/* Prev */}
          <button
            onClick={navigatePrev}
            disabled={!canGoPrev}
            aria-label="Previous scene"
            className="group flex items-center gap-2 pointer-events-auto transition-opacity duration-300"
            style={{ opacity: canGoPrev ? 0.6 : 0.15 }}
          >
            <span className="font-body" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(229,229,229,0.8)' }}>←</span>
            <span className="font-body" style={{ fontSize: '8px', letterSpacing: '2px', color: 'rgba(229,229,229,0.5)' }}>PREV</span>
          </button>

          {/* Dot separator */}
          <div className="w-px h-3" style={{ background: 'rgba(229,229,229,0.15)' }} />

          {/* Next */}
          <button
            onClick={navigateNext}
            disabled={!canGoNext}
            aria-label="Next scene"
            className="group flex items-center gap-2 pointer-events-auto transition-opacity duration-300"
            style={{ opacity: canGoNext ? 0.6 : 0.15 }}
          >
            <span className="font-body" style={{ fontSize: '8px', letterSpacing: '2px', color: 'rgba(229,229,229,0.5)' }}>NEXT</span>
            <span className="font-body" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(229,229,229,0.8)' }}>→</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
