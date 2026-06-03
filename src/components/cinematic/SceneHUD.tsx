import { motion, AnimatePresence } from 'framer-motion'
import { useScene } from '@/core/navigation/SceneContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** HUD mínimo — ubicación y código de archivo. Sin botones PREV/NEXT. */
export default function SceneHUD() {
  const { currentScene, transition } = useScene()
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
          <span
            className="font-body"
            style={{ fontSize: '8px', letterSpacing: '3px', color: 'rgba(229,229,229,0.3)' }}
          >
            {currentScene.archiveCode}
          </span>
          <span
            className="font-display text-white"
            style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)', letterSpacing: '3px' }}
          >
            {currentScene.location}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
