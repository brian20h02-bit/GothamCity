import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import EvidenceHotspot from '@/components/interactive/EvidenceHotspot'
import EvidencePanel from '@/components/interactive/EvidencePanel'
import { getEvidenceByScene } from '@/data/evidence'

const SCENE_ID = 'arkham-investigation'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// Evidence hotspot positions (% of viewport)
const HOTSPOT_CONFIG = [
  { id: 'arkham-patient-file', top: 18, left: 68 },
  { id: 'arkham-blueprint',    top: 42, left: 14 },
  { id: 'arkham-interview',    top: 35, left: 50 },
  { id: 'arkham-chemical',     top: 67, left: 32 },
  { id: 'arkham-escape-log',   top: 72, left: 74 },
]

const sceneEvidence = getEvidenceByScene(SCENE_ID)

// ─── Arkham Dossier data ──────────────────────────────────────────────────────
const DOSSIER_RECORDS = [
  { id: '4479', name: 'REDACTED', diagnosis: 'Acute paranoid schizophrenia', ward: 'B — RESTRICTED', admit: '1989-03-14', status: 'ACTIVE',     threat: 'CRITICAL' },
  { id: '2201', name: 'DENT, H.', diagnosis: 'Dissociative identity disorder', ward: 'A — MONITORED', admit: '1991-11-02', status: 'ESCAPED',   threat: 'HIGH'     },
  { id: '3318', name: 'NAPIER, J.', diagnosis: 'Unclassified — see notes', ward: 'MAXIMUM SEC.',    admit: '1988-07-19', status: 'ESCAPED',   threat: 'CRITICAL' },
  { id: '1104', name: 'ISLEY, P.', diagnosis: 'Eco-reactive psychosis',      ward: 'C — SECURED',   admit: '1994-05-30', status: 'CONTAINED', threat: 'MEDIUM'   },
]

const THREAT_COL: Record<string, string> = {
  CRITICAL: 'rgba(200,30,30,0.85)',
  HIGH:     'rgba(220,140,30,0.75)',
  MEDIUM:   'rgba(200,180,30,0.65)',
  LOW:      'rgba(100,200,140,0.5)',
}

const STATUS_COL: Record<string, string> = {
  ACTIVE:     'rgba(100,180,130,0.7)',
  ESCAPED:    'rgba(200,60,60,0.8)',
  CONTAINED:  'rgba(140,160,200,0.7)',
}

