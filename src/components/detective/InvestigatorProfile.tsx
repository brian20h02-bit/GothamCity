import { motion } from 'framer-motion'
import { useDetective } from '@/core/detective/DetectiveContext'
import { useInvestigation } from '@/core/investigation/InvestigationContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function InvestigatorProfile() {
  const {
    foundCount,
    totalCount,
    exploredSceneIds,
    investigationCompletion,
  } = useDetective()
  const { unlockedFileIds } = useInvestigation()

  const stats = [
    { label: 'EVIDENCE FOUND',       value: `${foundCount} / ${totalCount}` },
    { label: 'LOCATIONS EXPLORED',   value: String(exploredSceneIds.length) },
    { label: 'FILES OPENED',         value: String(unlockedFileIds.length) },
    { label: 'COMPLETION',           value: `${investigationCompletion}%` },
  ]

  return (
    <motion.section
      className="p-5 mb-6"
      style={{ background: 'rgba(8,20,12,0.85)', border: '1px solid rgba(100,200,140,0.12)' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <p className="font-body mb-1" style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(100,200,140,0.45)' }}>
        BATCOMPUTER — PERSONNEL
      </p>
      <h2
        className="font-display mb-4"
        style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '4px', color: 'rgba(220,240,230,0.9)' }}
      >
        INVESTIGATOR PROFILE
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, ease: EASE }}
          >
            <p className="font-body mb-1" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(100,200,140,0.4)' }}>
              {s.label}
            </p>
            <p className="font-display" style={{ fontSize: '1.1rem', letterSpacing: '2px', color: 'rgba(200,230,210,0.9)' }}>
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="mt-4" style={{ height: 1, background: 'rgba(100,200,140,0.1)' }} />
      <div className="mt-3 relative" style={{ height: 4, background: 'rgba(100,200,140,0.08)' }}>
        <motion.div
          className="absolute top-0 left-0 h-full"
          style={{ background: 'rgba(80,200,140,0.5)', originX: 0 }}
          animate={{ width: `${investigationCompletion}%` }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      </div>
      <p className="font-body mt-2" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(100,200,140,0.35)' }}>
        INVESTIGATION COMPLETION — {investigationCompletion}%
      </p>
    </motion.section>
  )
}
