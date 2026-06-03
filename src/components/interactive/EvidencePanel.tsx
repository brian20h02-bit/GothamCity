import { motion, AnimatePresence } from 'framer-motion'
import { useInvestigation } from '@/core/investigation/InvestigationContext'
import type { Evidence } from '@/data/evidence'

interface EvidencePanelProps {
  sceneId:   string
  title?:    string
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function EvidencePanel({ sceneId, title = 'EVIDENCE' }: EvidencePanelProps) {
  const { allEvidence, isEvidenceFound, foundCount, progress, totalCount } = useInvestigation()

  const sceneEvidence = allEvidence.filter((e: Evidence) => e.scene === sceneId)
  const foundInScene  = sceneEvidence.filter((e: Evidence) => isEvidenceFound(e.id))
  const sceneProgress = sceneEvidence.length > 0
    ? Math.round((foundInScene.length / sceneEvidence.length) * 100)
    : 0

  return (
    <motion.div
      className="absolute top-8 right-6 sm:right-10 pointer-events-none z-30"
      style={{ width: '200px' }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
    >
      <div
        style={{
          background:          'rgba(5,5,5,0.75)',
          border:              '1px solid rgba(229,229,229,0.08)',
          backdropFilter:      'blur(6px)',
          WebkitBackdropFilter:'blur(6px)',
          padding:             '16px',
        }}
      >
        {/* Header */}
        <p className="font-body mb-3" style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(229,229,229,0.3)' }}>
          {title}
        </p>

        {/* Scene progress bar */}
        <div className="mb-3" style={{ height: '1px', background: 'rgba(229,229,229,0.1)', position: 'relative' }}>
          <motion.div
            className="absolute top-0 left-0 h-full"
            style={{ background: 'rgba(139,0,0,0.7)', originX: 0 }}
            animate={{ width: `${sceneProgress}%` }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        </div>

        {/* Evidence checklist */}
        <ul className="flex flex-col gap-2">
          <AnimatePresence>
            {sceneEvidence.map((ev: Evidence) => {
              const found = isEvidenceFound(ev.id)
              return (
                <motion.li
                  key={ev.id}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: found ? 1 : 0.35 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Checkbox */}
                  <span
                    style={{
                      flexShrink:  0,
                      width:       '10px',
                      height:      '10px',
                      border:      `1px solid ${found ? 'var(--blood)' : 'rgba(229,229,229,0.2)'}`,
                      background:  found ? 'var(--blood)' : 'transparent',
                      display:     'flex',
                      alignItems:  'center',
                      justifyContent: 'center',
                      marginTop:   '1px',
                    }}
                  >
                    {found && (
                      <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                        <path d="M1 3 L2.5 4.5 L5 1.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    )}
                  </span>

                  {/* Title */}
                  <span
                    className="font-body"
                    style={{
                      fontSize:      '7.5px',
                      letterSpacing: '1.5px',
                      lineHeight:    1.4,
                      color:         found ? 'rgba(229,229,229,0.85)' : 'rgba(229,229,229,0.25)',
                    }}
                  >
                    {ev.title}
                  </span>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>

        {/* Global footer */}
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(229,229,229,0.06)' }}>
          <p className="font-body" style={{ fontSize: '7px', letterSpacing: '2px', color: 'rgba(229,229,229,0.2)' }}>
            TOTAL {String(foundCount).padStart(2, '0')} / {String(totalCount).padStart(2, '0')} — {progress}%
          </p>
        </div>
      </div>
    </motion.div>
  )
}
