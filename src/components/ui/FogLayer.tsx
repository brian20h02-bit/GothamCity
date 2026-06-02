import { motion } from 'framer-motion'

interface FogBlob {
  width: string
  height: string
  left: string
  top: string
  animateX: number[]
  animateY: number[]
  duration: number
  blurPx: number
  opacity: number
}

const blobs: FogBlob[] = [
  {
    width: '70vw', height: '50vh',
    left: '-10%',  top: '10%',
    animateX: [0, 60, 20, 0],
    animateY: [0, 30, -15, 0],
    duration: 38,
    blurPx: 80,
    opacity: 0.045,
  },
  {
    width: '55vw', height: '40vh',
    left: '40%',   top: '30%',
    animateX: [0, -50, 30, 0],
    animateY: [0, -20, 40, 0],
    duration: 52,
    blurPx: 100,
    opacity: 0.035,
  },
  {
    width: '80vw', height: '35vh',
    left: '20%',   top: '55%',
    animateX: [0, 40, -30, 0],
    animateY: [0, 20, -25, 0],
    duration: 44,
    blurPx: 90,
    opacity: 0.03,
  },
  {
    width: '45vw', height: '55vh',
    left: '60%',   top: '-5%',
    animateX: [0, -35, 15, 0],
    animateY: [0, 45, -10, 0],
    duration: 60,
    blurPx: 70,
    opacity: 0.04,
  },
]

export default function FogLayer() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width:  blob.width,
            height: blob.height,
            left:   blob.left,
            top:    blob.top,
            background: 'radial-gradient(ellipse, rgba(220,225,235,1) 0%, transparent 70%)',
            filter: `blur(${blob.blurPx}px)`,
            opacity: blob.opacity,
          }}
          animate={{
            x: blob.animateX,
            y: blob.animateY,
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
