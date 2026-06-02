import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ─── Network node SVG overlay ─────────────────────────────────────────────────
const NODES = [
  { x: 15, y: 22, label: 'GCPD NET' },
  { x: 50, y: 14, label: 'SAT FEED' },
  { x: 83, y: 25, label: 'WAYNE ENT' },
  { x: 18, y: 65, label: 'ARKHAM LINK' },
  { x: 50, y: 50, label: 'CORE' },
  { x: 80, y: 68, label: 'BATCAVE' },
  { x: 35, y: 38, label: 'SENSOR A' },
  { x: 66, y: 40, label: 'SENSOR B' },
]
const EDGES = [[0, 4], [1, 4], [2, 4], [3, 4], [5, 4], [6, 4], [7, 4], [0, 3], [1, 2]]

function NetworkOverlay() {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%', zIndex: 5 }}
      aria-hidden="true"
    >
      {EDGES.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={`${NODES[a].x}%`} y1={`${NODES[a].y}%`}
          x2={`${NODES[b].x}%`} y2={`${NODES[b].y}%`}
          stroke="rgba(30,200,120,0.18)"
          strokeWidth="0.8"
          strokeDasharray="4 7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 + i * 0.12, ease: EASE }}
        />
      ))}
      {NODES.map((node, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
        >
          <motion.circle
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r="3.5"
            fill={i === 4 ? 'rgba(30,200,120,0.9)' : 'rgba(30,200,120,0.55)'}
            animate={{ r: i === 4 ? [3.5, 4.5, 3.5] : [3.5, 3.5, 3.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <text
            x={`${node.x}%`}
            y={`${node.y - 2.5}%`}
            textAnchor="middle"
            fill="rgba(30,200,120,0.45)"
            style={{ fontSize: '6.5px', fontFamily: 'var(--font-body, monospace)', letterSpacing: '1.5px' }}
          >
            {node.label}
          </text>
        </motion.g>
      ))}
    </svg>
  )
}

// ─── Scan sweep line ──────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute left-0 right-0 pointer-events-none"
      style={{ height: '1px', background: 'rgba(30,200,120,0.1)', zIndex: 6, willChange: 'transform' }}
      animate={{ y: ['0vh', '100vh'] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
    />
  )
}

// ─── Live activity feed ───────────────────────────────────────────────────────
const ACTIVITY = [
  'SURVEILLANCE NODE 14 — ACTIVE',
  'SIGNAL TRACE: EAST GOTHAM',
  'DECRYPT COMPLETE — FILE 4479',
  'GCPD FREQUENCY LOCKED',
  'PERIMETER BREACH — SECTOR 7 — FALSE ALARM',
  'SATELLITE UPLINK STABLE',
  'MOTION DETECTED — CRIME ALLEY',
  'WAYNE NETWORK ENCRYPTION VERIFIED',
  'ARKHAM FEED RESTORED',
  'GOTHAM THERMAL MAP — UPDATING',
  'FACIAL RECOGNITION — MATCH x3',
  'COMM INTERCEPT — ENCRYPTED',
]

function ActivityFeed() {
  const [lines, setLines] = useState<string[]>([])

  useEffect(() => {
    let i = 0
    const tick = () => {
      const ts = new Date().toLocaleTimeString('en-US', { hour12: false })
      setLines(prev => [...prev.slice(-14), `[${ts}] ${ACTIVITY[i % ACTIVITY.length]}`])
      i++
    }
    tick()
    const id = setInterval(tick, 900)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col justify-end overflow-hidden h-full p-3">
      {lines.map((line, idx) => (
        <motion.p
          key={`${line}-${idx}`}
          className="font-body truncate"
          style={{
            fontSize:      '5.5px',
            letterSpacing: '1.5px',
            color:         `rgba(30,200,120,${0.15 + (idx / lines.length) * 0.65})`,
            lineHeight:    1.9,
          }}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SceneBatcomputerControl() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* ── Image overlay (subtle, preserves background) ── */}
      <div className="absolute inset-0" style={{ background: 'rgba(5,5,5,0.15)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(5,5,5,0.25) 100%)' }} />

      {/* ── Network map SVG ───────────────────────────────── */}
      <NetworkOverlay />

      {/* ── Scan sweep ───────────────────────────────────── */}
      <ScanLine />

      {/* ── Content panels ───────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col justify-between p-8" style={{ zIndex: 10 }}>

        {/* Top bar */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div>
            <p className="font-body" style={{ fontSize: '7px', letterSpacing: '5px', color: 'rgba(30,200,120,0.5)' }}>
              BATCOMPUTER — GOTHAM OPERATIONS CENTER
            </p>
            <h1 className="font-display text-white" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', letterSpacing: '5px' }}>
              CONTROL CENTER
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: 'rgba(30,200,120,0.85)' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(30,200,120,0.65)' }}>
              SYSTEMS NOMINAL
            </p>
          </div>
        </motion.div>

        {/* Bottom data panels */}
        <div className="grid grid-cols-3 gap-4">

          {/* Activity log */}
          <motion.div
            style={{ background: 'rgba(4,12,8,0.88)', border: '1px solid rgba(30,120,70,0.3)', height: '170px' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          >
            <div className="px-3 pt-3 pb-2 border-b" style={{ borderColor: 'rgba(30,120,70,0.2)' }}>
              <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(30,200,120,0.55)' }}>
                LIVE ACTIVITY LOG
              </p>
            </div>
            <ActivityFeed />
          </motion.div>

          {/* Gotham status */}
          <motion.div
            className="p-4"
            style={{ background: 'rgba(4,12,8,0.88)', border: '1px solid rgba(30,120,70,0.3)', height: '170px' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
          >
            <p className="font-body mb-3" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(30,200,120,0.55)' }}>
              GOTHAM STATUS
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'ACTIVE UNITS',  value: '14',  color: 'rgba(30,200,120,0.8)'  },
                { label: 'INCIDENTS',     value: '3',   color: 'rgba(220,130,30,0.8)'  },
                { label: 'ESCAPEES',      value: '2',   color: 'rgba(200,60,60,0.9)'   },
                { label: 'SURVEILLANCE',  value: '98%', color: 'rgba(30,200,120,0.8)'  },
              ].map(item => (
                <div key={item.label} className="p-2" style={{ background: 'rgba(30,120,70,0.08)', border: '1px solid rgba(30,120,70,0.14)' }}>
                  <p className="font-body" style={{ fontSize: '5px', letterSpacing: '2px', color: 'rgba(229,229,229,0.28)' }}>
                    {item.label}
                  </p>
                  <p className="font-display" style={{ fontSize: '1.15rem', letterSpacing: '2px', color: item.color }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Active scans */}
          <motion.div
            className="p-4"
            style={{ background: 'rgba(4,12,8,0.88)', border: '1px solid rgba(30,120,70,0.3)', height: '170px' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          >
            <p className="font-body mb-3" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(30,200,120,0.55)' }}>
              ACTIVE SCANS
            </p>
            <div className="space-y-3">
              {[
                { label: 'FACIAL RECOG.',  pct: 76 },
                { label: 'THERMAL MAP',   pct: 92 },
                { label: 'COMMS DECRYPT', pct: 41 },
                { label: 'DNA TRACE',     pct: 18 },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="font-body" style={{ fontSize: '5px', letterSpacing: '2px', color: 'rgba(229,229,229,0.32)' }}>
                      {item.label}
                    </span>
                    <span className="font-body" style={{ fontSize: '5px', letterSpacing: '2px', color: 'rgba(30,200,120,0.65)' }}>
                      {item.pct}%
                    </span>
                  </div>
                  <div style={{ height: '1px', background: 'rgba(30,120,70,0.2)', position: 'relative' }}>
                    <motion.div
                      className="absolute top-0 left-0 h-full"
                      style={{ background: 'rgba(30,200,120,0.65)', originX: 0 }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: item.pct / 100 }}
                      transition={{ duration: 1.5, delay: 0.8, ease: EASE }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
