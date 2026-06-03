import { memo } from 'react'
import { motion } from 'framer-motion'
import type { AtmosphereRegion } from '@/data/sceneAtmosphere'

interface DynamicLightingProps {
  region?: AtmosphereRegion
  lampFlicker?: boolean
  windowGlow?: boolean
  screenPulse?: boolean
  dimLevel?: number
  zIndex?: number
}

/** Iluminación solo desde faroles, ventanas y pantallas — nunca desde abajo */
export default memo(function DynamicLighting({
  region = 'gotham',
  lampFlicker = false,
  windowGlow = false,
  screenPulse = false,
  dimLevel = 0,
  zIndex = 2,
}: DynamicLightingProps) {
  const hasContent = lampFlicker || windowGlow || screenPulse || dimLevel > 0
  if (!hasContent) return null

  const isWayne = region === 'wayne'
  const isBatcomputer = region === 'batcomputer'

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex }}
    >
      {dimLevel > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `rgba(5,8,12,${dimLevel * 0.55})`,
            mixBlendMode: 'multiply',
          }}
        />
      )}

      {/* Faroles — fuente lateral/superior */}
      {lampFlicker && !isWayne && (
        <>
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '9vw', height: '9vw',
              left: '10%', top: '32%',
              background: 'radial-gradient(circle at 50% 30%, rgba(140,110,70,0.07) 0%, transparent 68%)',
            }}
            animate={{ opacity: [0.12, 0.32, 0.1, 0.28, 0.12] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '7vw', height: '7vw',
              right: '14%', top: '34%',
              background: 'radial-gradient(circle at 50% 28%, rgba(130,100,65,0.06) 0%, transparent 70%)',
            }}
            animate={{ opacity: [0.08, 0.22, 0.07, 0.2, 0.08] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear', delay: 2 }}
          />
        </>
      )}

      {isWayne && lampFlicker && (
        <>
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '5vw', height: '5vw', left: '28%', top: '38%',
              background: 'radial-gradient(circle at 50% 25%, rgba(120,115,105,0.05) 0%, transparent 72%)',
            }}
            animate={{ opacity: [0.06, 0.18, 0.04, 0.15, 0.06] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '4vw', height: '4vw', right: '32%', top: '32%',
              background: 'radial-gradient(circle at 50% 22%, rgba(100,105,115,0.04) 0%, transparent 72%)',
            }}
            animate={{ opacity: [0.04, 0.12, 0.03, 0.1, 0.04] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />
        </>
      )}

      {/* Ventanas iluminadas — mid/upper frame */}
      {windowGlow && (
        <>
          <motion.div
            className="absolute"
            style={{
              width: '3vw', height: '5vh', left: '58%', top: '26%',
              background: 'rgba(100,95,85,0.04)',
            }}
            animate={{ opacity: [0.15, 0.35, 0.12, 0.3, 0.15] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute"
            style={{
              width: '2.5vw', height: '4vh', left: '74%', top: '24%',
              background: 'rgba(85,90,100,0.03)',
            }}
            animate={{ opacity: [0.08, 0.25, 0.1, 0.22, 0.08] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
        </>
      )}

      {/* Batcomputer — glow de monitor, no ambient inferior */}
      {screenPulse && isBatcomputer && (
        <motion.div
          className="absolute"
          style={{
            width: '28vw', height: '20vh', left: '34%', top: '38%',
            background: 'radial-gradient(ellipse at 50% 40%, rgba(25,40,38,0.09) 0%, transparent 72%)',
          }}
          animate={{ opacity: [0.18, 0.32, 0.2, 0.28, 0.18] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
})
