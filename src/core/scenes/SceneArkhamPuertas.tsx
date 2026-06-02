import { motion } from 'framer-motion'
import { useScene } from '@/core/navigation/SceneContext'
import EvidenceHotspot from '@/components/interactive/EvidenceHotspot'
import EvidencePanel from '@/components/interactive/EvidencePanel'
import { getEvidenceByScene } from '@/data/evidence'

const SCENE_ID = 'arkham-puertas'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const HOTSPOT_CONFIG = [
  { id: 'arkham-patient-file', top: 20, left: 65 },
  { id: 'arkham-blueprint',    top: 45, left: 15 },
  { id: 'arkham-interview',    top: 38, left: 48 },
  { id: 'arkham-chemical',     top: 65, left: 30 },
  { id: 'arkham-escape-log',   top: 70, left: 72 },
]

const sceneEvidence = getEvidenceByScene(SCENE_ID)

export default function SceneArkhamPuertas() {
  const { navigateTo } = useScene()

  return (
    <div className="absolute inset-0 pointer-events-none">

      {/* ── Dark overlay to ensure readability ───────────── */}
      <div className="absolute inset-0" style={{ background: 'rgba(5,5,5,0.22)' }} />

      {/* ── Government-abandoned grid texture ────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(229,229,229,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(229,229,229,0.012) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Classification stamp — top ────────────────────── */}
      <motion.div
        className="absolute top-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.3 }}
      >
        <div style={{ border: '1px solid rgba(139,0,0,0.5)', padding: '5px 20px', background: 'rgba(5,5,5,0.75)' }}>
          <p className="font-body" style={{ fontSize: '6px', letterSpacing: '5px', color: 'rgba(200,30,30,0.85)' }}>
            CLASSIFIED — LEVEL II ACCESS — ARKHAM RECORDS VAULT
          </p>
        </div>
      </motion.div>

      {/* ── Title ─────────────────────────────────────────── */}
      <motion.div
        className="absolute left-12 bottom-24"
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.95, ease: EASE, delay: 0.4 }}
      >
        <p className="font-body mb-1" style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(139,0,0,0.6)' }}>
          ARKHAM ASYLUM — RECORDS VAULT
        </p>
        <h2
          className="font-display text-white"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '5px' }}
        >
          CLASSIFIED RECORDS
        </h2>
        <p className="font-body mt-2" style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(229,229,229,0.2)' }}>
          5 DOCUMENTS INDEXED — LOCATE AND RETRIEVE
        </p>
      </motion.div>

      {/* ── Evidence hotspots ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-auto">
        {HOTSPOT_CONFIG.map(cfg => {
          const ev = sceneEvidence.find(e => e.id === cfg.id)
          if (!ev) return null
          return (
            <EvidenceHotspot
              key={ev.id}
              evidence={ev}
              top={cfg.top}
              left={cfg.left}
              radius={36}
            />
          )
        })}
      </div>

      {/* ── Advance button ────────────────────────────────── */}
      <motion.button
        className="absolute bottom-8 right-10 font-body pointer-events-auto"
        style={{
          fontSize:      '7px',
          letterSpacing: '4px',
          color:         'rgba(229,229,229,0.45)',
          border:        '1px solid rgba(229,229,229,0.12)',
          padding:       '8px 18px',
          background:    'rgba(5,5,5,0.7)',
          cursor:        'none',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.2 }}
        whileHover={{ color: 'rgba(229,229,229,0.9)', borderColor: 'rgba(229,229,229,0.35)' }}
        onClick={() => navigateTo('arkham-intensivo', 'archive')}
        onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'ENTER' }))}
        onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
      >
        INTENSIVE WING →
      </motion.button>

      {/* ── Evidence panel ────────────────────────────────── */}
      <EvidencePanel sceneId={SCENE_ID} title="ARKHAM — CLASSIFIED FILES" />

    </div>
  )
}
