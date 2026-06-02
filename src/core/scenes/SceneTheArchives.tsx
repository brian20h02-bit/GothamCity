// ── FULL REWRITE: Investigation Hub ──────────────────────────────────────────
import { motion } from 'framer-motion'
import { useScene } from '@/core/navigation/SceneContext'
import { useInvestigation } from '@/core/investigation/InvestigationContext'
import type { SceneId } from '@/core/navigation/types'
import type { InvestigationFile } from '@/data/investigationFiles'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const CLEARANCE_LABEL: Record<number, string> = {
  1: 'LEVEL I',
  2: 'LEVEL II',
  3: 'LEVEL III',
  4: 'LEVEL IV',
  5: 'LEVEL V',
}

function FileCard({ file, unlocked, onClick }: {
  file:     InvestigationFile
  unlocked: boolean
  onClick?: () => void
}) {
  const interactive = unlocked && !!file.sceneId

  return (
    <motion.div
      className="relative p-5 sm:p-6"
      style={{
        background: 'var(--bg-2)',
        border:     `1px solid ${unlocked ? 'rgba(229,229,229,0.1)' : 'rgba(229,229,229,0.04)'}`,
        cursor:     interactive ? 'none' : 'default',
        opacity:    unlocked ? 1 : 0.45,
        overflow:   'hidden',
      }}
      whileHover={interactive ? { borderColor: 'rgba(139,0,0,0.6)', scale: 1.005 } : {}}
      transition={{ duration: 0.2 }}
      onClick={interactive ? onClick : undefined}
      onMouseEnter={interactive
        ? () => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'ENTER' }))
        : undefined}
      onMouseLeave={interactive
        ? () => window.dispatchEvent(new CustomEvent('hotspot-leave'))
        : undefined}
    >
      {/* Hover scan line */}
      {interactive && (
        <motion.div
          aria-hidden="true"
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: 'rgba(229,229,229,0.06)', top: '-2px' }}
          initial={{ top: '-2px' }}
          whileHover={{ top: '102%' }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      )}

      <p className="font-body mb-2" style={{ fontSize: '7px', letterSpacing: '4px', color: unlocked ? 'var(--blood)' : 'rgba(229,229,229,0.2)' }}>
        {file.caseNumber}
      </p>
      <h3 className="font-display text-white mb-2" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', letterSpacing: '3px' }}>
        {file.title}
      </h3>
      <p className="font-body mb-3" style={{ fontSize: '7px', letterSpacing: '2px', color: 'rgba(229,229,229,0.3)' }}>
        {file.location}
      </p>
      <p className="font-body" style={{ fontSize: '0.68rem', letterSpacing: '1.5px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        {unlocked ? file.description : '— — — REDACTED — — —'}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-body" style={{ fontSize: '7px', letterSpacing: '3px', color: unlocked ? 'rgba(229,229,229,0.7)' : 'rgba(229,229,229,0.2)' }}>
          {unlocked ? 'OPEN' : 'LOCKED'}
        </span>
        {!unlocked && (
          <span className="font-body" style={{ fontSize: '7px', letterSpacing: '2px', color: 'rgba(229,229,229,0.2)' }}>
            CLEARANCE {CLEARANCE_LABEL[file.clearanceRequired]} REQUIRED
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default function SceneTheArchives() {
  const { navigateTo } = useScene()
  const { unlockedFileIds, clearanceLevel, investigationFiles, progress, foundCount, totalCount } = useInvestigation()

  const handleFileClick = (file: InvestigationFile) => {
    if (!file.sceneId) return
    navigateTo(file.sceneId as SceneId, 'archive')
  }

  return (
    <div className="absolute inset-0 overflow-y-auto pointer-events-auto">
      {/* Subtle CSS grid overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(229,229,229,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(229,229,229,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 px-8 sm:px-14 py-16 sm:py-20 max-w-5xl mx-auto">

        {/* ── HEADER ──────────────────────────────────────────── */}
        <motion.div
          className="mb-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="font-body mb-2" style={{ fontSize: '8px', letterSpacing: '5px', color: 'var(--blood)' }}>
            GOTHAM INTELLIGENCE NETWORK
          </p>
          <h1
            className="font-display text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', letterSpacing: '5px', lineHeight: 1 }}
          >
            GOTHAM ARCHIVES
          </h1>
          <p className="font-body mt-2" style={{ fontSize: '9px', letterSpacing: '4px', color: 'rgba(229,229,229,0.3)' }}>
            RESTRICTED DATABASE — {CLEARANCE_LABEL[clearanceLevel]} ACCESS
          </p>
        </motion.div>

        {/* ── PROGRESS ROW ──────────────────────────────────── */}
        <motion.div
          className="mt-6 mb-10 flex items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        >
          <div style={{ flex: 1, height: '1px', background: 'rgba(229,229,229,0.06)', position: 'relative' }}>
            <motion.div
              className="absolute top-0 left-0 h-full"
              style={{ background: 'rgba(229,229,229,0.3)', originX: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: EASE }}
            />
          </div>
          <span className="font-body" style={{ fontSize: '8px', letterSpacing: '3px', color: 'rgba(229,229,229,0.3)', flexShrink: 0 }}>
            {String(foundCount).padStart(2, '0')} / {totalCount} EVIDENCE — {progress}%
          </span>
        </motion.div>

        {/* ── INVESTIGATION FILES ────────────────────────────── */}
        <motion.p
          className="font-body mb-4"
          style={{ fontSize: '8px', letterSpacing: '5px', color: 'rgba(229,229,229,0.2)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
        >
          INVESTIGATION FILES
        </motion.p>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-px mb-px"
          style={{ background: 'rgba(229,229,229,0.04)' }}
        >
          {investigationFiles.map((file, i) => {
            const unlocked = unlockedFileIds.includes(file.id)
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.1, ease: EASE }}
              >
                <FileCard
                  file={file}
                  unlocked={unlocked}
                  onClick={() => handleFileClick(file)}
                />
              </motion.div>
            )
          })}
        </div>

        {/* ── BATCOMPUTER — clickable when clearance >= 2 ──── */}
        <motion.div
          className="mt-px"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: EASE }}
        >
          <motion.div
            className="relative p-5 sm:p-6 overflow-hidden"
            style={{
              background: clearanceLevel >= 2 ? 'rgba(4, 8, 6, 0.85)' : 'rgba(8,0,0,0.6)',
              border:     clearanceLevel >= 2 ? '1px solid rgba(30,80,55,0.4)' : '1px solid rgba(139,0,0,0.15)',
              cursor:     clearanceLevel >= 2 ? 'none' : 'default',
            }}
            whileHover={clearanceLevel >= 2 ? { borderColor: 'rgba(30,80,55,0.9)', scale: 1.003 } : {}}
            transition={{ duration: 0.2 }}
            onClick={clearanceLevel >= 2 ? () => navigateTo('batcomputer', 'batcomputer') : undefined}
            onMouseEnter={clearanceLevel >= 2
              ? () => window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'ACCESS' }))
              : undefined}
            onMouseLeave={clearanceLevel >= 2
              ? () => window.dispatchEvent(new CustomEvent('hotspot-leave'))
              : undefined}
          >
            {/* Pulsing border */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ border: clearanceLevel >= 2 ? '1px solid rgba(30,80,55,0.5)' : '1px solid rgba(139,0,0,0.3)' }}
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Scan line on hover (only when accessible) */}
            {clearanceLevel >= 2 && (
              <motion.div
                aria-hidden="true"
                className="absolute left-0 right-0 h-px pointer-events-none"
                style={{ top: 0, background: 'rgba(60,150,100,0.1)', willChange: 'transform' }}
                initial={{ transform: 'translateY(-2px)' }}
                whileHover={{ transform: 'translateY(100%)' }}
                transition={{ duration: 1.1, ease: 'linear' }}
              />
            )}

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-body mb-2" style={{ fontSize: '7px', letterSpacing: '4px', color: clearanceLevel >= 2 ? 'rgba(30,150,80,0.8)' : 'rgba(139,0,0,0.6)' }}>
                  {clearanceLevel >= 2 ? 'CLEARANCE GRANTED — LEVEL II+' : 'CLASSIFIED SYSTEM — LEVEL V'}
                </p>
                <h3 className="font-display" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '4px', color: clearanceLevel >= 2 ? 'rgba(229,229,229,0.85)' : 'rgba(229,229,229,0.5)' }}>
                  BATCOMPUTER
                </h3>
              </div>
              <div className="text-right flex-shrink-0">
                {clearanceLevel >= 2 ? (
                  <motion.p
                    className="font-body"
                    style={{ fontSize: '8px', letterSpacing: '3px', color: 'rgba(30,200,100,0.8)' }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ACCESS GRANTED
                  </motion.p>
                ) : (
                  <>
                    <motion.p
                      className="font-body"
                      style={{ fontSize: '8px', letterSpacing: '3px', color: 'var(--blood)' }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ACCESS DENIED
                    </motion.p>
                    <p className="font-body mt-1" style={{ fontSize: '7px', letterSpacing: '2px', color: 'rgba(229,229,229,0.15)' }}>
                      REQUIRES LEVEL V CLEARANCE
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-3" style={{ height: '1px', background: clearanceLevel >= 2 ? 'rgba(30,80,55,0.3)' : 'rgba(139,0,0,0.12)' }} />

            <p className="font-body mt-3" style={{ fontSize: '0.65rem', letterSpacing: '1.5px', color: clearanceLevel >= 2 ? 'rgba(229,229,229,0.4)' : 'rgba(229,229,229,0.2)', lineHeight: 1.8 }}>
              {clearanceLevel >= 2
                ? 'Wayne Network online. Central intelligence system active. Click to access the secure hub.'
                : 'Central intelligence system. Access requires completion of all active investigations. Data classified under executive authority.'}
            </p>
          </motion.div>
        </motion.div>

        {/* ── FOOTER ──────────────────────────────────────────── */}
        <motion.p
          className="text-center font-body mt-10 pb-8"
          style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(229,229,229,0.12)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4, ease: EASE }}
        >
          GIN — GOTHAM INTELLIGENCE NETWORK — ALL RIGHTS RESERVED
        </motion.p>

      </div>
    </div>
  )
}
