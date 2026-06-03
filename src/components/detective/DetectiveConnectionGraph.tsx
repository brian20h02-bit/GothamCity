import { motion } from 'framer-motion'
import { useDetective } from '@/core/detective/DetectiveContext'

const CHAIN = [
  { label: 'CRIME ALLEY', x: 12, y: 72 },
  { label: 'ARKHAM', x: 32, y: 48 },
  { label: 'WAYNE TOWER', x: 58, y: 32 },
  { label: 'BATCOMPUTER', x: 82, y: 18 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function DetectiveConnectionGraph() {
  const { active } = useDetective()
  if (!active) return null

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 8 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        {CHAIN.slice(0, -1).map((node, i) => {
          const next = CHAIN[i + 1]
          return (
            <motion.line
              key={node.label}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              stroke="rgba(80,200,140,0.35)"
              strokeWidth="1"
              strokeDasharray="4 6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
            />
          )
        })}
        {CHAIN.map((node, i) => (
          <motion.g
            key={node.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.12 }}
          >
            <circle cx={`${node.x}%`} cy={`${node.y}%`} r="4" fill="rgba(80,200,140,0.7)" />
            <text
              x={`${node.x}%`}
              y={`${node.y - 3}%`}
              textAnchor="middle"
              fill="rgba(100,220,160,0.55)"
              style={{ fontSize: '6px', fontFamily: 'Inter, sans-serif', letterSpacing: '1.5px' }}
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
      <p
        className="absolute bottom-4 left-4 font-body"
        style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(80,200,140,0.4)' }}
      >
        DETECTIVE ANALYSIS — HIDDEN CONNECTIONS
      </p>
    </motion.div>
  )
}
