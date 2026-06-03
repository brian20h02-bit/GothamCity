import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  highlighted: boolean
  subtle:      boolean
  hovered?:    boolean
}

export default function DetectiveEvidenceVisual({ highlighted, subtle, hovered = false }: Props) {
  const visible = highlighted || subtle || hovered

  return (
    <>
      <AnimatePresence>
        {(highlighted || hovered) && (
          <motion.span
            key="ring"
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: '1px solid rgba(100,220,160,0.7)' }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.2, 0.9] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
      </AnimatePresence>
      {visible && (
        <span
          className="absolute rounded-full pointer-events-none"
          style={{
            top: '50%', left: '50%', width: 8, height: 8,
            transform: 'translate(-50%,-50%)',
            background: highlighted ? 'rgba(100,220,160,0.9)' : 'rgba(100,200,140,0.45)',
            boxShadow: highlighted ? '0 0 12px rgba(80,200,140,0.7)' : 'none',
            opacity: subtle && !highlighted && !hovered ? 0.55 : 1,
          }}
        />
      )}
    </>
  )
}
