import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useScene } from '@/core/navigation/SceneContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const PROJECTS = [
  { code: 'PROJECT NIMBUS',       status: 'ACTIVE',      progress: 78, category: 'CLEAN ENERGY',   budget: '$4.2B',  lead: 'DR. FOX, L.' },
  { code: 'NARROWS REBUILD',      status: 'PENDING',     progress: 23, category: 'URBAN DEV.',      budget: '$890M',  lead: 'WAYNE, B.'   },
  { code: 'MEDICAL RESEARCH R-7', status: 'CLASSIFIED',  progress: 91, category: 'R&D',             budget: 'REDACTED', lead: 'CLASSIFIED' },
  { code: 'PORT AUTHORITY DEAL',  status: 'ACTIVE',      progress: 55, category: 'LOGISTICS',       budget: '$1.1B',  lead: 'KELSO, M.'   },
  { code: 'ARKHAM RENOVATION',    status: 'COMPLETED',   progress: 100,category: 'INFRASTRUCTURE',  budget: '$220M',  lead: 'MUNICIPAL'   },
  { code: 'SATELLITE NETWORK',    status: 'CLASSIFIED',  progress: 64, category: 'TECH',            budget: 'REDACTED', lead: 'CLASSIFIED' },
]

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:     'rgba(100,200,140,0.7)',
  PENDING:    'rgba(200,160,50,0.7)',
  CLASSIFIED: 'rgba(200,60,60,0.8)',
  COMPLETED:  'rgba(140,160,200,0.65)',
}

export default function SceneWayneSala() {
  const [selected, setSelected] = useState<string | null>(null)
  const { navigateTo } = useScene()

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* ── Overlays ─────────────────────────────────────── */}
      <div className="absolute inset-0" style={{ background: 'rgba(5,5,5,0.22)' }} />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(20,20,40,0.15) 0%, transparent 60%)' }}
      />

      <div className="absolute inset-0 pointer-events-auto flex flex-col">

        {/* ── Header ────────────────────────────────────────── */}
        <motion.div
          className="px-10 pt-9 pb-5 border-b"
          style={{ borderColor: 'rgba(229,229,229,0.07)', background: 'rgba(5,5,5,0.68)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="font-body mb-1" style={{ fontSize: '7px', letterSpacing: '5px', color: 'rgba(229,229,229,0.28)' }}>
            WAYNE ENTERPRISES — FLOOR 38 — EXECUTIVE LEVEL
          </p>
          <h1 className="font-display text-white" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', letterSpacing: '5px' }}>
            EXECUTIVE OPERATIONS
          </h1>
        </motion.div>

        {/* ── Projects grid ─────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-8">
          <p className="font-body mb-5" style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(229,229,229,0.18)' }}>
            STRATEGIC INITIATIVES — Q4 2025
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-3xl">
            {PROJECTS.map((proj, i) => (
              <motion.button
                key={proj.code}
                className="text-left p-5"
                style={{
                  background: selected === proj.code ? 'rgba(12,12,18,0.96)' : 'rgba(8,8,14,0.82)',
                  border:     `1px solid ${selected === proj.code ? 'rgba(229,229,229,0.2)' : 'rgba(229,229,229,0.06)'}`,
                  cursor:     'none',
                  willChange: 'border-color',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: EASE }}
                whileHover={{ borderColor: 'rgba(229,229,229,0.2)' }}
                onClick={() => setSelected(selected === proj.code ? null : proj.code)}
                onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'VIEW' }))}
                onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-body mb-1" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.25)' }}>
                      {proj.category}
                    </p>
                    <p className="font-display text-white" style={{ fontSize: '0.88rem', letterSpacing: '3px' }}>
                      {proj.code}
                    </p>
                  </div>
                  <span className="font-body" style={{ fontSize: '5px', letterSpacing: '2px', color: STATUS_COLOR[proj.status], flexShrink: 0 }}>
                    {proj.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ height: '1px', background: 'rgba(229,229,229,0.07)', position: 'relative', marginBottom: '10px' }}>
                  <motion.div
                    className="absolute top-0 left-0 h-full"
                    style={{ background: STATUS_COLOR[proj.status] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${proj.progress}%` }}
                    transition={{ duration: 1.2, delay: 0.5 + i * 0.12, ease: EASE }}
                  />
                </div>

                <div className="flex justify-between">
                  <span className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(229,229,229,0.22)' }}>
                    {proj.progress}% COMPLETE
                  </span>
                  <span className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(229,229,229,0.22)' }}>
                    {proj.budget}
                  </span>
                </div>

                <AnimatePresence>
                  {selected === proj.code && (
                    <motion.p
                      className="mt-3 font-body"
                      style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(229,229,229,0.35)', paddingTop: '8px', borderTop: '1px solid rgba(229,229,229,0.07)' }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      PROJECT LEAD: {proj.lead}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <div
          className="px-8 py-4 border-t flex justify-between items-center"
          style={{ borderColor: 'rgba(229,229,229,0.06)', background: 'rgba(5,5,5,0.72)' }}
        >
          <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.18)' }}>
            WAYNE ENTERPRISES — {PROJECTS.length} ACTIVE INITIATIVES
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
            onClick={() => navigateTo('wayne-despacho', 'archive')}
            onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'ENTER' }))}
            onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
          >
            EXECUTIVE OFFICE →
          </motion.button>
        </div>

      </div>
    </div>
  )
}
