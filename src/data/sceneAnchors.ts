import type { SceneId, TransitionType } from '@/core/navigation/types'

/**
 * Anclajes visuales — cada hotspot corresponde a un elemento real en la imagen de fondo.
 * Coordenadas en % del contenedor (misma transform que SceneWorld).
 */
export interface VisualAnchor {
  id:       string
  element:  string
  top:      number
  left:     number
  /** Área de click en % (puertas, carteles, pantallas) */
  width?:   number
  height?:  number
  /** Click circular en px (huellas, objetos pequeños) */
  hitRadius?: number
}

export interface NavigationAnchor extends VisualAnchor {
  sceneId:          SceneId
  label:            string
  /** Segunda línea de etiqueta contextual (ej. Crime Alley) */
  destinationName:  string
  cursorAction:     'ENTER' | 'ACCESS' | 'OPEN LOCATION' | 'INVESTIGATE' | 'VIEW'
  targetScene:      SceneId
  transitionType:   TransitionType
}

export const navigationAnchors: NavigationAnchor[] = [
  // ── Gotham prologue ───────────────────────────────────────────────────────
  {
    id: 'nav-gotham-fire-escape',
    sceneId: 'gotham-city',
    element: 'Fire escape — alley descent into steam',
    top: 78, left: 14, width: 12, height: 16,
    label: 'ENTER ALLEY',
    destinationName: 'Crime Alley',
    cursorAction: 'ENTER',
    targetScene: 'crime-alley',
    transitionType: 'archive',
  },
  {
    id: 'nav-crime-alley-sign',
    sceneId: 'crime-alley',
    element: 'CRIME ALLEY street sign on iron post',
    top: 42, left: 42, width: 28, height: 11,
    label: 'INVESTIGATE',
    destinationName: 'The Incident',
    cursorAction: 'INVESTIGATE',
    targetScene: 'the-incident',
    transitionType: 'archive',
  },
  {
    id: 'nav-incident-roses',
    sceneId: 'the-incident',
    element: 'Discarded roses on wet pavement',
    top: 88, left: 78, width: 14, height: 10,
    label: 'VIEW ARCHIVE',
    destinationName: 'Gotham Archives',
    cursorAction: 'VIEW',
    targetScene: 'the-archives',
    transitionType: 'memory',
  },
  // ── Batcomputer ───────────────────────────────────────────────────────────
  {
    id: 'nav-batcomputer-control',
    sceneId: 'batcomputer',
    element: 'Central monitor — operations feed',
    top: 48, left: 50, width: 18, height: 14,
    label: 'OPEN CONTROL',
    destinationName: 'Control Center',
    cursorAction: 'ACCESS',
    targetScene: 'batcomputer-control',
    transitionType: 'archive',
  },
  // ── Arkham ───────────────────────────────────────────────────────────────
  {
    id: 'nav-arkham-gates',
    sceneId: 'arkham-entrada',
    element: 'Main iron gates — path to asylum',
    top: 54, left: 50, width: 22, height: 28,
    label: 'ENTER ASYLUM',
    destinationName: 'Arkham Asylum',
    cursorAction: 'ENTER',
    targetScene: 'arkham-fachada',
    transitionType: 'archive',
  },
  {
    id: 'nav-arkham-main-arch',
    sceneId: 'arkham-fachada',
    element: 'Main entrance arch — left facade',
    top: 58, left: 28, width: 14, height: 22,
    label: 'MAIN ENTRANCE',
    destinationName: 'Main Atrium',
    cursorAction: 'ENTER',
    targetScene: 'arkham-atrio',
    transitionType: 'archive',
  },
  {
    id: 'nav-arkham-atrio-gate',
    sceneId: 'arkham-atrio',
    element: 'Iron gate at bottom of atrium',
    top: 74, left: 50, width: 18, height: 16,
    label: 'RECORDS WING',
    destinationName: 'Classified Records',
    cursorAction: 'ENTER',
    targetScene: 'arkham-puertas',
    transitionType: 'archive',
  },
  {
    id: 'nav-arkham-vault-end',
    sceneId: 'arkham-puertas',
    element: 'Door at end of records corridor',
    top: 46, left: 50, width: 10, height: 18,
    label: 'INTENSIVE WING',
    destinationName: 'Intensive Treatment',
    cursorAction: 'ENTER',
    targetScene: 'arkham-intensivo',
    transitionType: 'archive',
  },
  {
    id: 'nav-arkham-wing-door',
    sceneId: 'arkham-intensivo',
    element: 'Security door — end of treatment corridor',
    top: 46, left: 50, width: 10, height: 20,
    label: 'PATIENT DATABASE',
    destinationName: 'Patient Database',
    cursorAction: 'OPEN LOCATION',
    targetScene: 'arkham-lunatico',
    transitionType: 'archive',
  },
  // ── Wayne ────────────────────────────────────────────────────────────────
  {
    id: 'nav-wayne-sign',
    sceneId: 'wayne-exterior',
    element: 'Illuminated WAYNE TOWER sign on facade',
    top: 30, left: 42, width: 14, height: 10,
    label: 'ENTER TOWER',
    destinationName: 'Wayne Tower',
    cursorAction: 'ENTER',
    targetScene: 'wayne-lobby',
    transitionType: 'archive',
  },
  {
    id: 'nav-wayne-lobby-arch',
    sceneId: 'wayne-lobby',
    element: 'Arch behind reception desk — executive access',
    top: 56, left: 50, width: 16, height: 22,
    label: 'EXECUTIVE FLOOR',
    destinationName: 'Executive Operations',
    cursorAction: 'ACCESS',
    targetScene: 'wayne-sala',
    transitionType: 'archive',
  },
  {
    id: 'nav-wayne-staircase',
    sceneId: 'wayne-sala',
    element: 'Grand staircase — upper office level',
    top: 36, left: 86, width: 10, height: 28,
    label: 'PRIVATE OFFICE',
    destinationName: 'Bruce Wayne Office',
    cursorAction: 'ENTER',
    targetScene: 'wayne-despacho',
    transitionType: 'archive',
  },
]

