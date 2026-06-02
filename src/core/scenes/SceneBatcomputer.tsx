// @refresh reset
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import { useInvestigation } from '@/core/investigation/InvestigationContext'
import type { SceneId } from '@/core/navigation/types'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ─── Boot sequence ────────────────────────────────────────────────────────────
const BOOT_STEPS = [
  'INITIALIZING SECURE CONNECTION',
  'ACCESSING WAYNE NETWORK',
  'DECRYPTING FILES',
  'AUTHENTICATION COMPLETE',
  'ACCESS GRANTED',
  'BATCOMPUTER ONLINE',
] as const

function BootSequence({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // 6 steps in ~1900ms total — each step ~310ms, with last one held briefly
    const timings = [0, 140, 280, 420, 560, 700]
    const timers: ReturnType<typeof setTimeout>[] = []

    timings.forEach((t, i) => {
      timers.push(setTimeout(() => setStep(i), t))
    })

    timers.push(setTimeout(() => {
      setDone(true)
      setTimeout(onDone, 120)
    }, 880))

    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: '#000', zIndex: 8500 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Scanline texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 2px)',
          backgroundSize: '100% 2px',
        }}
      />

      <div className="relative w-full max-w-lg px-8 space-y-3">
        {BOOT_STEPS.map((label, i) => (
          <motion.div
            key={label}
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: i <= step ? 1 : 0, x: i <= step ? 0 : -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Status dot */}
            <motion.div
              className="flex-shrink-0 w-1.5 h-1.5 rounded-full"
              style={{ background: i === step && !done ? '#4ade80' : i < step || done ? 'rgba(100,180,130,0.5)' : 'transparent' }}
              animate={i === step && !done ? { opacity: [1, 0.3, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <p
              className="font-body"
              style={{
                fontSize:      '8px',
                letterSpacing: '4px',
                color:         i === step && !done
                  ? '#a3e8c0'
                  : i < step || done
                  ? 'rgba(100,180,130,0.45)'
                  : 'transparent',
              }}
            >
              {label}
            </p>
            {(i < step || (done && i === BOOT_STEPS.length - 1)) && (
              <motion.span
                className="font-body ml-auto flex-shrink-0"
                style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(100,180,130,0.5)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                OK
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom bar */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-48 h-px overflow-hidden" style={{ background: 'rgba(100,180,130,0.1)' }}>
          <motion.div
            className="h-full"
            style={{ background: 'rgba(100,180,130,0.6)', originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.9, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Network map nodes ────────────────────────────────────────────────────────
interface MapNode {
  id:    SceneId
  label: string
  x:     number   // % of container
  y:     number
  file:  string
}

const MAP_NODES: MapNode[] = [
  { id: 'gotham-city',            label: 'GOTHAM CITY',   x: 50, y: 12, file: 'ARCHIVE 01' },
  { id: 'crime-alley-investigation', label: 'CRIME ALLEY',   x: 22, y: 50, file: 'FILE 001'   },
  { id: 'arkham-investigation',   label: 'ARKHAM ASYLUM', x: 78, y: 50, file: 'FILE 002'   },
  { id: 'the-archives',           label: 'THE ARCHIVES',  x: 50, y: 85, file: 'ARCHIVE 04' },
]

// Connection pairs (index pairs from MAP_NODES)
const CONNECTIONS = [[0,1],[0,2],[1,3],[2,3]]

function NetworkMap({ onNodeClick }: { onNodeClick: (id: SceneId) => void }) {
  const [hovered, setHovered] = useState<SceneId | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '260px' }}>
      {/* SVG connection lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
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
              animate={{
                strokeDashoffset: [0, -20],
                stroke: isActive ? 'rgba(100,200,140,0.6)' : 'rgba(100,200,140,0.15)',
              }}
              transition={{ strokeDashoffset: { duration: 2, repeat: Infinity, ease: 'linear' }, stroke: { duration: 0.2 } }}
            />
          )
        })}
      </svg>

      {/* Nodes */}
      {MAP_NODES.map(node => (
        <motion.button
          key={node.id}
          className="absolute flex flex-col items-center gap-1 pointer-events-auto"
          style={{
            left:      `${node.x}%`,
            top:       `${node.y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'transparent',
            border:    'none',
            cursor:    'none',
          }}
          onMouseEnter={() => {
            setHovered(node.id)
            window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'ACCESS' }))
          }}
          onMouseLeave={() => {
            setHovered(null)
            window.dispatchEvent(new CustomEvent('hotspot-leave'))
          }}
          onClick={() => onNodeClick(node.id)}
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.15 }}
        >
          {/* Outer pulse ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width:  '36px',
              height: '36px',
              border: '1px solid rgba(100,200,140,0.4)',
              top:    '50%',
              left:   '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* Center dot */}
          <div
            className="relative rounded-full"
            style={{
              width:      '8px',
              height:     '8px',
              background: hovered === node.id ? '#4ade80' : 'rgba(100,200,140,0.6)',
              boxShadow:  hovered === node.id ? '0 0 12px rgba(74,222,128,0.8)' : 'none',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          />
          {/* Label */}
          <p
            className="font-body whitespace-nowrap"
            style={{
              fontSize:      '6px',
              letterSpacing: '3px',
              color:         hovered === node.id ? 'rgba(180,240,200,0.9)' : 'rgba(100,200,140,0.45)',
              marginTop:     '6px',
              transition:    'color 0.2s',
            }}
          >
            {node.label}
          </p>
        </motion.button>
      ))}
    </div>
  )
}

// ─── Timeline event ───────────────────────────────────────────────────────────
interface TimelineEvent {
  date:    string
  label:   string
  detail:  string
  tag:     string
}

const TIMELINE: TimelineEvent[] = [
  { date: '1981', label: 'CRIME ALLEY INCIDENT',    detail: 'Thomas and Martha Wayne murdered. Bruce Wayne — sole survivor. Case #81-CR-2187.',                              tag: 'FILE 001' },
  { date: '1985', label: 'WITNESS STATEMENT',        detail: 'Alfred Pennyworth deposition. Detective Harvey Bullock — lead investigator. File sealed by order of D.A.',      tag: 'FILE 001' },
  { date: '1989', label: 'ARKHAM TRANSFER',          detail: 'Patient 4479 admitted under court order. Dr. Jonathan Crane assigned as attending physician.',                  tag: 'FILE 002' },
  { date: '1997', label: 'WAYNE INVESTIGATION',      detail: 'Wayne Enterprises R&D division audited. Missing prototypes — classified. Internal review suppressed.',          tag: 'FILE 003' },
  { date: '2003', label: 'BATCOMPUTER ANALYSIS',     detail: 'Cross-referencing all active case files. Pattern detected. Convergence point: Gotham City Hall.',               tag: 'SYSTEM'   },
]

function TimelinePanel() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="space-y-0">
      {TIMELINE.map((ev, i) => (
        <motion.div
          key={i}
          className="relative flex gap-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 + i * 0.08, ease: EASE }}
        >
          {/* Vertical line */}
          <div className="flex flex-col items-center">
            <div
              className="w-px flex-1"
              style={{ background: i === 0 ? 'transparent' : 'rgba(100,200,140,0.12)', minHeight: '16px' }}
            />
            <motion.div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: expanded === i ? '#4ade80' : 'rgba(100,200,140,0.4)' }}
              animate={expanded === i ? { boxShadow: ['0 0 0px rgba(74,222,128,0)', '0 0 10px rgba(74,222,128,0.7)', '0 0 0px rgba(74,222,128,0)'] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div
              className="w-px flex-1"
              style={{ background: i === TIMELINE.length - 1 ? 'transparent' : 'rgba(100,200,140,0.12)', minHeight: '16px' }}
            />
          </div>

          {/* Content */}
          <button
            className="flex-1 text-left pb-1 pt-1"
            style={{ background: 'transparent', border: 'none', cursor: 'none' }}
            onClick={() => setExpanded(expanded === i ? null : i)}
            onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'VIEW' }))}
            onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
          >
            <div className="flex items-center gap-3">
              <span className="font-body" style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(100,200,140,0.4)', width: '30px', flexShrink: 0 }}>
                {ev.date}
              </span>
              <span className="font-body" style={{ fontSize: '8px', letterSpacing: '3px', color: expanded === i ? 'rgba(200,240,215,0.9)' : 'rgba(180,220,200,0.6)', transition: 'color 0.2s' }}>
                {ev.label}
              </span>
              <span className="ml-auto font-body flex-shrink-0" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(100,200,140,0.3)' }}>
                {ev.tag}
              </span>
            </div>
            <AnimatePresence>
              {expanded === i && (
                <motion.p
                  className="font-body mt-2 ml-12"
                  style={{ fontSize: '0.65rem', letterSpacing: '1px', color: 'rgba(180,220,200,0.5)', lineHeight: 1.8 }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {ev.detail}
                </motion.p>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Case file database ───────────────────────────────────────────────────────
interface CaseEntry {
  id:       string
  title:    string
  status:   'ACTIVE' | 'CLOSED' | 'CLASSIFIED'
  threat:   'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  location: string
  date:     string
}

const CASES: CaseEntry[] = [
  { id: 'CASE 001', title: 'CRIME ALLEY',   status: 'ACTIVE',     threat: 'HIGH',     location: 'PARK ROW',     date: '1981-06-26' },
  { id: 'CASE 002', title: 'ARKHAM ASYLUM', status: 'ACTIVE',     threat: 'CRITICAL', location: 'ARKHAM ISLAND',date: '1989-03-14' },
  { id: 'CASE 003', title: 'WAYNE TOWER',   status: 'CLASSIFIED', threat: 'CRITICAL', location: 'MIDTOWN',      date: '1997-11-02' },
  { id: 'CASE 004', title: 'THE NARROWS',   status: 'CLASSIFIED', threat: 'HIGH',     location: 'THE NARROWS',  date: '2003-09-07' },
]

const THREAT_COLOR: Record<CaseEntry['threat'], string> = {
  LOW:      'rgba(100,200,140,0.5)',
  MEDIUM:   'rgba(220,180,60,0.7)',
  HIGH:     'rgba(200,80,60,0.7)',
  CRITICAL: 'rgba(220,30,30,0.8)',
}

function CaseDatabase() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="space-y-px">
      {CASES.map((c, i) => (
        <motion.button
          key={c.id}
          className="w-full text-left p-3 relative overflow-hidden"
          style={{
            background:  selected === c.id ? 'rgba(20,40,30,0.8)' : 'rgba(10,20,15,0.6)',
            border:      `1px solid ${selected === c.id ? 'rgba(100,200,140,0.3)' : 'rgba(100,200,140,0.08)'}`,
            cursor:      'none',
          }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.07, ease: EASE }}
          onClick={() => setSelected(selected === c.id ? null : c.id)}
          onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'VIEW' }))}
          onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
          whileHover={{ backgroundColor: 'rgba(20,40,30,0.6)' }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(100,200,140,0.4)' }}>{c.id}</p>
              <p className="font-display mt-0.5" style={{ fontSize: '0.85rem', letterSpacing: '3px', color: 'rgba(210,235,220,0.85)' }}>{c.title}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: THREAT_COLOR[c.threat] }}>{c.threat}</p>
              <p className="font-body mt-0.5" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(100,200,140,0.3)' }}>{c.status}</p>
            </div>
          </div>
          <AnimatePresence>
            {selected === c.id && (
              <motion.div
                className="mt-2 pt-2 grid grid-cols-2 gap-x-4 gap-y-1"
                style={{ borderTop: '1px solid rgba(100,200,140,0.1)' }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(100,200,140,0.3)' }}>LOCATION</p>
                <p className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(200,230,215,0.5)' }}>{c.location}</p>
                <p className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(100,200,140,0.3)' }}>DATE</p>
                <p className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(200,230,215,0.5)' }}>{c.date}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      ))}
    </div>
  )
}

// ─── Live metrics strip ───────────────────────────────────────────────────────
function LiveMetrics({ foundCount, totalCount, progress, clearanceLevel }: {
  foundCount: number
  totalCount: number
  progress: number
  clearanceLevel: number
}) {
  // Simulated "live" counter that ticks occasionally
  const [ping, setPing] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setPing(p => (p + 1) % 999), 1400)
    return () => clearInterval(t)
  }, [])

  const metrics = [
    { label: 'EVIDENCE',    value: `${String(foundCount).padStart(2,'0')}/${totalCount}` },
    { label: 'PROGRESS',    value: `${progress}%` },
    { label: 'CLEARANCE',   value: `LEVEL ${clearanceLevel}` },
    { label: 'NETWORK REQ', value: String(ping).padStart(3, '0') },
    { label: 'STATUS',      value: 'ONLINE' },
  ]

  return (
    <div className="flex gap-6 flex-wrap">
      {metrics.map(m => (
        <div key={m.label}>
          <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(100,200,140,0.35)' }}>{m.label}</p>
          <motion.p
            key={m.value}
            className="font-display mt-0.5"
            style={{ fontSize: '1rem', letterSpacing: '3px', color: 'rgba(160,230,190,0.85)' }}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.85] }}
            transition={{ duration: 0.3 }}
          >
            {m.value}
          </motion.p>
        </div>
      ))}
    </div>
  )
}

// ─── Investigation board items ────────────────────────────────────────────────
const BOARD_ITEMS = [
  { label: 'EVIDENCE FILES',       count: 18, color: 'rgba(100,200,140,0.6)' },
  { label: 'WITNESS REPORTS',      count: 4,  color: 'rgba(220,180,60,0.6)'  },
  { label: 'ARKHAM RECORDS',       count: 5,  color: 'rgba(140,60,200,0.6)'  },
  { label: 'WAYNE DATA',           count: 4,  color: 'rgba(60,140,220,0.6)'  },
  { label: 'CRIME SCENE ANALYSIS', count: 6,  color: 'rgba(220,80,60,0.6)'   },
]

function InvestigationBoard({ foundCount }: { foundCount: number }) {
  return (
    <div className="space-y-2">
      {BOARD_ITEMS.map((item, i) => {
        const filled = Math.round((foundCount / 18) * item.count)
        return (
          <motion.div
            key={item.label}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 + i * 0.07, ease: EASE }}
          >
            <p className="font-body w-36 flex-shrink-0" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(180,220,200,0.5)' }}>
              {item.label}
            </p>
            <div className="flex-1 flex gap-px h-1.5">
              {Array.from({ length: item.count }).map((_, j) => (
                <motion.div
                  key={j}
                  className="flex-1 rounded-sm"
                  style={{ background: j < filled ? item.color : 'rgba(100,200,140,0.08)' }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 + i * 0.07 + j * 0.03 }}
                />
              ))}
            </div>
            <span className="font-body flex-shrink-0" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(100,200,140,0.35)', width: '28px', textAlign: 'right' }}>
              {filled}/{item.count}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Ambient digital particles ────────────────────────────────────────────────
function DigitalParticles() {
  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 1.5,
      delay: Math.random() * 4,
      dur: 3 + Math.random() * 4,
    }))
  )

  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.current.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left:       `${p.x}%`,
            top:        `${p.y}%`,
            width:      `${p.size}px`,
            height:     `${p.size}px`,
            background: 'rgba(100,200,140,0.35)',
            willChange: 'opacity, transform',
          }}
          animate={{
            opacity:   [0, 0.7, 0],
            transform: ['translateY(0px)', 'translateY(-12px)', 'translateY(-24px)'],
          }}
          transition={{
            duration: p.dur,
            delay:    p.delay,
            repeat:   Infinity,
            ease:     'linear',
          }}
        />
      ))}
    </div>
  )
}

// ─── Live data stream ─────────────────────────────────────────────────────────
const LOG_TEMPLATES = [
  'SIGNAL TRACE :: GOTHAM GRID NODE {n} — NOMINAL',
  'ENCRYPTION LAYER {n} — AES-256 VERIFIED',
  'PING ARKHAM SERVER :: {n}ms LATENCY',
  'SUSPECT DB SCAN :: {n} RECORDS CHECKED',
  'WAYNE NET PACKET {n} — TRANSMITTED',
  'GPS ANCHOR LOCK :: SECTOR {n} — ACTIVE',
  'THREAT MONITOR :: {n} EVENTS LOGGED',
  'CASE FILE {n} — INTEGRITY CONFIRMED',
]

function randomLog() {
  const tpl = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
  const n   = Math.floor(Math.random() * 9999)
  return tpl.replace('{n}', String(n).padStart(4, '0'))
}

function LiveDataStream() {
  const [lines, setLines] = useState<string[]>(() => Array.from({ length: 10 }, randomLog))

  useEffect(() => {
    const t = setInterval(() => {
      setLines(prev => {
        const next = [...prev, randomLog()]
        return next.slice(-28) // keep last 28 lines
      })
    }, 640)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className="relative overflow-hidden font-body"
      style={{ height: '120px', maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)' }}
    >
      <motion.div
        className="absolute left-0 right-0 bottom-0 space-y-0.5"
        animate={{ y: 0 }}
      >
        {lines.map((line, i) => (
          <motion.p
            key={`${line}-${i}`}
            className="font-body truncate"
            style={{
              fontSize:      '6.5px',
              letterSpacing: '2px',
              color:         i === lines.length - 1 ? 'rgba(100,220,150,0.85)' : `rgba(100,200,140,${0.1 + (i / lines.length) * 0.3})`,
              lineHeight:    1.7,
            }}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            <span style={{ color: 'rgba(100,200,140,0.3)', marginRight: '8px' }}>
              {String(Date.now()).slice(-6)}
            </span>
            {line}
          </motion.p>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Cursor glow tracker ─────────────────────────────────────────────────────
function CursorGlow() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const opacity = useTransform(x, v => (v < -100 ? 0 : 0.06))

  useEffect(() => {
    const update = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('mousemove', update)
    return () => window.removeEventListener('mousemove', update)
  }, [x, y])

  return (
    <motion.div
      aria-hidden="true"
      className="fixed pointer-events-none rounded-full"
      style={{
        width:      '400px',
        height:     '400px',
        background: 'radial-gradient(circle, rgba(60,200,120,0.12) 0%, transparent 70%)',
        translateX: '-50%',
        translateY: '-50%',
        left:       x,
        top:        y,
        opacity,
        willChange: 'transform',
        zIndex:     1,
      }}
    />
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SceneBatcomputer() {
  const { navigateTo } = useScene()
  const { foundCount, totalCount, progress, clearanceLevel } = useInvestigation()
  const [booting, setBooting] = useState(true)
  const [visible, setVisible] = useState(false)

  const handleBootDone = () => {
    setBooting(false)
    setTimeout(() => setVisible(true), 50)
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Overlays only — base image from SceneRenderer (batcomputer-hub.png) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(60,200,120,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(60,200,120,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,8,4,0.32) 100%)' }}
      />

      <DigitalParticles />
      <CursorGlow />

      {/* ── Boot sequence overlay ──────────────────────────────── */}
      <AnimatePresence>
        {booting && <BootSequence onDone={handleBootDone} />}
      </AnimatePresence>

      {/* ── Main HUB UI ───────────────────────────────────────── */}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="absolute inset-0 overflow-y-auto pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="px-6 sm:px-10 py-8 max-w-screen-xl mx-auto">

              {/* ── HEADER ──────────────────────────────────────── */}
              <motion.div
                className="mb-8 flex items-end justify-between flex-wrap gap-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <div>
                  <p className="font-body mb-1" style={{ fontSize: '7px', letterSpacing: '5px', color: 'rgba(100,200,140,0.55)' }}>
                    WAYNE NETWORK — SECURE SYSTEM
                  </p>
                  <h1
                    className="font-display"
                    style={{
                      fontSize:      'clamp(2.5rem, 6vw, 5rem)',
                      letterSpacing: '6px',
                      lineHeight:    1,
                      color:         'rgba(220,240,230,0.92)',
                      filter:        'drop-shadow(0 0 30px rgba(60,200,120,0.2))',
                    }}
                  >
                    BATCOMPUTER
                  </h1>
                  <p className="font-body mt-1" style={{ fontSize: '8px', letterSpacing: '4px', color: 'rgba(100,200,140,0.35)' }}>
                    GOTHAM INTELLIGENCE NETWORK — CLEARANCE LEVEL {clearanceLevel}
                  </p>
                </div>

                {/* Live metrics */}
                <div className="flex flex-col items-end gap-3 min-w-[200px]">
                  <LiveMetrics
                    foundCount={foundCount}
                    totalCount={totalCount}
                    progress={progress}
                    clearanceLevel={clearanceLevel}
                  />
                  <LiveDataStream />
                </div>
              </motion.div>

              {/* ── DIVIDER ─────────────────────────────────────── */}
              <div className="mb-8" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(100,200,140,0.2) 30%, rgba(100,200,140,0.2) 70%, transparent)' }} />

              {/* ── ROW 1: Network map + Investigation board ─────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                {/* Network Map */}
                <motion.section
                  className="p-5"
                  style={{ background: 'rgba(8,20,12,0.8)', border: '1px solid rgba(100,200,140,0.1)' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                >
                  <p className="font-body mb-4" style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(100,200,140,0.45)' }}>
                    GOTHAM NETWORK MAP
                  </p>
                  <NetworkMap onNodeClick={id => navigateTo(id, 'archive')} />
                  <p className="font-body mt-3" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(100,200,140,0.2)' }}>
                    CLICK NODE TO ACCESS LOCATION
                  </p>
                </motion.section>

                {/* Investigation Board */}
                <motion.section
                  className="p-5"
                  style={{ background: 'rgba(8,20,12,0.8)', border: '1px solid rgba(100,200,140,0.1)' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
                >
                  <p className="font-body mb-4" style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(100,200,140,0.45)' }}>
                    INVESTIGATION BOARD
                  </p>
                  <InvestigationBoard foundCount={foundCount} />
                </motion.section>
              </div>

              {/* ── ROW 2: Timeline + Case database ─────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                {/* Timeline */}
                <motion.section
                  className="p-5"
                  style={{ background: 'rgba(8,20,12,0.8)', border: '1px solid rgba(100,200,140,0.1)' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                >
                  <p className="font-body mb-5" style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(100,200,140,0.45)' }}>
                    TIMELINE SYSTEM
                  </p>
                  <TimelinePanel />
                </motion.section>

                {/* Case database */}
                <motion.section
                  className="p-5"
                  style={{ background: 'rgba(8,20,12,0.8)', border: '1px solid rgba(100,200,140,0.1)' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
                >
                  <p className="font-body mb-4" style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(100,200,140,0.45)' }}>
                    CASE FILE DATABASE
                  </p>
                  <CaseDatabase />
                </motion.section>
              </div>

              {/* ── FOOTER BAR ──────────────────────────────────── */}
              <motion.div
                className="flex items-center justify-between flex-wrap gap-4 pt-4 pb-8"
                style={{ borderTop: '1px solid rgba(100,200,140,0.08)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              >
                <button
                  className="font-body pointer-events-auto"
                  style={{ fontSize: '8px', letterSpacing: '3px', color: 'rgba(100,200,140,0.35)', background: 'transparent', border: 'none', cursor: 'none' }}
                  onClick={() => navigateTo('the-archives', 'archive')}
                  onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'RETURN' }))}
                  onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
                >
                  ← RETURN TO ARCHIVES
                </button>

                <div className="flex gap-4 items-center">
                  {/* ── CONTROL CENTER access ─────────────── */}
                  <motion.button
                    className="font-body pointer-events-auto"
                    style={{
                      fontSize:      '7px',
                      letterSpacing: '3px',
                      color:         'rgba(100,200,140,0.6)',
                      background:    'rgba(4,12,8,0.8)',
                      border:        '1px solid rgba(30,120,70,0.4)',
                      padding:       '8px 18px',
                      cursor:        'none',
                    }}
                    whileHover={{ color: 'rgba(100,200,140,1)', borderColor: 'rgba(30,200,100,0.7)' }}
                    animate={{ borderColor: ['rgba(30,120,70,0.3)', 'rgba(30,200,100,0.6)', 'rgba(30,120,70,0.3)'] }}
                    transition={{ borderColor: { duration: 2.5, repeat: Infinity } }}
                    onClick={() => navigateTo('batcomputer-control', 'archive')}
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'ACCESS' }))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
                  >
                    CONTROL CENTER →
                  </motion.button>

                  <div className="flex gap-2 items-center">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#4ade80' }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                    <p className="font-body" style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(100,200,140,0.3)' }}>
                      SYSTEMS NOMINAL
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
