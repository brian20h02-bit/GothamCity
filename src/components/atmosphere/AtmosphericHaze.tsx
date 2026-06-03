import { memo } from 'react'
import type { AtmosphereRegion } from '@/data/sceneAtmosphere'

interface Props {
  /** 0–1 — opacidad máxima clamped a 0.12 */
  level?: number
  region?: AtmosphereRegion
  zIndex?: number
}

/** Capa 4 — velo atmosférico muy sutil, nunca pantalla completa opaca */
export default memo(function AtmosphericHaze({
  level = 0.5,
  region = 'gotham',
  zIndex = 3,
}: Props) {
  if (level <= 0) return null

  const a = Math.min(0.12, 0.06 + level * 0.06)
  const cold = region === 'crime-alley' || region === 'arkham' || region === 'narrows'
  const gray = cold ? '40,40,42' : '44,44,46'

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex,
        background: `
          linear-gradient(180deg, rgba(${gray},${a * 0.55}) 0%, transparent 22%),
          linear-gradient(0deg, rgba(${gray},${a * 0.35}) 0%, transparent 18%)
        `,
      }}
    />
  )
})
