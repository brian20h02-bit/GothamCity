import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import { useInvestigation } from '@/core/investigation/InvestigationContext'
import InvestigatorProfile from '@/components/detective/InvestigatorProfile'
import CaseBoard from '@/components/detective/CaseBoard'
import type { SceneId } from '@/core/navigation/types'
import type { BatcomputerPanelId } from '@/data/batcomputerPanelAnchors'

// ─── Network map ──────────────────────────────────────────────────────────────
const MAP_NODES = [
  { id: 'gotham-city' as SceneId,               label: 'GOTHAM CITY',   x: 50, y: 12 },
  { id: 'crime-alley-investigation' as SceneId, label: 'CRIME ALLEY',   x: 22, y: 50 },
  { id: 'arkham-investigation' as SceneId,       label: 'ARKHAM ASYLUM', x: 78, y: 50 },
  { id: 'the-archives' as SceneId,               label: 'THE ARCHIVES',  x: 50, y: 85 },
]
const CONNECTIONS = [[0, 1], [0, 2], [1, 3], [2, 3]]

export function HubNetworkMap() {
  const { navigateTo } = useScene()
  const [hovered, setHovered] = useState<SceneId | null>(null)

  return (
    <div className="relative w-full pointer-events-auto" style={{ height: '260px' }}>
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }} aria-hidden>
        {CONNECTIONS.map(([a, b], i) => {
          const na = MAP_NODES[a], nb = MAP_NODES[b]
          const isActive = hovered === na.id || hovered === nb.id
          return (
            <motion.line
              key={i}
              x1={`${na.x}%`} y1={`${na.y}%`}
              x2={`${nb.x}%`} y2={`${nb.y}%`}
              stroke={isActive ? 'rgba(100,200,140,0.6)' : 'rgba(100,200,140,0.15)'}
              strokeWidth="1"
              strokeDasharray="4 6"
            />
          )
        })}
      </svg>
      {MAP_NODES.map(node => (
        <button
          key={node.id}
          type="button"
          className="absolute flex flex-col items-center gap-1"
          style={{
            left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)',
            background: 'transparent', border: 'none', cursor: 'none',
          }}
          onMouseEnter={() => {
            setHovered(node.id)
            window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'ACCESS' }))
          }}
          onMouseLeave={() => {
            setHovered(null)
            window.dispatchEvent(new CustomEvent('hotspot-leave'))
          }}
          onClick={() => navigateTo(node.id, 'archive')}
        >
          <div
            className="rounded-full"
            style={{
              width: 8, height: 8,
              background: hovered === node.id ? '#4ade80' : 'rgba(100,200,140,0.6)',
              boxShadow: hovered === node.id ? '0 0 12px rgba(74,222,128,0.8)' : 'none',
            }}
          />
          <p className="font-body whitespace-nowrap" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(100,200,140,0.55)', marginTop: 6 }}>
            {node.label}
          </p>
        </button>
      ))}
      <p className="font-body mt-3" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(100,200,140,0.25)' }}>
        CLICK NODE TO ACCESS LOCATION
      </p>
    </div>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
const TIMELINE = [
  { date: '1981', label: 'CRIME ALLEY INCIDENT', detail: 'Thomas and Martha Wayne murdered. Bruce Wayne — sole survivor.', tag: 'FILE 001' },
  { date: '1985', label: 'WITNESS STATEMENT',    detail: 'Alfred Pennyworth deposition. File sealed by order of D.A.', tag: 'FILE 001' },
  { date: '1989', label: 'ARKHAM TRANSFER',      detail: 'Patient 4479 admitted. Dr. Jonathan Crane assigned.', tag: 'FILE 002' },
  { date: '1997', label: 'WAYNE INVESTIGATION',  detail: 'Missing prototypes — classified. Internal review suppressed.', tag: 'FILE 003' },
  { date: '2003', label: 'BATCOMPUTER ANALYSIS', detail: 'Pattern detected. Convergence point: Gotham City Hall.', tag: 'SYSTEM' },
]

