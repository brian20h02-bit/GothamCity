import { memo } from 'react'
import { motion } from 'framer-motion'
import type { AtmosphereRegion } from '@/data/sceneAtmosphere'

interface SceneMicroAnimationsProps {
  region?: AtmosphereRegion
  zIndex?: number
}

/** Subtle environmental life — shadows, signs, glass, screens */
export default memo(function SceneMicroAnimations({
  region = 'gotham',
  zIndex = 3,
}: SceneMicroAnimationsProps) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex }}
    >
      {/* Arkham — faulty lights, drifting shadows */}
      {(region === 'arkham') && (
        <>
          <motion.div
            className="absolute"
            style={{
              width: '6vw', height: '4vh', left: '22%', top: '18%',
              background: 'rgba(180,160,120,0.04)',
              boxShadow: '0 0 40px rgba(160,140,100,0.06)',
            }}
            animate={{ opacity: [0.2, 0.5, 0.1, 0.45, 0.15, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute"
            style={{
              width: '40vw', height: '60vh', left: '50%', top: '20%',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.08) 0%, transparent 60%)',
            }}
            animate={{ x: [0, 8, -4, 6, 0], opacity: [0.3, 0.5, 0.35, 0.45, 0.3] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute"
            style={{
              width: '3vw', height: '20vh', right: '28%', top: '30%',
              background: 'linear-gradient(180deg, rgba(60,65,70,0.06), transparent)',
            }}
            animate={{ x: [0, 3, -2, 0], skewX: [0, 1, -0.5, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Crime Alley — sign sway, puddle shimmer */}
      {region === 'crime-alley' && (
        <>
          <motion.div
            className="absolute"
            style={{
              width: '8vw', height: '12vh', left: '38%', top: '22%',
              background: 'linear-gradient(180deg, rgba(80,75,70,0.05), transparent)',
              transformOrigin: 'top center',
            }}
            animate={{ rotate: [-0.8, 0.6, -0.4, 0.8, -0.8] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute"
            style={{
              width: '25vw', height: '3vh', left: '30%', bottom: '12%',
              background: 'linear-gradient(90deg, transparent, rgba(60,65,75,0.06), transparent)',
            }}
            animate={{ opacity: [0.2, 0.45, 0.25, 0.4, 0.2], scaleX: [1, 1.02, 0.98, 1.01, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Wayne — rain on glass, marble reflection */}
      {region === 'wayne' && (
        <>
          {[0.15, 0.35, 0.55, 0.72].map((left, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: '1px', height: '18vh',
                left: `${left * 100}%`, top: `${20 + i * 8}%`,
                background: 'linear-gradient(180deg, transparent, rgba(100,110,120,0.08), transparent)',
              }}
              animate={{ y: [0, 40, 80], opacity: [0, 0.3, 0] }}
              transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.7, ease: 'linear' }}
            />
          ))}
          <motion.div
            className="absolute"
            style={{
              width: '30vw', height: '8vh', left: '35%', bottom: '25%',
              background: 'linear-gradient(90deg, transparent, rgba(90,95,105,0.04), transparent)',
            }}
            animate={{ opacity: [0.15, 0.3, 0.2, 0.25, 0.15], x: [0, 5, -3, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Batcomputer — slow screen activity */}
      {region === 'batcomputer' && (
        <>
          {[
            { l: '30%', t: '35%', w: '18vw', h: '14vh' },
            { l: '52%', t: '38%', w: '14vw', h: '12vh' },
            { l: '68%', t: '42%', w: '10vw', h: '8vh' },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: s.l, top: s.t, width: s.w, height: s.h,
                background: `linear-gradient(180deg, rgba(30,50,45,0.06) 0%, rgba(20,35,30,0.03) 100%)`,
                boxShadow: 'inset 0 0 30px rgba(25,45,40,0.04)',
              }}
              animate={{ opacity: [0.25, 0.45, 0.3, 0.4, 0.25] }}
              transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
            />
          ))}
          <motion.div
            className="absolute"
            style={{
              width: '100%', height: '2px', left: 0, top: '40%',
              background: 'linear-gradient(90deg, transparent, rgba(40,60,55,0.08), transparent)',
            }}
            animate={{ top: ['38%', '44%', '38%'], opacity: [0, 0.4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}

      {/* Narrows — industrial grime shimmer */}
      {region === 'narrows' && (
        <motion.div
          className="absolute"
          style={{
            width: '100%', height: '18vh', bottom: 0,
            background: 'linear-gradient(0deg, rgba(48,48,50,0.05), transparent)',
          }}
          animate={{ opacity: [0.25, 0.35, 0.28, 0.32, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
})
