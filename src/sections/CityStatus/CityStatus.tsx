import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { useCountUp } from '@/hooks/useCountUp'
import type { CityMetric } from '@/data/cityMetrics'

interface MetricCardProps {
  metric: CityMetric
  index: number
  inView: boolean
}

const threatConfig: Record<CityMetric['threat'], { label: string; color: string; dot: string }> = {
  critical: { label: 'CRITICAL', color: 'text-red-400', dot: 'bg-red-400' },
  high: { label: 'HIGH', color: 'text-orange-400', dot: 'bg-orange-400' },
  medium: { label: 'MEDIUM', color: 'text-yellow-400', dot: 'bg-yellow-400' },
  low: { label: 'NOMINAL', color: 'text-green-400', dot: 'bg-green-400' },
}

function MetricCard({ metric, index, inView }: MetricCardProps) {
  const count = useCountUp(metric.numericValue, 1800, inView)
  const tc = threatConfig[metric.threat]
  const isTextValue = metric.numericValue === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative p-6 border border-border bg-surface transition-all duration-300 cursor-default glow-accent-hover overflow-hidden"
    >
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-accent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

      {/* Hover background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/[0.03] group-hover:to-transparent transition-all duration-500" />

      <div className="relative z-10 space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span
            className="text-[9px] font-body text-text-secondary uppercase"
            style={{ letterSpacing: '2.5px' }}
          >
            {metric.label}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${tc.dot} animate-pulse`} />
            <span className={`text-[8px] font-body font-medium ${tc.color}`} style={{ letterSpacing: '1.5px' }}>
              {tc.label}
            </span>
          </div>
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          {isTextValue ? (
            <span
              className="font-display text-white leading-none"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '2px' }}
            >
              {metric.value}
            </span>
          ) : (
            <>
              <motion.span
                className="font-display text-white leading-none tabular-nums"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '2px' }}
              >
                {inView ? count : 0}
              </motion.span>
              <span className="font-body text-accent text-lg font-medium">{metric.suffix}</span>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-border group-hover:bg-accent/30 transition-colors duration-300" />

        {/* Description */}
        <p className="text-[11px] font-body text-text-secondary leading-relaxed">
          {metric.description}
        </p>
      </div>
    </motion.div>
  )
}

interface CityStatusProps {
  metrics: CityMetric[]
}

export default function CityStatus({ metrics }: CityStatusProps) {
  const [ref, inView] = useInView(0.15)

  return (
    <section
      id="city-status"
      ref={ref}
      className="relative w-full min-h-screen bg-surface py-24 px-6 sm:px-12 lg:px-24"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />

      {/* Top edge line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 space-y-3"
        >
          <span
            className="block text-[10px] font-body text-accent"
            style={{ letterSpacing: '4px' }}
          >
            CITY MONITORING SYSTEM
          </span>
          <h2
            className="font-display text-white leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '2px' }}
          >
            Current Gotham Status
          </h2>
          <p className="max-w-lg text-text-secondary font-body font-normal text-sm leading-relaxed">
            Live city metrics updated through the Gotham Intelligence Network.
          </p>

          {/* Status indicator */}
          <div className="flex items-center gap-2 pt-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span
              className="text-[9px] font-body text-text-secondary"
              style={{ letterSpacing: '2px' }}
            >
              LIVE DATA — UPDATED CONTINUOUSLY
            </span>
          </div>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <MetricCard key={metric.id} metric={metric} index={i} inView={inView} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 flex items-center gap-3"
        >
          <div className="flex-1 h-[1px] bg-border" />
          <span
            className="text-[9px] font-body text-text-secondary"
            style={{ letterSpacing: '2px' }}
          >
            GOTHAM INTELLIGENCE NETWORK — CLASSIFIED
          </span>
          <div className="flex-1 h-[1px] bg-border" />
        </motion.div>
      </div>
    </section>
  )
}
