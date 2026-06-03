import type { CSSProperties } from 'react'

export interface HitAreaProps {
  top:           number
  left:          number
  hitRadius?:    number
  hitWidthPct?:  number
  hitHeightPct?: number
}

export function getHitAreaStyle({
  top,
  left,
  hitRadius = 40,
  hitWidthPct,
  hitHeightPct,
}: HitAreaProps): CSSProperties {
  if (hitWidthPct != null && hitHeightPct != null) {
    return {
      top: `${top - hitHeightPct / 2}%`,
      left: `${left - hitWidthPct / 2}%`,
      width: `${hitWidthPct}%`,
      height: `${hitHeightPct}%`,
    }
  }
  return {
    top: `${top}%`,
    left: `${left}%`,
    width: hitRadius * 2,
    height: hitRadius * 2,
    transform: 'translate(-50%, -50%)',
  }
}

export function anchorToHitProps(a: {
  top: number
  left: number
  width?: number
  height?: number
  hitRadius?: number
}): HitAreaProps {
  if (a.width != null && a.height != null) {
    return { top: a.top, left: a.left, hitWidthPct: a.width, hitHeightPct: a.height }
  }
  return { top: a.top, left: a.left, hitRadius: a.hitRadius ?? 36 }
}
