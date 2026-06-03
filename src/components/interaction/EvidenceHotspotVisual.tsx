import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  hovered?: boolean
  found?:   boolean
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function EvidenceHotspotVisual({ hovered = false, found = false }: Props) {
  if (found) {
    return (
      <span
        className="absolute rounded-full pointer-events-none"
        style={{
          top: '50%', left: '50%', width: 10, height: 10,
          transform: 'translate(-50%,-50%)',
          background: 'rgba(139,0,0,0.6)',
          boxShadow: '0 0 8px 3px rgba(139,0,0,0.3)',
        }}
      />
    )
  }

  return (
    <>
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="ring"
            className="absolute rounded-full pointer-events-none"
            style={{
              top: '50%', left: '50%', width: 36, height: 36,
              border: '1px solid rgba(229,229,229,0.5)',
              transform: 'translate(-50%,-50%)',
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.7, 1.4, 1.8] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="dot"
            className="absolute rounded-full pointer-events-none"
            style={{
              top: '50%', left: '50%', width: 6, height: 6,
              background: 'rgba(229,229,229,0.7)',
              transform: 'translate(-50%,-50%)',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: EASE }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
