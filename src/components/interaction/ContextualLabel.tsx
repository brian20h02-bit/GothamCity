import { motion, AnimatePresence } from 'framer-motion'
import type { InteractionHint } from '@/core/interaction/contextualLabels'

const FADE = 0.15

interface Props {
  visible: boolean
  hint:    InteractionHint
  variant: 'navigation' | 'evidence' | 'info'
}

const VARIANT_COLORS = {
  navigation: {
    action: 'rgba(229,229,229,0.55)',
    target: 'rgba(229,229,229,0.88)',
  },
  evidence: {
    action: 'rgba(140,230,180,0.55)',
    target: 'rgba(140,230,180,0.88)',
  },
  info: {
    action: 'rgba(229,229,229,0.5)',
    target: 'rgba(229,229,229,0.82)',
  },
} as const

export default function ContextualLabel({ visible, hint, variant }: Props) {
  const colors = VARIANT_COLORS[variant]

  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          key="ctx-label"
          className="absolute font-body pointer-events-none text-center"
          style={{
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 10,
            minWidth: 120,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE }}
        >
          <span
            className="block"
            style={{ fontSize: 7, letterSpacing: '2.5px', color: colors.action, marginBottom: 4 }}
          >
            {hint.actionLine}
          </span>
          <span
            className="block font-display"
            style={{ fontSize: 9, letterSpacing: '2px', color: colors.target }}
          >
            {hint.targetLine}
          </span>
        </motion.span>
      )}
    </AnimatePresence>
  )
}