/** Evidencia / UI anclada a objetos visibles */
export const objectAnchors: Record<string, VisualAnchor & { sceneId: SceneId }> = {
  'dm-arkham-breach': {
    id: 'dm-arkham-breach', sceneId: 'arkham-entrada',
    element: 'Damaged lock on right gate pillar',
    top: 58, left: 68, width: 5, height: 7,
  },
  'dm-arkham-transfer': {
    id: 'dm-arkham-transfer', sceneId: 'arkham-fachada',
    element: 'Gate mechanism — right pillar',
    top: 54, left: 68, width: 6, height: 10,
  },
  'dm-arkham-patient-logs': {
    id: 'dm-arkham-patient-logs', sceneId: 'arkham-atrio',
    element: 'Lit cell door — left tier',
    top: 58, left: 22, width: 8, height: 12,
  },
  'dm-arkham-security-access': {
    id: 'dm-arkham-security-access', sceneId: 'arkham-puertas',
    element: 'Key panel on right cell door',
    top: 54, left: 78, width: 7, height: 14,
  },
  'dm-arkham-file-4479': {
    id: 'dm-arkham-file-4479', sceneId: 'arkham-puertas',
    element: 'CELLS A1–A16 wall sign',
    top: 30, left: 10, width: 10, height: 8,
  },
  'dm-arkham-crane-notes': {
    id: 'dm-arkham-crane-notes', sceneId: 'arkham-puertas',
    element: 'End corridor door',
    top: 44, left: 50, width: 8, height: 16,
  },
  'dm-arkham-ventilation': {
    id: 'dm-arkham-ventilation', sceneId: 'arkham-puertas',
    element: 'Floor grate — left corridor',
    top: 78, left: 14, width: 8, height: 6,
  },
  'dm-arkham-escape-pattern': {
    id: 'dm-arkham-escape-pattern', sceneId: 'arkham-puertas',
    element: 'Wet floor reflection — center path',
    top: 82, left: 50, width: 12, height: 6,
  },
  'dm-arkham-medical-corrupt': {
    id: 'dm-arkham-medical-corrupt', sceneId: 'arkham-intensivo',
    element: 'Barred window — right wing corridor',
    top: 44, left: 72, width: 6, height: 10,
  },
  'dm-arkham-unknown-subject': {
    id: 'dm-arkham-unknown-subject', sceneId: 'arkham-lunatico',
    element: 'Silhouette at end of ward corridor',
    top: 32, left: 62, width: 6, height: 14,
  },
  'dm-wayne-division': {
    id: 'dm-wayne-division', sceneId: 'wayne-exterior',
    element: 'Lit window band on Wayne Tower',
    top: 44, left: 40, width: 6, height: 10,
  },
  'dm-wayne-clearance': {
    id: 'dm-wayne-clearance', sceneId: 'wayne-lobby',
    element: 'Wayne Enterprises logo — back wall',
    top: 38, left: 50, width: 14, height: 10,
  },
  'dm-wayne-research': {
    id: 'dm-wayne-research', sceneId: 'wayne-sala',
    element: 'Laptop on executive desk',
    top: 58, left: 48, width: 10, height: 6,
  },
  'dm-wayne-terminal': {
    id: 'dm-wayne-terminal', sceneId: 'wayne-despacho',
    element: 'Open laptop on desk',
    top: 54, left: 48, width: 12, height: 8,
  },
  'dm-wayne-financial': {
    id: 'dm-wayne-financial', sceneId: 'wayne-despacho',
    element: 'Documents left of laptop',
    top: 56, left: 36, width: 8, height: 6,
  },
  'dm-wayne-contract': {
    id: 'dm-wayne-contract', sceneId: 'wayne-despacho',
    element: 'Bar cart decanters — right side',
    top: 58, left: 78, width: 8, height: 10,
  },
  'dm-wayne-autopsy': {
    id: 'dm-wayne-autopsy', sceneId: 'wayne-despacho',
    element: 'Framed photo on left cabinet',
    top: 48, left: 20, width: 6, height: 8,
  },
  'dm-wayne-surveillance': {
    id: 'dm-wayne-surveillance', sceneId: 'wayne-despacho',
    element: 'Wayne Tower visible through window',
    top: 32, left: 38, width: 10, height: 8,
  },
  'batcomputer-laptop': {
    id: 'batcomputer-laptop', sceneId: 'wayne-despacho',
    element: 'Laptop — Batcomputer uplink',
    top: 54, left: 48, width: 12, height: 8,
  },
  // ── Crime Alley investigation ─────────────────────────────────────────────
  'broken-camera': {
    id: 'broken-camera', sceneId: 'crime-alley-investigation',
    element: 'Wall-mounted security camera',
    top: 38, left: 12, width: 8, height: 10,
  },
  'witness-report': {
    id: 'witness-report', sceneId: 'crime-alley-investigation',
    element: 'Papers scattered on alley floor',
    top: 62, left: 28, width: 8, height: 6,
  },
  'rose-fragment': {
    id: 'rose-fragment', sceneId: 'crime-alley-investigation',
    element: 'Dried rose petal on pavement',
    top: 78, left: 52, width: 6, height: 5,
  },
  'anonymous-letter': {
    id: 'anonymous-letter', sceneId: 'crime-alley-investigation',
    element: 'Mailbox slot on building facade',
    top: 48, left: 72, width: 7, height: 9,
  },
  // ── The Narrows investigation ─────────────────────────────────────────────
  'narrows-toxin-report': {
    id: 'narrows-toxin-report', sceneId: 'narrows-investigation',
    element: 'Clinic window — sealed report',
    top: 32, left: 18, width: 8, height: 10,
  },
  'narrows-water-map': {
    id: 'narrows-water-map', sceneId: 'narrows-investigation',
    element: 'Utility access panel — annotated map',
    top: 58, left: 42, width: 10, height: 8,
  },
  'narrows-memo': {
    id: 'narrows-memo', sceneId: 'narrows-investigation',
    element: 'GCPD memo pinned to wall',
    top: 44, left: 68, width: 8, height: 9,
  },
  'narrows-informant': {
    id: 'narrows-informant', sceneId: 'narrows-investigation',
    element: 'Back alley dossier — wet pavement',
    top: 72, left: 24, width: 8, height: 6,
  },
  'narrows-media-order': {
    id: 'narrows-media-order', sceneId: 'narrows-investigation',
    element: 'Newsstand — suppressed headline',
    top: 38, left: 82, width: 9, height: 10,
  },
  'dm-bat-signal-grid': {
    id: 'dm-bat-signal-grid', sceneId: 'batcomputer',
    element: 'Center hub display — signal grid',
    top: 35, left: 50, width: 12, height: 10,
  },
  'dm-bat-case-link': {
    id: 'dm-bat-case-link', sceneId: 'batcomputer',
    element: 'Left display — case linkage',
    top: 55, left: 30, width: 10, height: 9,
  },
  'dm-bat-wayne-audit': {
    id: 'dm-bat-wayne-audit', sceneId: 'batcomputer',
    element: 'Right display — Wayne audit',
    top: 60, left: 70, width: 10, height: 9,
  },
  'dm-bat-thermal-map': {
    id: 'dm-bat-thermal-map', sceneId: 'batcomputer-control',
    element: 'Main screen — thermal map',
    top: 40, left: 45, width: 14, height: 12,
  },
  'dm-bat-arkham-feed': {
    id: 'dm-bat-arkham-feed', sceneId: 'batcomputer-control',
    element: 'Side monitor — Arkham feed',
    top: 65, left: 20, width: 10, height: 9,
  },
  'dm-bat-gcpd-intercept': {
    id: 'dm-bat-gcpd-intercept', sceneId: 'batcomputer-control',
    element: 'Comms panel — GCPD intercept',
    top: 30, left: 75, width: 10, height: 8,
  },
  'dm-bat-network-core': {
    id: 'dm-bat-network-core', sceneId: 'batcomputer-control',
    element: 'Core analysis display',
    top: 50, left: 50, width: 12, height: 10,
  },
}

export const getNavigationForScene = (sceneId: string) =>
  navigationAnchors.filter(a => a.sceneId === sceneId)

export const getObjectAnchor = (id: string) => objectAnchors[id]

export const getObjectAnchorsForScene = (sceneId: string) =>
  Object.values(objectAnchors).filter(a => a.sceneId === sceneId)

/** Convierte anclaje a área hotspot para scenes.ts (compatibilidad) */
export function anchorToHotspotArea(a: VisualAnchor) {
  const w = a.width ?? 8
  const h = a.height ?? 8
  return {
    top:    a.top - h / 2,
    left:   a.left - w / 2,
    width:  w,
    height: h,
  }
}
