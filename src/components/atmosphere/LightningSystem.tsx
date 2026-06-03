import { useEffect, useRef, memo } from 'react'

interface Flash {
  x: number
  intensity: number
  duration: number
}

interface LightningSystemProps {
  rate?: number
}

/** Relámpagos ocasionales — iluminación desde el cielo, <1 segundo */
const LightningSystem = memo(function LightningSystem({ rate = 1 }: LightningSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    const interval = () => (14000 + Math.random() * 28000) / Math.max(0.25, rate)
    let nextFlashAt = Date.now() + interval()
    const flashes: Array<{ startedAt: number } & Flash> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const triggerFlash = () => {
      const main: Flash = {
        x: 15 + Math.random() * 70,
        intensity: 0.55 + Math.random() * 0.45,
        duration: 180 + Math.random() * 520,
      }
      flashes.push({ ...main, startedAt: Date.now() })
      if (Math.random() > 0.35) {
        setTimeout(() => {
          flashes.push({
            x: main.x + (Math.random() - 0.5) * 8,
            intensity: main.intensity * 0.4,
            duration: 120 + Math.random() * 180,
            startedAt: Date.now(),
          })
        }, 90 + Math.random() * 120)
      }
      nextFlashAt = Date.now() + interval()
    }

    const draw = () => {
      rafId = requestAnimationFrame(draw)
      const now = Date.now()

      if (now >= nextFlashAt) triggerFlash()

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let i = flashes.length
      while (i--) {
        const f = flashes[i]
        const elapsed = now - f.startedAt
        if (elapsed >= f.duration) { flashes.splice(i, 1); continue }

        const t = elapsed / f.duration
        const env = t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88
        const alpha = f.intensity * env

        const skyX = (f.x / 100) * canvas.width
        const skyY = canvas.height * 0.08

        /* Flash principal — desde el cielo */
        const sky = ctx.createRadialGradient(skyX, skyY, 0, skyX, canvas.height * 0.5, canvas.height * 0.85)
        sky.addColorStop(0, `rgba(175,180,190,${alpha * 0.14})`)
        sky.addColorStop(0.35, `rgba(130,135,145,${alpha * 0.06})`)
        sky.addColorStop(0.7, `rgba(90,95,105,${alpha * 0.02})`)
        sky.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = sky
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        /* Pulso breve de escena */
        ctx.fillStyle = `rgba(200,205,215,${alpha * 0.035})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [rate])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 6, mixBlendMode: 'screen' }}
    />
  )
})

export default LightningSystem
