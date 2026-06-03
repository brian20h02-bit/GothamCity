/** Orden global de capas (mayor = encima) */
export const Z_INDEX = {
  SCENE:              10,
  FOG:                12,
  ATMOSPHERE:         14,
  WET_GLASS:          18,
  DETECTIVE_MODE:     4500,
  DETECTIVE_SCAN:     4600,
  DETECTIVE_SCAN_UI:  5200,
  INVESTIGATION_HUD:  500,
  DETECTIVE_HUD:      600,
  SCENE_HUD:          500,
  GO_BACK:            550, // legacy — usar NAVIGATION_HUD
  ARCHIVE_TRANSITION: 9000,
  EVIDENCE_OVERLAY:   8500,
  NAVIGATION_HUD:     9700,
  DEBUG_HUD:          10000,
  CURSOR:             9999,
} as const
