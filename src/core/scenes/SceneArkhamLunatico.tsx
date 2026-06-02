import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const PATIENTS = [
  { id: '4479', name: 'REDACTED',    diagnosis: 'Acute paranoid schizophrenia',          ward: 'B — RESTRICTED',   admit: '1989-03-14', status: 'ACTIVE',    threat: 'CRITICAL', history: 'Multiple escape attempts. Communication restricted to written notes. Extreme threat to staff.' },
  { id: '2201', name: 'DENT, H.',    diagnosis: 'Dissociative identity disorder',         ward: 'A — MONITORED',    admit: '1991-11-02', status: 'ESCAPED',   threat: 'HIGH',     history: 'Escaped November 1994. GCPD alert active. Do not approach without armed backup. Dual identity confirmed.' },
  { id: '3318', name: 'NAPIER, J.',  diagnosis: 'Unclassified — see attached notes',      ward: 'MAXIMUM SECURITY', admit: '1988-07-19', status: 'ESCAPED',   threat: 'CRITICAL', history: 'Entire file destroyed post-escape 1989. Subject whereabouts: unknown. Classified threat designation: Omega.' },
  { id: '1104', name: 'ISLEY, P.',   diagnosis: 'Eco-reactive psychosis',                 ward: 'C — SECURED',      admit: '1994-05-30', status: 'CONTAINED', threat: 'MEDIUM',   history: 'Isolated to sealed ward. All plant material removed. External contact prohibited. Cooperation level: low.' },
  { id: '0871', name: 'NASHTON, E.', diagnosis: 'Obsessive-compulsive narcissism',        ward: 'B — MONITORED',    admit: '1993-08-14', status: 'ACTIVE',    threat: 'HIGH',     history: 'IQ designated classified. Communication limited to written form. Fixation on riddles and puzzles.' },
  { id: '0560', name: 'FRIES, V.',   diagnosis: 'Cryogenic exposure — neurological dmg',  ward: 'D — ISOLATED',     admit: '1992-12-01', status: 'CONTAINED', threat: 'HIGH',     history: 'Requires sub-zero environment. Special unit maintained at -20°C. Cooperative when isolated from aggravation.' },
]

const THREAT_COLOR: Record<string, string> = {
  CRITICAL: 'rgba(200,30,30,0.9)',
  HIGH:     'rgba(220,130,30,0.85)',
  MEDIUM:   'rgba(200,180,30,0.75)',
}

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:    'rgba(100,200,140,0.7)',
  ESCAPED:   'rgba(200,60,60,0.9)',
  CONTAINED: 'rgba(140,160,200,0.7)',
}

export default function SceneArkhamLunatico() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* ── Overlays ─────────────────────────────────────── */}
      <div className="absolute inset-0" style={{ background: 'rgba(5,5,5,0.28)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,5,5,0.35) 100%)' }} />

      {/* ── Unsettling color cast ─────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(60,0,0,0.12) 0%, transparent 60%)' }}
      />

      <div className="absolute inset-0 pointer-events-auto flex flex-col">

        {/* ── Header ────────────────────────────────────────── */}
        <motion.div
          className="px-10 pt-8 pb-5 border-b flex items-end justify-between"
          style={{ borderColor: 'rgba(139,0,0,0.2)', background: 'rgba(5,5,5,0.72)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div>
            <p className="font-body mb-1" style={{ fontSize: '7px', letterSpacing: '5px', color: 'rgba(139,0,0,0.75)' }}>
              ARKHAM ASYLUM — SECURE DATABASE — LEVEL III ACCESS
            </p>
            <h1 className="font-display text-white" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', letterSpacing: '5px' }}>
              PATIENT DATABASE
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'rgba(200,60,60,0.9)' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(200,60,60,0.65)' }}>
              LIVE ACCESS
            </p>
          </div>
        </motion.div>

        {/* ── Threat tier stats ─────────────────────────────── */}
        <motion.div
          className="px-10 py-3 flex gap-8 border-b"
          style={{ borderColor: 'rgba(139,0,0,0.1)', background: 'rgba(5,5,5,0.55)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {Object.entries(THREAT_COLOR).map(([level, color]) => {
            const count = PATIENTS.filter(p => p.threat === level).length
            return (
              <div key={level} className="flex items-center gap-2">
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: color }} />
                <span className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.35)' }}>
                  {level}: {count}
                </span>
              </div>
            )
          })}
          <div className="ml-auto flex items-center gap-2">
            <span className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(200,60,60,0.6)' }}>
              {PATIENTS.filter(p => p.status === 'ESCAPED').length} ESCAPED — AT LARGE
            </span>
          </div>
        </motion.div>

        {/* ── Patient grid ──────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-w-5xl">
            {PATIENTS.map((p, i) => (
              <motion.button
                key={p.id}
                className="text-left p-4"
                style={{
                  background: selected === p.id ? 'rgba(20,5,5,0.96)' : 'rgba(8,3,3,0.82)',
                  border:     `1px solid ${selected === p.id ? THREAT_COLOR[p.threat] : 'rgba(139,0,0,0.14)'}`,
                  cursor:     'none',
                  willChange: 'border-color',
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.4 + i * 0.07, ease: EASE }}
                whileHover={{ borderColor: THREAT_COLOR[p.threat] }}
                onClick={() => setSelected(selected === p.id ? null : p.id)}
                onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'VIEW' }))}
                onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body" style={{ fontSize: '5px', letterSpacing: '3px', color: 'rgba(229,229,229,0.22)' }}>
                    ID #{p.id}
                  </span>
                  <span className="font-body" style={{ fontSize: '5px', letterSpacing: '2px', color: THREAT_COLOR[p.threat] }}>
                    ◆ {p.threat}
                  </span>
                </div>
                <p className="font-display text-white mb-1" style={{ fontSize: '0.88rem', letterSpacing: '3px' }}>
                  {p.name}
                </p>
                <p className="font-body mb-1" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(229,229,229,0.3)' }}>
                  {p.ward}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-body" style={{ fontSize: '5px', letterSpacing: '2px', color: 'rgba(229,229,229,0.2)' }}>
                    {p.admit}
                  </span>
                  <span className="font-body" style={{ fontSize: '5px', letterSpacing: '2px', color: STATUS_COLOR[p.status] }}>
                    {p.status}
                  </span>
                </div>

                <AnimatePresence>
                  {selected === p.id && (
                    <motion.div
                      className="mt-3 pt-3"
                      style={{ borderTop: `1px solid ${THREAT_COLOR[p.threat]}44` }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <p className="font-body mb-2" style={{ fontSize: '7px', letterSpacing: '1.5px', color: 'rgba(229,229,229,0.5)', lineHeight: 1.8 }}>
                        {p.history}
                      </p>
                      <p className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(229,229,229,0.22)' }}>
                        DX: {p.diagnosis}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <div
          className="px-8 py-4 border-t"
          style={{ borderColor: 'rgba(139,0,0,0.15)', background: 'rgba(5,5,5,0.8)' }}
        >
          <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.18)' }}>
            ARKHAM ASYLUM — PATIENT REGISTRY v4.1 — {PATIENTS.length} ACTIVE RECORDS — UNAUTHORIZED ACCESS PROSECUTED
          </p>
        </div>

      </div>
    </div>
  )
}
