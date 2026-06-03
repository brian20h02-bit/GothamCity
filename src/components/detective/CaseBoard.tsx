import { motion } from 'framer-motion'
import { useDetective } from '@/core/detective/DetectiveContext'
import { caseBoardEdges, caseBoardNodes } from '@/data/caseBoard'
import { getDetectiveEvidenceById } from '@/data/detectiveEvidence'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function CaseBoard() {
  const { foundEvidenceIds, arkhamCaseCompletion, wayneCaseCompletion, mainInvestigationCompletion } = useDetective()

  const nodes = caseBoardNodes.map(n => ({
    ...n,
    discovered: !n.evidenceId || foundEvidenceIds.includes(n.evidenceId),
  }))

  const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]))

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        {[
          { label: 'ARKHAM CASE', value: `${arkhamCaseCompletion}%` },
          { label: 'WAYNE CASE', value: `${wayneCaseCompletion}%` },
          { label: 'MAIN INVESTIGATION', value: `${mainInvestigationCompletion}%` },
        ].map(c => (
          <div key={c.label}>
            <p className="font-body" style={{ fontSize: '5px', letterSpacing: '2px', color: 'rgba(100,200,140,0.4)' }}>
              {c.label}
            </p>
            <p className="font-display" style={{ fontSize: '0.9rem', letterSpacing: '2px', color: 'rgba(160,230,190,0.9)' }}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '16/9', background: 'rgba(4,12,8,0.6)', border: '1px solid rgba(100,200,140,0.12)' }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
          {caseBoardEdges.map(edge => {
            const a = nodeById[edge.from]
            const b = nodeById[edge.to]
            if (!a || !b) return null
            const lit = a.discovered && b.discovered
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={lit ? 'rgba(100,220,160,0.45)' : 'rgba(100,200,140,0.1)'}
                strokeWidth="0.3"
                strokeDasharray={lit ? undefined : '1 1'}
              />
            )
          })}
        </svg>

        {nodes.map((node, i) => {
          const ev = node.evidenceId ? getDetectiveEvidenceById(node.evidenceId) : null
          return (
            <motion.div
              key={node.id}
              className="absolute px-1.5 py-1 text-center"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                minWidth: 56,
                background: node.discovered ? 'rgba(8,24,14,0.92)' : 'rgba(8,12,10,0.5)',
                border: `1px solid ${node.discovered ? 'rgba(100,220,160,0.45)' : 'rgba(100,200,140,0.12)'}`,
                opacity: node.discovered ? 1 : 0.35,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: node.discovered ? 1 : 0.35, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.04, ease: EASE }}
            >
              <p className="font-body" style={{ fontSize: '4px', letterSpacing: '1px', color: 'rgba(100,200,140,0.5)' }}>
                {node.kind.toUpperCase()}
              </p>
              <p className="font-body" style={{ fontSize: '5px', letterSpacing: '1px', color: 'rgba(180,230,200,0.85)' }}>
                {node.label}
              </p>
              {ev && node.discovered && (
                <p className="font-body mt-0.5" style={{ fontSize: '4px', color: 'rgba(100,200,140,0.4)' }}>
                  {ev.classification}
                </p>
              )}
            </motion.div>
          )
        })}
      </div>

      <p className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(100,200,140,0.35)' }}>
        EVIDENCE → CONNECTIONS → EVENTS → LOCATIONS — UPDATES ON DISCOVERY
      </p>
    </div>
  )
}
