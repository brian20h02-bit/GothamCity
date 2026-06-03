import { motion, AnimatePresence } from 'framer-motion'
import type { PatientRecord, SubjectRecord } from '@/data/arkhamRecords'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const FADE = 0.2

interface SubjectsProps {
  title:    string
  subtitle: string
  subjects: SubjectRecord[]
}

interface PatientProps {
  title:   string
  patient: PatientRecord
}

type Props =
  | { open: boolean; onClose: () => void; mode: 'subjects'; data: SubjectsProps }
  | { open: boolean; onClose: () => void; mode: 'patient'; data: PatientProps }

const THREAT_COLOR: Record<string, string> = {
  CRITICAL: 'rgba(200,30,30,0.9)',
  HIGH:     'rgba(220,130,30,0.85)',
  MEDIUM:   'rgba(200,180,30,0.75)',
}

export default function ReadFileModal(props: Props) {
  const { open, onClose, mode, data } = props

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="read-file-backdrop"
          className="fixed inset-0 flex items-center justify-center pointer-events-auto"
          style={{ zIndex: 8600, background: 'rgba(2,2,2,0.72)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto"
            style={{
              background: 'rgba(8,8,8,0.92)',
              border: '1px solid rgba(229,229,229,0.12)',
              backdropFilter: 'blur(12px)',
            }}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: FADE, ease: EASE }}
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close file"
              className="absolute top-4 right-4 font-body pointer-events-auto"
              style={{
                fontSize: 14,
                color: 'rgba(229,229,229,0.45)',
                background: 'none',
                border: 'none',
                cursor: 'none',
                lineHeight: 1,
                padding: '4px 8px',
              }}
              onClick={onClose}
              onMouseEnter={() => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: { actionLine: 'CLOSE', targetLine: 'FILE' } }))}
              onMouseLeave={() => window.dispatchEvent(new CustomEvent('hotspot-leave'))}
            >
              ✕
            </button>

            <div className="p-8 pt-10">
              {mode === 'subjects' && (
                <>
                  <p className="font-body mb-2" style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(139,0,0,0.7)' }}>
                    {data.subtitle}
                  </p>
                  <h2 className="font-display text-white mb-6" style={{ fontSize: '1.2rem', letterSpacing: '3px' }}>
                    {data.title}
                  </h2>
                  <div className="space-y-2">
                    {data.subjects.map(sub => (
                      <div
                        key={sub.id}
                        className="p-4"
                        style={{ background: 'rgba(12,5,5,0.8)', border: '1px solid rgba(139,0,0,0.18)' }}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.3)' }}>{sub.id}</span>
                          <span className="font-body" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(200,60,60,0.7)' }}>{sub.status}</span>
                        </div>
                        <p className="font-display text-white mb-1" style={{ fontSize: '0.9rem', letterSpacing: '2px' }}>{sub.name}</p>
                        <p className="font-body mb-2" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(229,229,229,0.35)' }}>{sub.ward}</p>
                        <p className="font-body" style={{ fontSize: '7px', letterSpacing: '1px', color: 'rgba(229,229,229,0.5)', lineHeight: 1.7 }}>{sub.diagnosis}</p>
                        <p className="font-body mt-2" style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(229,229,229,0.25)' }}>
                          ADMITTED {sub.admitted} · {sub.incidents} INCIDENTS
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {mode === 'patient' && (
                <>
                  <p className="font-body mb-2" style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(139,0,0,0.7)' }}>
                    ARKHAM ASYLUM — SECURE DATABASE
                  </p>
                  <h2 className="font-display text-white mb-1" style={{ fontSize: '1.2rem', letterSpacing: '3px' }}>
                    {data.patient.name}
                  </h2>
                  <p className="font-body mb-6" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.3)' }}>
                    ID #{data.patient.id} · {data.patient.ward}
                  </p>
                  <div className="space-y-4">
                    {[
                      ['STATUS', data.patient.status],
                      ['THREAT LEVEL', data.patient.threat],
                      ['ADMITTED', data.patient.admit],
                      ['DIAGNOSIS', data.patient.diagnosis],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="font-body mb-1" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.25)' }}>{label}</p>
                        <p
                          className="font-body"
                          style={{
                            fontSize: '8px',
                            letterSpacing: '1.5px',
                            color: label === 'THREAT LEVEL' ? (THREAT_COLOR[value] ?? 'rgba(229,229,229,0.7)') : 'rgba(229,229,229,0.75)',
                            lineHeight: 1.7,
                          }}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                    <div>
                      <p className="font-body mb-1" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.25)' }}>NOTES</p>
                      <p className="font-body" style={{ fontSize: '8px', letterSpacing: '1px', color: 'rgba(229,229,229,0.55)', lineHeight: 1.8 }}>
                        {data.patient.history}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
