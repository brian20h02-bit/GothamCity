import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { caseFiles } from '@/data/caseFiles'
import type { CaseFile, CaseStatus } from '@/data/caseFiles'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// Status colors — only red for danger states, neutral for the rest
const statusConfig: Record<CaseStatus, { color: string; dot: string }> = {
  'OPEN':               { color: 'rgba(229,229,229,0.85)', dot: 'rgba(229,229,229,0.5)' },
  'RESTRICTED':         { color: 'rgba(139,0,0,0.9)',      dot: 'rgba(139,0,0,0.7)'     },
  'SECURE':             { color: 'rgba(140,140,140,0.7)',   dot: 'rgba(100,100,100,0.5)' },
  'ACTIVE':             { color: 'rgba(229,229,229,0.85)', dot: 'rgba(180,180,180,0.5)' },
  'UNDER SURVEILLANCE': { color: 'rgba(160,130,80,0.8)',   dot: 'rgba(130,100,50,0.6)'  },
  'CRITICAL':           { color: 'rgba(180,0,0,1)',         dot: 'rgba(160,0,0,0.8)'     },
}

interface CardProps {
  file: CaseFile
  index: number
  sectionInView: boolean
}

function CaseCard({ file, index, sectionInView }: CardProps) {
  const [hovered, setHovered] = useState(false)
  const sc = statusConfig[file.status]

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      animate={sectionInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden cursor-default"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'rgba(139,0,0,0.5)' : 'rgba(43,43,43,0.9)'}`,
        transition: 'border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(139,0,0,0.1)'
          : '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      {/* Scan line on hover */}
      {hovered && (
        <motion.div
          aria-hidden="true"
          className="absolute left-0 right-0 pointer-events-none"
          style={{ height: '1px', background: 'rgba(139,0,0,0.25)', zIndex: 2 }}
          initial={{ top: '0%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 1.4, ease: 'linear', repeat: Infinity }}
        />
      )}

      {/* Corner accents */}
      <div
        className="absolute top-0 left-0 w-3 h-3 pointer-events-none"
        style={{
          borderTop: `1px solid ${hovered ? 'rgba(139,0,0,0.6)' : 'rgba(229,229,229,0.1)'}`,
          borderLeft: `1px solid ${hovered ? 'rgba(139,0,0,0.6)' : 'rgba(229,229,229,0.1)'}`,
          transition: 'border-color 0.4s ease',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none"
        style={{
          borderBottom: `1px solid ${hovered ? 'rgba(139,0,0,0.6)' : 'rgba(229,229,229,0.1)'}`,
          borderRight: `1px solid ${hovered ? 'rgba(139,0,0,0.6)' : 'rgba(229,229,229,0.1)'}`,
          transition: 'border-color 0.4s ease',
        }}
      />

      <div className="relative z-10 p-6 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span
              className="font-body block"
              style={{ fontSize: '8px', letterSpacing: '3px', color: 'var(--text-muted)' }}
            >
              {file.caseNumber}
            </span>
            <h3
              className="font-display text-white leading-none"
              style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', letterSpacing: '2px' }}
            >
              {file.name}
            </h3>
          </div>

          {/* Classification badge */}
          <span
            className="font-body shrink-0"
            style={{
              fontSize: '7px',
              letterSpacing: '2px',
              color: 'var(--text-muted)',
              border: '1px solid rgba(43,43,43,0.8)',
              padding: '3px 6px',
            }}
          >
            {file.classification}
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: hovered ? 'rgba(139,0,0,0.2)' : 'rgba(43,43,43,0.8)',
            transition: 'background 0.4s ease',
          }}
        />

        {/* Excerpt */}
        <p
          className="font-body leading-relaxed"
          style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.7' }}
        >
          {file.excerpt}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-1">
          {/* Status */}
          <div className="flex items-center gap-2">
            <div
              className="rounded-full"
              style={{
                width: '5px',
                height: '5px',
                background: sc.dot,
                ...(file.status === 'ACTIVE' || file.status === 'CRITICAL'
                  ? { animation: 'pulse 1.8s ease-in-out infinite' }
                  : {}),
              }}
            />
            <span
              className="font-body font-medium"
              style={{ fontSize: '9px', letterSpacing: '2px', color: sc.color }}
            >
              {file.status}
            </span>
          </div>

          {/* Date */}
          <span
            className="font-body"
            style={{ fontSize: '8px', letterSpacing: '2px', color: 'var(--text-muted)' }}
          >
            {file.date}
          </span>
        </div>

        {/* Accessing record tooltip on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ position: 'absolute', bottom: '6px', right: '10px' }}
        >
          <span
            className="font-body"
            style={{ fontSize: '7px', letterSpacing: '2px', color: 'rgba(139,0,0,0.7)' }}
          >
            ACCESSING RECORD...
          </span>
        </motion.div>
      </div>
    </motion.article>
  )
}

export default function TheArchives() {
  const [ref, inView] = useInView(0.1)
  const sectionTopRef = useRef<HTMLElement>(null)

  return (
    <section
      id="the-archives"
      ref={sectionTopRef}
      className="relative w-full overflow-hidden py-28 px-6 sm:px-14 lg:px-28"
      style={{ background: 'var(--bg-2)' }}
    >
      {/* Top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(43,43,43,0.8), transparent)' }}
      />

      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(229,229,229,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(229,229,229,0.015) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto space-y-16">

        {/* ── Section header ───────────────────────────────── */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            className="flex items-center gap-3"
          >
            <div className="w-4 h-px" style={{ background: 'rgba(139,0,0,0.6)' }} />
            <span
              className="font-body"
              style={{ fontSize: '9px', letterSpacing: '5px', color: 'rgba(139,0,0,0.7)' }}
            >
              RESTRICTED ACCESS
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.1, ease: EASE }}
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', letterSpacing: '4px' }}
          >
            THE ARCHIVES
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.22, ease: 'easeOut' }}
            className="font-body font-light max-w-md leading-[1.8]"
            style={{ fontSize: 'clamp(0.78rem, 1.1vw, 0.9rem)', color: 'var(--text-secondary)' }}
          >
            A collection of classified records documenting the rise and decay of Gotham City.
          </motion.p>
        </div>

        {/* ── Case file grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {caseFiles.map((file, i) => (
            <CaseCard key={file.id} file={file} index={i} sectionInView={inView} />
          ))}
        </div>

        {/* ── Footer of section ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col items-center gap-3 pt-6"
        >
          <div
            className="h-px w-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(43,43,43,0.8), transparent)' }}
          />
          <div className="flex flex-col items-center gap-1 pt-2">
            <span
              className="font-display text-white"
              style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', letterSpacing: '4px' }}
            >
              MORE RECORDS AVAILABLE
            </span>
            <span
              className="font-body"
              style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(139,0,0,0.6)' }}
            >
              CLASSIFICATION REQUIRED
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
