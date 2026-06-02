import { motion } from 'framer-motion'
import { memo, useEffect, useState } from 'react'

export type BackgroundDrift = 'none' | 'subtle' | 'approach'

interface SceneBackgroundProps {
  src: string
  drift?: BackgroundDrift
  parallax?: boolean
  isZooming?: boolean
}

const SceneBackground = memo(function SceneBackground({
  src,
  drift = 'none',
  parallax = false,
  isZooming = false,
}: SceneBackgroundProps) {
  const [shift, setShift] = useState({ x: 0, y: 0 })
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  useEffect(() => {
    if (!parallax) {
      setShift({ x: 0, y: 0 })
      return
    }
    const onMove = (e: MouseEvent) => {
      setShift({
        x: (e.clientX / window.innerWidth - 0.5) * 24,
        y: (e.clientY / window.innerHeight - 0.5) * 16,
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [parallax])

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
      ? { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }
      : drift === 'none'
        ? { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }
        : { duration: 16, repeat: Infinity, ease: 'easeInOut' as const }

  const handleError = () => {
    if (imgSrc.endsWith('.png') && !imgSrc.endsWith('.png.png')) {
      setImgSrc(`${src}.png`)
    }
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 0, transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <div
        className="absolute"
        style={{
          width:     '108%',
          height:    '108%',
          left:      '-4%',
          top:       '-4%',
          transform: `translate3d(${shift.x}px, ${shift.y}px, 0)`,
        }}
      >
        <motion.div
          className="h-full w-full"
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
            className="block h-full w-full object-cover select-none"
          />
        </motion.div>
      </div>
    </div>
  )
})

export default SceneBackground
