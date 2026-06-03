import { memo, useEffect, useRef } from 'react'

interface AtmosphericHumidityProps {
  level?: number
  zIndex?: number
}

/** @deprecated — usar AtmosphericHaze en FogLayer */
export default memo(function AtmosphericHumidity({
  level = 0.5,
  zIndex = 2,
}: AtmosphericHumidityProps) {
  const filmRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = filmRef.current
    if (!el || level <= 0) return

    let raf: number
    let t = 0
    const tick = () => {
      t += 0.003
      el.style.opacity = String(0.2 + Math.sin(t * 0.6) * 0.04)
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [level])

  if (level <= 0) return null

  const a = Math.min(0.08, level * 0.12)

  return (
    <div
      ref={filmRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex,
        background: `linear-gradient(180deg, rgba(48,48,50,${a}) 0%, transparent 20%)`,
      }}
    />
  )
})
