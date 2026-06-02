import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useScene } from '@/core/navigation/SceneContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const RECORDS = [
  { id: 'R-0042', name: 'SUBJECT A',   ward: 'INTENSIVE WING',  status: 'ACTIVE',    diagnosis: 'Acute paranoid psychosis',            admitted: '1989-03-14', incidents: 7  },
  { id: 'R-0118', name: 'SUBJECT B',   ward: 'ISOLATION UNIT',  status: 'CRITICAL',  diagnosis: 'Unclassified neurological condition',  admitted: '1991-07-22', incidents: 14 },
  { id: 'R-0203', name: 'SUBJECT C',   ward: 'TREATMENT B',     status: 'MONITORED', diagnosis: 'Chemical-induced delirium',            admitted: '1993-11-08', incidents: 3  },
  { id: 'R-0389', name: 'SUBJECT D',   ward: 'SOLITARY',        status: 'DANGEROUS', diagnosis: 'Extreme violent behavior disorder',    admitted: '1987-05-30', incidents: 23 },
  { id: 'R-0512', name: 'SUBJECT E',   ward: 'OBSERVATION',     status: 'ACTIVE',    diagnosis: 'Severe dissociative disorder',         admitted: '1995-02-18', incidents: 2  },
  { id: 'R-0671', name: 'SUBJECT F',   ward: 'WING B — SEC.',   status: 'CRITICAL',  diagnosis: 'Experimental treatment — ongoing',    admitted: '1994-09-03', incidents: 9  },
]

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:    'rgba(100,200,140,0.7)',
  CRITICAL:  'rgba(200,50,50,0.9)',
  MONITORED: 'rgba(200,160,50,0.7)',
  DANGEROUS: 'rgba(220,80,30,0.9)',
}

export default function SceneArkhamIntensivo() {
  const [selected, setSelected] = useState<string | null>(null)
  const { navigateTo } = useScene()

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* ── Overlays ─────────────────────────────────────── */}
      <div className="absolute inset-0" style={{ background: 'rgba(5,5,5,0.25)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(5,5,5,0.3) 100%)' }} />

      {/* ── Flickering light shaft ────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-1/2"
        style={{
          width:      '1px',
          height:     '40%',
          background: 'linear-gradient(to bottom, rgba(200,215,210,0.1) 0%, transparent 100%)',
          transform:  'translateX(-50%)',
        }}
        animate={{ opacity: [0.5, 1, 0.4, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, times: [0, 0.3, 0.5, 0.7, 1] }}
      />

      <div className="absolute inset-0 pointer-events-auto flex flex-col">

        {/* ── Header ────────────────────────────────────────── */}
        <motion.div
          className="px-10 pt-9 pb-5 border-b"
          style={{ borderColor: 'rgba(139,0,0,0.2)', background: 'rgba(5,5,5,0.65)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="font-body mb-1" style={{ fontSize: '7px', letterSpacing: '5px', color: 'rgba(139,0,0,0.7)' }}>
            ARKHAM ASYLUM — INTENSIVE TREATMENT UNIT — WING B
          </p>
          <h1 className="font-display text-white" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', letterSpacing: '5px' }}>
            INTENSIVE TREATMENT
          </h1>
          <p className="font-body mt-1" style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(229,229,229,0.2)' }}>
            SECURED UNIT — DO NOT ENTER WITHOUT ARMED ESCORT
          </p>
        </motion.div>

        {/* ── Records grid ──────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-8">
          <p className="font-body mb-5" style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(229,229,229,0.18)' }}>
            ACTIVE TREATMENT SUBJECTS — {RECORDS.length} ON FILE
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-3xl">
            {RECORDS.map((rec, i) => (
              <motion.button
                key={rec.id}
                className="text-left p-4"
                style={{
                  background: selected === rec.id ? 'rgba(20,8,8,0.95)' : 'rgba(10,5,5,0.75)',
                  border:     `1px solid ${selected === rec.id ? 'rgba(139,0,0,0.5)' : 'rgba(139,0,0,0.14)'}`,
                  cursor:     'none',
                  willChange: 'border-color',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.08, ease: EASE }}
                whileHover={{ borderColor: 'rgba(139,0,0,0.45)' }}
                onClick={() => setSelected(selected === rec.id ? null : rec.id)}
                onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'VIEW' }))}
                onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.3)' }}>
                    {rec.id}
                  </span>
                  <span className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: STATUS_COLOR[rec.status] }}>
                    {rec.status}
                  </span>
                </div>
                <p className="font-display text-white mb-1" style={{ fontSize: '0.95rem', letterSpacing: '3px' }}>
                  {rec.name}
                </p>
                <p className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(229,229,229,0.3)' }}>
                  {rec.ward}
                </p>

                <AnimatePresence>
                  {selected === rec.id && (
                    <motion.div
                      className="mt-3 pt-3"
                      style={{ borderTop: '1px solid rgba(139,0,0,0.2)' }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="font-body mb-1" style={{ fontSize: '7px', letterSpacing: '1.5px', color: 'rgba(229,229,229,0.45)', lineHeight: 1.7 }}>
                        {rec.diagnosis}
                      </p>
                      <p className="font-body mb-1" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(229,229,229,0.25)' }}>
                        ADMITTED: {rec.admitted}
                      </p>
                      <p className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(200,60,60,0.55)' }}>
                        {rec.incidents} DOCUMENTED INCIDENTS
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
          className="px-8 py-4 flex justify-between items-center border-t"
          style={{ borderColor: 'rgba(139,0,0,0.15)', background: 'rgba(5,5,5,0.75)' }}
        >
          <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.18)' }}>
            ARKHAM ASYLUM — WING B — INTENSIVE TREATMENT — {RECORDS.length} ACTIVE
          </p>
          <motion.button
            className="font-body"
            style={{
              fontSize:      '7px',
              letterSpacing: '4px',
              color:         'rgba(229,229,229,0.4)',
              border:        '1px solid rgba(229,229,229,0.1)',
              padding:       '7px 16px',
              background:    'rgba(5,5,5,0.5)',
              cursor:        'none',
            }}
            whileHover={{ color: 'rgba(229,229,229,0.85)', borderColor: 'rgba(229,229,229,0.35)' }}
            onClick={() => navigateTo('arkham-lunatico', 'archive')}
            onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'ACCESS' }))}
            onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
          >
            PATIENT DATABASE →
          </motion.button>
        </div>

      </div>
    </div>
  )
}
