import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDetective } from '@/core/detective/DetectiveContext'
import type { DetectiveEvidence } from '@/data/detectiveEvidence'

interface Props {
  evidence:    DetectiveEvidence
  highlighted: boolean
  subtle:      boolean
}

export default function DetectiveEvidenceHotspot({ evidence, highlighted, subtle }: Props) {
  const { discoverEvidence, isEvidenceFound, active } = useDetective()
  const [hovered, setHovered] = useState(false)
  const found = isEvidenceFound(evidence.id)

  const handleClick = useCallback(() => {
    if (!found && (highlighted || active)) discoverEvidence(evidence.id)
  }, [found, highlighted, active, evidence.id, discoverEvidence])

  if (found) return null

  const pulseOpacity = highlighted ? 1 : subtle ? 0.55 : hovered ? 1 : 0

  return (
    <button
      type="button"
      className="absolute pointer-events-auto"
      style={{
        top:       `${evidence.top}%`,
        left:      `${evidence.left}%`,
        width:     '72px',
        height:    '72px',
        transform: 'translate(-50%, -50%)',
        background: 'transparent',
        border:     'none',
        cursor:    'none',
        opacity:   pulseOpacity,
      }}
      onClick={handleClick}
      onMouseEnter={() => {
        setHovered(true)
        window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'ANALYZE' }))
      }}
      onMouseLeave={() => {
        setHovered(false)
        window.dispatchEvent(new CustomEvent('hotspot-leave'))
      }}
      aria-label={evidence.title}
    >
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
      <span
        className="absolute rounded-full"
        style={{
          top: '50%', left: '50%', width: 8, height: 8,
          transform: 'translate(-50%,-50%)',
          background: highlighted ? 'rgba(100,220,160,0.9)' : 'rgba(100,200,140,0.45)',
          boxShadow: highlighted ? '0 0 12px rgba(80,200,140,0.7)' : 'none',
        }}
      />
      {(highlighted || hovered) && (
        <span
          className="absolute font-body whitespace-nowrap"
          style={{
            top: '100%', left: '50%', transform: 'translateX(-50%)',
            marginTop: 6, fontSize: '6px', letterSpacing: '2px',
            color: 'rgba(140,230,180,0.9)',
          }}
        >
          {evidence.title}
        </span>
      )}
    </button>
  )
}
