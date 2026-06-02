import { motion } from 'framer-motion'
import { useScene } from '@/core/navigation/SceneContext'
import EvidenceHotspot from '@/components/interactive/EvidenceHotspot'
import EvidencePanel from '@/components/interactive/EvidencePanel'
import { getEvidenceByScene } from '@/data/evidence'

const SCENE_ID = 'crime-alley-investigation'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// Evidence positions on the scene image (% of viewport)
const HOTSPOT_CONFIG = [
  { id: 'broken-camera',   top: 15, left: 74 },
  { id: 'witness-report',  top: 62, left: 12 },
  { id: 'rose-fragment',   top: 78, left: 48 },
  { id: 'anonymous-letter', top: 44, left: 83 },
]

const sceneEvidence = getEvidenceByScene(SCENE_ID)

export default function SceneCrimeAlleyInvestigation() {
  const { navigateTo } = useScene()

  return (
    <div className="absolute inset-0">
      {/* ── Atmospheric overlays ───────────────────────────── */}
      {/* Red glow left */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/3 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at left center, rgba(139,0,0,0.18) 0%, transparent 70%)',
        }}
      />

      {/* ── Evidence hotspots ──────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {HOTSPOT_CONFIG.map(cfg => {
          const ev = sceneEvidence.find(e => e.id === cfg.id)
          if (!ev) return null
          return (
            <EvidenceHotspot
              key={ev.id}
              evidence={ev}
              top={cfg.top}
              left={cfg.left}
              radius={38}
            />
          )
        })}
      </div>

      {/* ── Evidence panel (top right) ─────────────────────── */}
      <EvidencePanel sceneId={SCENE_ID} title="CRIME ALLEY — EVIDENCE" />

      {/* ── Bottom narrative block ─────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none pb-28 px-10 sm:px-16">
        <motion.span
          className="block font-body mb-3"
          style={{ fontSize: '9px', letterSpacing: '5px', color: 'var(--blood)' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
        >
          CASE FILE 001 — ACTIVE INVESTIGATION
        </motion.span>

        <motion.h1
          className="font-display text-white mb-3"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '4px', lineHeight: 1 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
        >
          CRIME ALLEY
        </motion.h1>

        <motion.p
          className="font-body"
          style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--text-secondary)', lineHeight: 1.8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
        >
          Hover to find evidence. Click to recover.
        </motion.p>
      </div>

      {/* ── Return to archives ─────────────────────────────── */}
      <motion.button
        className="absolute bottom-8 left-10 sm:left-16 pointer-events-auto font-body"
        style={{ fontSize: '8px', letterSpacing: '3px', color: 'rgba(229,229,229,0.4)', background: 'transparent', border: 'none' }}
        onClick={() => navigateTo('the-archives', 'archive')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
        whileHover={{ color: 'rgba(229,229,229,0.8)' }}
        onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'RETURN' }))}
        onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
      >
        ← RETURN TO ARCHIVES
      </motion.button>
    </div>
  )
}