export function HubTimelinePanel() {
  const [expanded, setExpanded] = useState<number | null>(null)
  return (
    <div className="space-y-0 pointer-events-auto">
      {TIMELINE.map((ev, i) => (
        <div key={ev.label} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: expanded === i ? '#4ade80' : 'rgba(100,200,140,0.4)' }} />
          </div>
          <button
            type="button"
            className="flex-1 text-left pb-3"
            style={{ background: 'transparent', border: 'none', cursor: 'none' }}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              <span className="font-body" style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(100,200,140,0.4)' }}>{ev.date}</span>
              <span className="font-body" style={{ fontSize: '8px', letterSpacing: '3px', color: 'rgba(180,220,200,0.7)' }}>{ev.label}</span>
              <span className="ml-auto font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(100,200,140,0.3)' }}>{ev.tag}</span>
            </div>
            <AnimatePresence>
              {expanded === i && (
                <motion.p
                  className="font-body mt-2"
                  style={{ fontSize: '0.65rem', letterSpacing: '1px', color: 'rgba(180,220,200,0.5)', lineHeight: 1.8 }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {ev.detail}
                </motion.p>
              )}
            </AnimatePresence>
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── Case database ────────────────────────────────────────────────────────────
const CASES = [
  { id: 'CASE 001', title: 'CRIME ALLEY',   status: 'ACTIVE',     threat: 'HIGH',     location: 'PARK ROW',      date: '1981-06-26' },
  { id: 'CASE 002', title: 'ARKHAM ASYLUM', status: 'ACTIVE',     threat: 'CRITICAL', location: 'ARKHAM ISLAND', date: '1989-03-14' },
  { id: 'CASE 003', title: 'WAYNE TOWER',   status: 'CLASSIFIED', threat: 'CRITICAL', location: 'MIDTOWN',       date: '1997-11-02' },
  { id: 'CASE 004', title: 'THE NARROWS',   status: 'CLASSIFIED', threat: 'HIGH',     location: 'THE NARROWS',   date: '2003-09-07' },
]

const THREAT_COLOR: Record<string, string> = {
  HIGH: 'rgba(200,80,60,0.7)', CRITICAL: 'rgba(220,30,30,0.8)', MEDIUM: 'rgba(220,180,60,0.7)', LOW: 'rgba(100,200,140,0.5)',
}

export function HubCaseDatabase() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div className="space-y-px pointer-events-auto">
      {CASES.map(c => (
        <button
          key={c.id}
          type="button"
          className="w-full text-left p-3"
          style={{
            background: selected === c.id ? 'rgba(20,40,30,0.8)' : 'rgba(10,20,15,0.6)',
            border: `1px solid ${selected === c.id ? 'rgba(100,200,140,0.3)' : 'rgba(100,200,140,0.08)'}`,
            cursor: 'none',
          }}
          onClick={() => setSelected(selected === c.id ? null : c.id)}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(100,200,140,0.4)' }}>{c.id}</p>
              <p className="font-display mt-0.5" style={{ fontSize: '0.85rem', letterSpacing: '3px', color: 'rgba(210,235,220,0.85)' }}>{c.title}</p>
            </div>
            <p className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: THREAT_COLOR[c.threat] }}>{c.threat}</p>
          </div>
          {selected === c.id && (
            <div className="mt-2 pt-2 grid grid-cols-2 gap-x-4" style={{ borderTop: '1px solid rgba(100,200,140,0.1)' }}>
              <p className="font-body" style={{ fontSize: '6px', color: 'rgba(100,200,140,0.3)' }}>LOCATION</p>
              <p className="font-body" style={{ fontSize: '6px', color: 'rgba(200,230,215,0.5)' }}>{c.location}</p>
              <p className="font-body" style={{ fontSize: '6px', color: 'rgba(100,200,140,0.3)' }}>DATE</p>
              <p className="font-body" style={{ fontSize: '6px', color: 'rgba(200,230,215,0.5)' }}>{c.date}</p>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Status / metrics ─────────────────────────────────────────────────────────
function LiveMetrics() {
  const { foundCount, totalCount, progress, clearanceLevel } = useInvestigation()
  const [ping, setPing] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setPing(p => (p + 1) % 999), 1400)
    return () => clearInterval(t)
  }, [])

  const metrics = [
    { label: 'EVIDENCE', value: `${String(foundCount).padStart(2, '0')}/${totalCount}` },
    { label: 'PROGRESS', value: `${progress}%` },
    { label: 'CLEARANCE', value: `LEVEL ${clearanceLevel}` },
    { label: 'NETWORK REQ', value: String(ping).padStart(3, '0') },
    { label: 'STATUS', value: 'ONLINE' },
  ]

  return (
    <div className="flex gap-6 flex-wrap pointer-events-auto">
      {metrics.map(m => (
        <div key={m.label}>
          <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(100,200,140,0.35)' }}>{m.label}</p>
          <p className="font-display mt-0.5" style={{ fontSize: '1rem', letterSpacing: '3px', color: 'rgba(160,230,190,0.85)' }}>{m.value}</p>
        </div>
      ))}
    </div>
  )
}

export function HubStatusPanel() {
  return (
    <div className="space-y-6 pointer-events-auto">
      <LiveMetrics />
      <InvestigatorProfile />
    </div>
  )
}

export function HubCaseBoardPanel() {
  return (
    <div className="pointer-events-auto">
      <CaseBoard />
    </div>
  )
}

// ─── Control center panels ────────────────────────────────────────────────────
const ACTIVITY = [
  'SURVEILLANCE NODE 14 — ACTIVE', 'SIGNAL TRACE: EAST GOTHAM', 'DECRYPT COMPLETE — FILE 4479',
  'GCPD FREQUENCY LOCKED', 'ARKHAM FEED RESTORED', 'GOTHAM THERMAL MAP — UPDATING',
]

export function ControlActivityLog() {
  const [lines, setLines] = useState<string[]>([])
  useEffect(() => {
    let i = 0
    const tick = () => {
      const ts = new Date().toLocaleTimeString('en-US', { hour12: false })
      setLines(prev => [...prev.slice(-12), `[${ts}] ${ACTIVITY[i % ACTIVITY.length]}`])
      i++
    }
    tick()
    const id = setInterval(tick, 900)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="space-y-1 max-h-48 overflow-hidden pointer-events-auto">
      {lines.map((line, idx) => (
        <p key={`${line}-${idx}`} className="font-body truncate" style={{ fontSize: '6px', letterSpacing: '1.5px', color: 'rgba(30,200,120,0.55)', lineHeight: 1.9 }}>
          {line}
        </p>
      ))}
    </div>
  )
}

export function ControlGothamStatus() {
  const items = [
    { label: 'ACTIVE UNITS', value: '14', color: 'rgba(30,200,120,0.8)' },
    { label: 'INCIDENTS', value: '3', color: 'rgba(220,130,30,0.8)' },
    { label: 'ESCAPEES', value: '2', color: 'rgba(200,60,60,0.9)' },
    { label: 'SURVEILLANCE', value: '98%', color: 'rgba(30,200,120,0.8)' },
  ]
  return (
    <div className="grid grid-cols-2 gap-2 pointer-events-auto">
      {items.map(item => (
        <div key={item.label} className="p-2" style={{ background: 'rgba(30,120,70,0.08)', border: '1px solid rgba(30,120,70,0.14)' }}>
          <p className="font-body" style={{ fontSize: '5px', letterSpacing: '2px', color: 'rgba(229,229,229,0.28)' }}>{item.label}</p>
          <p className="font-display" style={{ fontSize: '1.15rem', letterSpacing: '2px', color: item.color }}>{item.value}</p>
        </div>
      ))}
    </div>
  )
}

export function ControlActiveScans() {
  const scans = [
    { label: 'FACIAL RECOG.', pct: 76 },
    { label: 'THERMAL MAP', pct: 92 },
    { label: 'COMMS DECRYPT', pct: 41 },
    { label: 'DNA TRACE', pct: 18 },
  ]
  return (
    <div className="space-y-3 pointer-events-auto">
      {scans.map(item => (
        <div key={item.label}>
          <div className="flex justify-between mb-1">
            <span className="font-body" style={{ fontSize: '5px', letterSpacing: '2px', color: 'rgba(229,229,229,0.32)' }}>{item.label}</span>
            <span className="font-body" style={{ fontSize: '5px', color: 'rgba(30,200,120,0.65)' }}>{item.pct}%</span>
          </div>
          <div style={{ height: '1px', background: 'rgba(30,120,70,0.2)' }}>
            <div style={{ height: '100%', width: `${item.pct}%`, background: 'rgba(30,200,120,0.65)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function BatcomputerPanelContent({ panelId }: { panelId: BatcomputerPanelId }) {
  switch (panelId) {
    case 'network-map':    return <HubNetworkMap />
    case 'case-board':     return <HubCaseBoardPanel />
    case 'timeline':       return <HubTimelinePanel />
    case 'case-database':  return <HubCaseDatabase />
    case 'status':         return <HubStatusPanel />
    case 'activity-log':   return <ControlActivityLog />
    case 'gotham-status':  return <ControlGothamStatus />
    case 'active-scans':   return <ControlActiveScans />
    default:               return null
  }
}
