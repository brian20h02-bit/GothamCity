import type { TrailStep } from '@/data/sceneInvestigations'

interface Props {
  from: TrailStep
  to:   TrailStep
}

/** Línea de rastro entre paso visitado y siguiente pista */
export default function TrailPathLine({ from, to }: Props) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 17 }}>
      <line
        x1={`${from.left}%`}
        y1={`${from.top}%`}
        x2={`${to.left}%`}
        y2={`${to.top}%`}
        stroke="rgba(100,220,160,0.35)"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
    </svg>
  )
}
