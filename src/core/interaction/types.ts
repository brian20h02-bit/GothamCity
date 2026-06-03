/**
 * Prioridad de click (mayor z-index = gana en solapamiento).
 * Navigation por encima de evidencia cuando ambos están activos (detective OFF).
 */
export const INTERACTION_PRIORITY = {
  EVIDENCE:    22,
  DETECTIVE:   20,
  INFO:        45,
  UI:          48,
  NAVIGATION:  55,
} as const

export type HotspotKind = 'navigation' | 'evidence' | 'info'

/** @deprecated use HotspotKind */
export type HotspotType = HotspotKind | 'ui'

export type CursorAction =
  | 'DEFAULT'
  | 'INVESTIGATE'
  | 'SCAN'
  | 'ANALYZE'
  | 'ENTER'
  | 'ACCESS'
  | 'OPEN LOCATION'
  | 'VIEW FILE'
  | 'OPEN RECORD'
  | 'EXAMINE'
  | 'LOADING'

export type InteractionLayerKind = HotspotType

export const HOTSPOT_DEBUG_COLORS: Record<string, string> = {
  navigation: 'rgba(220, 175, 90, 0.75)',
  evidence:   'rgba(100, 220, 160, 0.7)',
  info:       'rgba(180, 180, 200, 0.65)',
  ui:         'rgba(180, 180, 200, 0.65)',
}

export function actionToCursorLabel(action: string): CursorAction {
  switch (action) {
    case 'INVESTIGATE': return 'INVESTIGATE'
    case 'ENTER':       return 'ENTER'
    case 'ACCESS':      return 'ACCESS'
    case 'OPEN':        return 'OPEN LOCATION'
    case 'VIEW':        return 'VIEW FILE'
    case 'OPEN RECORD': return 'OPEN RECORD'
    case 'EXAMINE':     return 'EXAMINE'
    case 'ANALYZE':     return 'ANALYZE'
    case 'SCAN':        return 'SCAN'
    default:            return 'ENTER'
  }
}