function ArkhamDossier() {
  const [open, setOpen]       = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
      {/* Toggle tab */}
      <motion.button
        className="absolute pointer-events-auto font-body"
        style={{
          bottom:        '22%',
          right:         '0',
          background:    'rgba(8,22,18,0.9)',
          border:        '1px solid rgba(40,90,60,0.5)',
          borderRight:   'none',
          padding:       '10px 8px',
          fontSize:      '6px',
          letterSpacing: '3px',
          color:         'rgba(140,200,160,0.7)',
          writingMode:   'vertical-rl',
          cursor:        'none',
        }}
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'ACCESS' }))}
        onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
        whileHover={{ color: 'rgba(180,240,200,0.95)' }}
        animate={{ right: open ? '280px' : '0px' }}
        transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
      >
        ARKHAM DOSSIER
      </motion.button>

      {/* Slide-in panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-0 bottom-0 right-0 pointer-events-auto overflow-y-auto"
            style={{
              width:      '280px',
              background: 'rgba(4,12,8,0.95)',
              border:     '1px solid rgba(40,90,60,0.4)',
              borderRight:'none',
              zIndex:     50,
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(100,180,130,0.5)' }}>ARKHAM ASYLUM</p>
                  <p className="font-display mt-0.5" style={{ fontSize: '1rem', letterSpacing: '4px', color: 'rgba(180,220,200,0.85)' }}>PATIENT RECORDS</p>
                </div>
                <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(200,60,60,0.8)' }} animate={{ opacity: [1,0.3,1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              </div>

              <div className="mb-4" style={{ height: '1px', background: 'rgba(40,90,60,0.3)' }} />

              {/* Classification stamp */}
              <div className="mb-4 p-2" style={{ border: '1px solid rgba(200,60,60,0.3)', background: 'rgba(200,30,30,0.05)' }}>
                <p className="font-body text-center" style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(200,60,60,0.6)' }}>
                  CLASSIFIED — LEVEL II ACCESS
                </p>
              </div>

              {/* Records */}
              <div className="space-y-1">
                {DOSSIER_RECORDS.map(rec => (
                  <motion.button
                    key={rec.id}
                    className="w-full text-left p-2.5"
                    style={{
                      background: selected === rec.id ? 'rgba(20,50,30,0.8)' : 'rgba(8,22,14,0.6)',
                      border:     `1px solid ${selected === rec.id ? 'rgba(40,120,70,0.5)' : 'rgba(40,90,60,0.2)'}`,
                      cursor:     'none',
                    }}
                    onClick={() => setSelected(selected === rec.id ? null : rec.id)}
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'VIEW' }))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
                    whileHover={{ backgroundColor: 'rgba(20,50,30,0.6)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(100,180,130,0.45)' }}>ID #{rec.id}</p>
                        <p className="font-body mt-0.5" style={{ fontSize: '8px', letterSpacing: '2px', color: 'rgba(200,230,210,0.8)' }}>{rec.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-body" style={{ fontSize: '5.5px', letterSpacing: '2px', color: THREAT_COL[rec.threat] ?? 'white' }}>{rec.threat}</p>
                        <p className="font-body mt-0.5" style={{ fontSize: '5.5px', letterSpacing: '2px', color: STATUS_COL[rec.status] ?? 'white' }}>{rec.status}</p>
                      </div>
                    </div>
                    <AnimatePresence>
                      {selected === rec.id && (
                        <motion.div
                          className="mt-2 space-y-1"
                          style={{ borderTop: '1px solid rgba(40,90,60,0.2)', paddingTop: '6px' }}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="font-body" style={{ fontSize: '6px', letterSpacing: '1.5px', color: 'rgba(160,210,180,0.5)', lineHeight: 1.8 }}>
                            DIAGNOSIS: {rec.diagnosis}
                          </p>
                          <p className="font-body" style={{ fontSize: '6px', letterSpacing: '1.5px', color: 'rgba(160,210,180,0.4)' }}>
                            WARD: {rec.ward}
                          </p>
                          <p className="font-body" style={{ fontSize: '6px', letterSpacing: '1.5px', color: 'rgba(160,210,180,0.4)' }}>
                            ADMITTED: {rec.admit}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>

              <p className="font-body mt-4" style={{ fontSize: '5.5px', letterSpacing: '2px', color: 'rgba(100,180,130,0.2)', lineHeight: 1.8 }}>
                ARKHAM ASYLUM — PATIENT REGISTRY v4.1<br />
                UNAUTHORIZED ACCESS WILL BE PROSECUTED
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Flicker hook ─────────────────────────────────────────────────────────────
function useFlicker(ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf: number

    const flicker = () => {
      const delay = 2000 + Math.random() * 5000
      raf = window.setTimeout(() => {
        // Brief multi-step opacity stutter
        el.style.opacity = '0.6'
        setTimeout(() => { el.style.opacity = '1' }, 60)
        setTimeout(() => { el.style.opacity = '0.7' }, 110)
        setTimeout(() => { el.style.opacity = '1' }, 180)
        flicker()
      }, delay)
    }

    flicker()
    return () => clearTimeout(raf)
  }, [ref])
}

export default function SceneArkhamInvestigation() {
  const { navigateTo } = useScene()
  const lightRef = useRef<HTMLDivElement>(null)
  useFlicker(lightRef)

  return (
    <div className="absolute inset-0">

      {/* ── Cold tint overlay (Arkham atmosphere) ──────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(8, 22, 18, 0.35)', mixBlendMode: 'multiply' }}
      />

      {/* ── Left cold glow ────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-2/5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at left center, rgba(20,50,40,0.25) 0%, transparent 70%)' }}
      />

      {/* ── Flickering overhead light ──────────────────────── */}
      <div
        ref={lightRef}
        aria-hidden="true"
        className="absolute top-0 left-1/2 pointer-events-none"
        style={{
          width:     '2px',
          height:    '40%',
          background: 'linear-gradient(to bottom, rgba(200,220,210,0.12) 0%, transparent 100%)',
          transform: 'translateX(-50%)',
          transition: 'opacity 0.05s',
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

      {/* ── Arkham Dossier (slide-in panel) ────────────────── */}
      <ArkhamDossier />

      {/* ── Evidence panel (top right) ─────────────────────── */}
      <EvidencePanel sceneId={SCENE_ID} title="ARKHAM — EVIDENCE" />

      {/* ── Header — top left ─────────────────────────────── */}
      <div className="absolute top-8 left-8 sm:top-10 sm:left-14 pointer-events-none">
        <motion.span
          className="block font-body mb-2"
          style={{ fontSize: '8px', letterSpacing: '5px', color: 'rgba(60,120,90,0.7)' }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        >
          LEVEL II ACCESS — RESTRICTED
        </motion.span>

        <motion.h1
          className="font-display text-white"
          style={{
            fontSize:      'clamp(2.2rem, 5vw, 4rem)',
            letterSpacing: '5px',
            lineHeight:    1,
            filter:        'drop-shadow(0 0 20px rgba(0,0,0,0.9))',
          }}
          initial={{ opacity: 0, filter: 'blur(8px) drop-shadow(0 0 20px rgba(0,0,0,0.9))' }}
          animate={{ opacity: 1, filter: 'blur(0px) drop-shadow(0 0 20px rgba(0,0,0,0.9))' }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
        >
          ARKHAM<br />ASYLUM
        </motion.h1>

        <motion.p
          className="font-body mt-3 italic"
          style={{ fontSize: '0.7rem', letterSpacing: '2px', color: 'rgba(180,200,190,0.3)', lineHeight: 1.7 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
        >
          The city locks away its monsters here.
        </motion.p>
      </div>

      {/* ── Patient records hint ───────────────────────────── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ bottom: '30%', left: '8%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4, ease: EASE }}
      >
        <AnimatePresence>
          <motion.p
            className="font-body"
            style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(180,200,190,0.25)' }}
            animate={{ opacity: [0.18, 0.4, 0.18] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            SEARCH FOR EVIDENCE — HANDLE WITH CAUTION
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* ── Return to archives ─────────────────────────────── */}
      <motion.button
        className="absolute bottom-8 left-8 sm:left-14 pointer-events-auto font-body"
        style={{
          fontSize:      '8px',
          letterSpacing: '3px',
          color:         'rgba(180,200,190,0.4)',
          background:    'transparent',
          border:        'none',
        }}
        onClick={() => navigateTo('the-archives', 'archive')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
        whileHover={{ color: 'rgba(180,200,190,0.9)' }}
        onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'RETURN' }))}
        onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
      >
        ← RETURN TO ARCHIVES
      </motion.button>

    </div>
  )
}
