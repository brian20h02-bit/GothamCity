import { motion, AnimatePresence } from 'framer-motion'
import { useDetective } from '@/core/detective/DetectiveContext'
import { useScene } from '@/core/navigation/SceneContext'
import { getScanCluesForScene } from '@/data/detectiveClues'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Etiquetas de escaneo — solo visual, nunca captura clicks */
export default function DetectiveCluesVisual() {
  const { currentScene } = useScene()
  const { active, scanMessageActive, scanPhase } = useDetective()

  if (!active || !scanMessageActive || scanPhase !== 'message') return null

  const clues = getScanCluesForScene(currentScene.id)

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 12 }}>
      <AnimatePresence>
        {clues.map((clue, i) => (
          <motion.div
            key={`${clue.sceneId}-${i}`}
            className="absolute"
            style={{
              top: `${clue.top}%`,
              left: `${clue.left}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, delay: i * 0.05, ease: EASE }}
          >
            <div
              className="px-3 py-2 text-center"
              style={{
                background: 'rgba(4,16,10,0.88)',
                border: '1px solid rgba(80,200,140,0.45)',
                boxShadow: '0 0 20px rgba(60,180,120,0.15)',
              }}
            >
              {clue.lines.map((line, j) => (
                <p
                  key={line}
                  className="font-body"
                  style={{
                    fontSize: j === 0 ? '7px' : '6px',
                    letterSpacing: '2.5px',
                    color: j === 0 ? 'rgba(140,230,180,0.95)' : 'rgba(100,200,140,0.65)',
                    lineHeight: 1.6,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
