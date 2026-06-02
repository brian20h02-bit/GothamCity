import { useEffect, useRef } from 'react'

interface Drop {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
}

const DROP_COUNT = 130
const WIND_ANGLE = 0.22 // radians — slight lean to the right

export default function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const drops: Drop[] = []

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }

    const spawnDrop = (): Drop => ({
      x:       Math.random() * (canvas.width + 200) - 100,
      y:       Math.random() * canvas.height - canvas.height,
      length:  10 + Math.random() * 22,
      speed:   6  + Math.random() * 10,
      opacity: 0.03 + Math.random() * 0.11,
    })

    const initDrops = () => {
      drops.length = 0
      for (let i = 0; i < DROP_COUNT; i++) {
        const d = spawnDrop()
        d.y = Math.random() * canvas.height // scatter vertically on init
        drops.push(d)
      }
    }

    const sinA = Math.sin(WIND_ANGLE)
    const cosA = Math.cos(WIND_ANGLE)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drops.forEach((drop) => {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(190, 210, 240, ${drop.opacity})`
        ctx.lineWidth   = 0.5
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x + sinA * drop.length, drop.y + cosA * drop.length)
        ctx.stroke()

        drop.x += sinA * drop.speed * 0.35
        drop.y += cosA * drop.speed * 0.7

        if (drop.y > canvas.height + drop.length || drop.x > canvas.width + 100) {
          Object.assign(drop, spawnDrop())
        }
      })

      animId = requestAnimationFrame(draw)
    }

    resize()
    initDrops()
    draw()

    const handleResize = () => { resize(); initDrops() }
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 4,
        pointerEvents: 'none',
      }}
    />
  )
}
