import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInvestigation } from '@/core/investigation/InvestigationContext'
import type { Evidence } from '@/data/evidence'

interface EvidenceHotspotProps {
  evidence: Evidence
  /** Position relative to scene container (%) */
  top:    number
  left:   number
  /** Hit area radius in px */
  radius?: number
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function EvidenceHotspot({ evidence, top, left, radius = 40 }: EvidenceHotspotProps) {
  const { discoverEvidence, isEvidenceFound } = useInvestigation()
  const [hovered, setHovered] = useState(false)
  const found = isEvidenceFound(evidence.id)

  const handleEnter = useCallback(() => {
    setHovered(true)
    window.dispatchEvent(
      new CustomEvent('hotspot-enter', { detail: found ? 'EXAMINE' : 'INVESTIGATE' }),
    )
  }, [found, evidence])

  const handleLeave = useCallback(() => {
    setHovered(false)
    window.dispatchEvent(new CustomEvent('hotspot-leave'))
  }, [])

  const handleClick = useCallback(() => {
    if (found) return
    discoverEvidence(evidence.id)
  }, [found, evidence.id, discoverEvidence])

  return (
    <button
      className="absolute pointer-events-auto"
      style={{
        top:       `${top}%`,
        left:      `${left}%`,
        width:     `${radius * 2}px`,
        height:    `${radius * 2}px`,
        transform: 'translate(-50%, -50%)',
        background: 'transparent',
        border:     'none',
        zIndex:     20,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      aria-label={`Investigate: ${evidence.title}`}
    >
      {/* ── Pulsing ring on hover (undiscovered) ─────── */}
      <AnimatePresence>
        {hovered && !found && (
          <motion.span
            key="ring"
            className="absolute rounded-full pointer-events-none"
            style={{
              top:    '50%',
              left:   '50%',
              width:  '36px',
              height: '36px',
              border: '1px solid rgba(229,229,229,0.5)',
              transform: 'translate(-50%,-50%)',
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.7, 1.4, 1.8] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* ── Center dot (hover state) ──────────────────── */}
      <AnimatePresence>
        {hovered && !found && (
          <motion.span
            key="dot"
            className="absolute rounded-full pointer-events-none"
            style={{
              top:    '50%',
              left:   '50%',
              width:  '6px',
              height: '6px',
              background: 'rgba(229,229,229,0.7)',
              transform:  'translate(-50%,-50%)',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: EASE }}
          />
        )}
      </AnimatePresence>

      {/* ── Found indicator (persistent subtle glow) ──── */}
      {found && (
        <motion.span
          className="absolute rounded-full pointer-events-none"
          style={{
            top:    '50%',
            left:   '50%',
            width:  '10px',
            height: '10px',
            background: 'rgba(139,0,0,0.6)',
            transform:  'translate(-50%,-50%)',
            boxShadow:  '0 0 8px 3px rgba(139,0,0,0.3)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      )}

      {/* ── Hover label ───────────────────────────────── */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="label"
            className="absolute pointer-events-none font-body"
            style={{
              top:           'calc(100% + 8px)',
              left:          '50%',
              transform:     'translateX(-50%)',
              fontSize:      '7px',
              letterSpacing: '2px',
              color:         found ? 'var(--blood)' : 'rgba(229,229,229,0.65)',
              whiteSpace:    'nowrap',
            }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {found ? `✓ ${evidence.title}` : evidence.title}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
