import { motion, AnimatePresence } from 'framer-motion'
import { useDetective } from '@/core/detective/DetectiveContext'

interface Props {
  onAccess: () => void
}

export default function WayneNotebookHighlight({ onAccess }: Props) {
  const { active, scanRevealActive } = useDetective()

  return (
    <>
      <motion.button
        type="button"
        className="absolute pointer-events-auto"
        style={{
          top: '52%', left: '44%', width: '10%', height: '10%',
          background: 'transparent', border: 'none', cursor: 'none',
        }}
        onClick={onAccess}
        onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'ACCESS' }))}
        onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
        aria-label="Access Batcomputer"
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: active ? [0.5, 1, 0.5] : [0.35, 0.7, 0.35] }}
          transition={{ duration: active ? 1.6 : 2.2, repeat: Infinity }}
        >
          <div
            style={{
              width: active ? 14 : 10,
              height: active ? 14 : 10,
              borderRadius: '50%',
              background: 'rgba(30,200,100,0.85)',
              boxShadow: active
                ? '0 0 24px rgba(30,200,100,0.8), 0 0 40px rgba(30,200,100,0.3)'
                : '0 0 14px rgba(30,200,100,0.6)',
              border: active ? '1px solid rgba(140,255,180,0.6)' : 'none',
            }}
          />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {(active || scanRevealActive) && (
          <motion.div
            className="absolute pointer-events-none"
            style={{ top: '58%', left: '32%' }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="px-3 py-2"
              style={{
                background: 'rgba(4,16,10,0.9)',
                border: '1px solid rgba(80,200,140,0.5)',
              }}
            >
              <p className="font-body" style={{ fontSize: '6px', letterSpacing: '2.5px', color: 'rgba(140,230,180,0.95)' }}>
                BATCOMPUTER ACCESS POINT
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!active && (
        <motion.p
          className="absolute font-body pointer-events-none"
          style={{ top: '63%', left: '36%', fontSize: '6px', letterSpacing: '3px', color: 'rgba(30,200,100,0.6)' }}
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ◆ BATCOMPUTER ACCESS
        </motion.p>
      )}
    </>
  )
}
