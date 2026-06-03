import { motion } from 'framer-motion'
import { memo, useEffect, useState, type ReactNode } from 'react'
import type { BackgroundDrift } from './SceneBackground'

export type { BackgroundDrift }

interface SceneWorldProps {
  src:              string
  drift?:           BackgroundDrift
  parallax?:        boolean
  isZooming?:       boolean
  cameraDrift?:     number
  parallaxStrength?: number
  children?:        ReactNode
}

/**
 * Contenedor de mundo: imagen + hijos comparten parallax, scale y camera drift.
 */
const SceneWorld = memo(function SceneWorld({
  src,
  drift = 'none',
  parallax = false,
  isZooming = false,
  cameraDrift = 2,
  parallaxStrength = 1,
  children,
}: SceneWorldProps) {
  const [shift, setShift] = useState({ x: 0, y: 0 })
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => { setImgSrc(src) }, [src])

  useEffect(() => {
    if (!parallax) {
      setShift({ x: 0, y: 0 })
      return
    }
    const onMove = (e: MouseEvent) => {
      const str = parallaxStrength
      setShift({
        x: (e.clientX / window.innerWidth - 0.5) * 24 * str,
        y: (e.clientY / window.innerHeight - 0.5) * 16 * str,
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [parallax, parallaxStrength])

  const scaleAnim =
    isZooming
      ? 1.08
      : drift === 'subtle'
        ? [1.03, 1.05, 1.03]
        : drift === 'approach'
          ? [1.02, 1.06, 1.03]
          : 1.03

  const scaleTransition =
    isZooming
      ? { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }
      : drift === 'none'
        ? { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }
        : { duration: 16, repeat: Infinity, ease: 'easeInOut' as const }

  const handleError = () => {
    if (imgSrc.endsWith('.png') && !imgSrc.endsWith('.png.png')) {
      setImgSrc(`${src}.png`)
    }
  }

  const cd = cameraDrift

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 0, transform: 'translateZ(0)' }}
    >
      <motion.div
        className="absolute"
        style={{
          width: '108%',
          height: '108%',
          left: '-4%',
          top: '-4%',
          willChange: 'transform',
        }}
        animate={{
          x: shift.x,
          y: shift.y,
        }}
        transition={{ type: 'spring', stiffness: 45, damping: 20 }}
      >
        {/* Micro camera drift — documentary handheld feel */}
        <motion.div
          className="relative h-full w-full"
          animate={
            cd > 0
              ? {
                  x: [0, cd, -cd * 0.6, cd * 0.4, 0],
                  y: [0, -cd * 0.7, cd * 0.5, -cd * 0.35, 0],
                }
              : { x: 0, y: 0 }
          }
          transition={
            cd > 0
              ? { duration: 22, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0 }
          }
        >
          <motion.div
            className="relative h-full w-full"
            style={{ willChange: 'transform' }}
            animate={{ scale: scaleAnim }}
            transition={{ scale: scaleTransition }}
          >
            <img
              key={imgSrc}
              src={imgSrc}
              alt=""
              draggable={false}
              decoding="async"
              fetchPriority="high"
              onError={handleError}
              className="absolute inset-0 block h-full w-full object-cover select-none pointer-events-none"
            />

            <div className="absolute inset-0" style={{ zIndex: 2 }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
})

export default SceneWorld
