import { motion, AnimatePresence } from 'framer-motion'
import { BatcomputerPanelContent } from '@/components/batcomputer/BatcomputerHubPanels'
import type { BatcomputerPanelId } from '@/data/batcomputerPanelAnchors'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const FADE = 0.2

interface Props {
  open:      boolean
  onClose:   () => void
  panelId:   BatcomputerPanelId
  title:     string
}

export default function BatcomputerPanelModal({ open, onClose, panelId, title }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key={panelId}
          className="fixed inset-0 flex items-center justify-center pointer-events-auto"
          style={{ zIndex: 8600, background: 'rgba(2,6,4,0.78)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-2xl mx-4 max-h-[82vh] overflow-y-auto p-6"
            style={{
              background: 'rgba(4,14,10,0.94)',
              border: '1px solid rgba(100,200,140,0.18)',
              backdropFilter: 'blur(12px)',
            }}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: FADE, ease: EASE }}
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close panel"
              className="absolute top-4 right-4 font-body pointer-events-auto"
              style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(100,200,140,0.45)', background: 'none', border: 'none', cursor: 'none' }}
              onClick={onClose}
            >
              CLOSE ✕
            </button>

            <p className="font-body mb-1" style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(100,200,140,0.45)' }}>
              BATCOMPUTER — SECURE DISPLAY
            </p>
            <h2 className="font-display mb-6" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', letterSpacing: '4px', color: 'rgba(220,240,230,0.9)' }}>
              {title}
            </h2>

            <BatcomputerPanelContent panelId={panelId} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
