import type { SceneId } from '@/core/navigation/types'

/** Etiquetas reveladas por SCAN (no necesariamente evidencia coleccionable) */
export interface DetectiveScanClue {
  sceneId: SceneId
  lines:   string[]
  top:     number
  left:    number
}

export const detectiveScanClues: DetectiveScanClue[] = [
  { sceneId: 'arkham-entrada',    lines: ['SECURITY BREACH', 'DETECTED 17 DAYS AGO'],           top: 38, left: 55 },
  { sceneId: 'arkham-fachada',    lines: ['UNAUTHORIZED TRANSFER ROUTE'],                      top: 42, left: 48 },
  { sceneId: 'arkham-atrio',      lines: ['PATIENT MOVEMENT LOGS'],                            top: 50, left: 40 },
  { sceneId: 'arkham-puertas',    lines: ['RESTRICTED SECURITY ACCESS'],                     top: 45, left: 60 },
  { sceneId: 'arkham-intensivo',  lines: ['MEDICAL RECORDS CORRUPTED'],                        top: 48, left: 42 },
  { sceneId: 'arkham-lunatico',   lines: ['UNKNOWN SUBJECT', 'THREAT LEVEL: EXTREME'],         top: 44, left: 52 },
  { sceneId: 'wayne-exterior',    lines: ['ENCRYPTED CORPORATE DIVISION'],                     top: 36, left: 50 },
  { sceneId: 'wayne-lobby',       lines: ['EXECUTIVE CLEARANCE REQUIRED'],                     top: 46, left: 65 },
  { sceneId: 'wayne-sala',        lines: ['PRIVATE RESEARCH PROJECT'],                         top: 42, left: 38 },
  { sceneId: 'wayne-despacho',    lines: ['ACCESS TERMINAL LOCATED'],                          top: 50, left: 42 },
  { sceneId: 'gotham-city',       lines: ['CITY SURVEILLANCE NODE'],                           top: 40, left: 50 },
  { sceneId: 'crime-alley',       lines: ['INCIDENT SITE — ACTIVE'],                           top: 45, left: 45 },
  { sceneId: 'batcomputer',       lines: ['NETWORK CORE — ONLINE'],                            top: 35, left: 50 },
  { sceneId: 'batcomputer-control', lines: ['GOTHAM GRID — FULL COVERAGE'],                  top: 48, left: 50 },
]

export const getScanCluesForScene = (sceneId: string) =>
  detectiveScanClues.filter(c => c.sceneId === sceneId)
