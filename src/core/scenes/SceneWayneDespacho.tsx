import { motion } from 'framer-motion'
import { useScene } from '@/core/navigation/SceneContext'
import EvidenceHotspot from '@/components/interactive/EvidenceHotspot'
import EvidencePanel from '@/components/interactive/EvidencePanel'
import { getEvidenceByScene } from '@/data/evidence'

const SCENE_ID = 'wayne-despacho'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const HOTSPOT_CONFIG = [
  { id: 'wayne-financial',  top: 48, left: 18 },
  { id: 'wayne-contract',   top: 30, left: 72 },
  { id: 'wayne-autopsy',    top: 65, left: 60 },
  { id: 'wayne-photograph', top: 22, left: 40 },
]

const sceneEvidence = getEvidenceByScene(SCENE_ID)

export default function SceneWayneDespacho() {
  const { navigateTo } = useScene()

  return (
    <div className="absolute inset-0 pointer-events-none">

      {/* ── Warm ambient overlay ──────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 55% 40%, rgba(25,18,8,0.12) 0%, rgba(5,5,5,0.22) 100%)' }}
      />

      {/* ── Title — top left ──────────────────────────────── */}
      <motion.div
        className="absolute left-12 top-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.3 }}
      >
        <p className="font-body mb-1" style={{ fontSize: '7px', letterSpacing: '5px', color: 'rgba(229,229,229,0.25)' }}>
          WAYNE TOWER — FLOOR 42 — PRIVATE
        </p>
        <h1
          className="font-display text-white"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', letterSpacing: '5px' }}
        >
          BRUCE WAYNE OFFICE
        </h1>
        <p className="font-body mt-1" style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(229,229,229,0.18)' }}>
          CLASSIFIED FILES DETECTED — INVESTIGATE ROOM
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

      {/* ── Notebook hotspot → BATCOMPUTER ───────────────── */}
      <motion.button
        className="absolute pointer-events-auto"
        style={{
          top:        '52%',
          left:       '44%',
          width:      '10%',
          height:     '10%',
          background: 'transparent',
          border:     'none',
          cursor:     'none',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.3 }}
        onClick={() => navigateTo('batcomputer', 'batcomputer')}
        onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'ACCESS' }))}
        onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
        aria-label="Access Batcomputer"
      >
        {/* Pulsing green dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          <div
            style={{
              width:     '10px',
              height:    '10px',
              borderRadius: '50%',
              background: 'rgba(30,200,100,0.8)',
              boxShadow:  '0 0 14px rgba(30,200,100,0.6)',
            }}
          />
        </motion.div>
      </motion.button>

      {/* ── Batcomputer label ─────────────────────────────── */}
      <motion.div
        className="absolute"
        style={{ top: '63%', left: '36%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        <motion.p
          className="font-body"
          style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(30,200,100,0.6)' }}
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ◆ BATCOMPUTER ACCESS
        </motion.p>
      </motion.div>

      {/* ── Evidence panel ────────────────────────────────── */}
      <EvidencePanel sceneId={SCENE_ID} title="WAYNE — CLASSIFIED FILES" />

    </div>
  )
}
