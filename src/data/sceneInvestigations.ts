import type { SceneId } from '@/core/navigation/types'

export type TrailMarkerType =
  | 'footprint'
  | 'tire'
  | 'trajectory'
  | 'movement'
  | 'access'
  | 'document'
  | 'biometric'
  | 'threat'
  | 'surveillance'
  | 'medical'

export type InvestigationCaseId = 'arkham' | 'wayne' | 'main'

export interface TrailStep {
  id:       string
  order:    number
  top:      number
  left:     number
  type:     TrailMarkerType
  hint?:    string
  /** Elemento visual en la imagen */
  element?: string
  /** 'scan' = visible after scan analysis; step id = after visiting that step */
  requires?: 'scan' | string
  /** Optional mid-trail evidence */
  unlockEvidenceId?: string
}

export interface SceneInvestigation {
  id:                 string
  title:              string
  sceneId:            SceneId
  caseId:             InvestigationCaseId
  objective:          string
  hypothesis:         string
  scanAnalysisLines:  string[]
  trail:              TrailStep[]
  evidenceId:         string
  /** Scene needs scan before trail begins (intensivo) */
  requiresScanFirst?: boolean
  /** Reveals batcomputer access instead of only evidence */
  revealsBatcomputerAccess?: boolean
}

export const sceneInvestigations: SceneInvestigation[] = [
  {
    id: 'inv-arkham-breach',
    title: 'Security Breach Investigation',
    sceneId: 'arkham-entrada',
    caseId: 'arkham',
    objective: 'Investigate Security Breach',
    hypothesis: 'Perimeter failure — unauthorized entry before dawn. No response team dispatched.',
    scanAnalysisLines: [
      'ANALYZING PERIMETER…',
      'FOOTPRINT PATTERN DETECTED',
      'FORCED ENTRY TRAJECTORY CONFIRMED',
    ],
    evidenceId: 'dm-arkham-breach',
    trail: [
      { id: 's1', order: 0, top: 68, left: 48, type: 'footprint', element: 'Mud trace on wet path', hint: 'MUD TRACE' },
      { id: 's2', order: 1, top: 62, left: 52, type: 'footprint', element: 'Gate threshold marks', hint: 'WEIGHT SHIFT', requires: 's1' },
      { id: 's3', order: 2, top: 56, left: 56, type: 'trajectory', element: 'Right gate pillar — forced entry', hint: 'ENTRY VECTOR', requires: 's2' },
      { id: 's4', order: 3, top: 56, left: 58, type: 'document', element: 'Damaged lock on gate', hint: 'BREACH LOG', requires: 's3' },
    ],
  },
  {
    id: 'inv-arkham-transfer',
    title: 'Transfer Route Investigation',
    sceneId: 'arkham-fachada',
    caseId: 'arkham',
    objective: 'Reconstruct Transfer Route',
    hypothesis: 'Unauthorized cargo path bypassing main gate — vehicle exited east perimeter.',
    scanAnalysisLines: [
      'SCANNING GATE APPROACH…',
      'TIRE IMPRESSIONS MATCH',
      'OFF-BOOKS ROUTE IDENTIFIED',
    ],
    evidenceId: 'dm-arkham-transfer',
    trail: [
      { id: 's1', order: 0, top: 84, left: 46, type: 'tire', element: 'Tire impressions on ground', hint: 'TIRE TRACK' },
      { id: 's2', order: 1, top: 58, left: 28, type: 'footprint', element: 'Main entrance arch', hint: 'LOADER FOOTPRINTS', requires: 's1' },
      { id: 's3', order: 2, top: 52, left: 50, type: 'trajectory', element: 'Center gate mechanism', hint: 'EXIT PATH', requires: 's2' },
      { id: 's4', order: 3, top: 52, left: 50, type: 'document', element: 'Gate lock panel', hint: 'TRANSFER MANIFEST', requires: 's3' },
    ],
  },
  {
    id: 'inv-arkham-movement',
    title: 'Patient Movement Analysis',
    sceneId: 'arkham-atrio',
    caseId: 'arkham',
    objective: 'Analyze Patient Records',
    hypothesis: 'Night transfers without escort — patients moved through main atrium off-schedule.',
    scanAnalysisLines: [
      'PATIENT FLOW ANALYSIS…',
      'IRREGULAR MOVEMENT DETECTED',
      'ESCORT SIGNATURES ABSENT',
    ],
    evidenceId: 'dm-arkham-patient-logs',
    trail: [
      { id: 's1', order: 0, top: 78, left: 50, type: 'movement', element: 'Wet floor — wheelchair track', hint: 'WHEELCHAIR TRACK' },
      { id: 's2', order: 1, top: 68, left: 28, type: 'footprint', element: 'Left staircase', hint: 'STAFF ROUTE', requires: 's1' },
      { id: 's3', order: 2, top: 58, left: 22, type: 'access', element: 'Lit cell door — left tier', hint: 'WING ACCESS', requires: 's2' },
      { id: 's4', order: 3, top: 58, left: 22, type: 'document', element: 'Cell door access panel', hint: 'MOVEMENT LOG', requires: 's3' },
    ],
  },
  {
    id: 'inv-arkham-puertas',
    title: 'Classified Records Investigation',
    sceneId: 'arkham-puertas',
    caseId: 'arkham',
    objective: 'Analyze Classified Vault Records',
    hypothesis: 'Vault credentials duplicated — multiple restricted files accessed same night.',
    scanAnalysisLines: [
      'VAULT SCAN ACTIVE…',
      'KEY CARD CLONED',
      'PATIENT FILE 4479 FLAGGED',
    ],
    evidenceId: 'dm-arkham-security-access',
    trail: [
      { id: 's1', order: 0, top: 78, left: 14, type: 'access', element: 'Floor grate — left corridor', hint: 'VENT ACCESS' },
      { id: 's2', order: 1, top: 82, left: 50, type: 'footprint', element: 'Wet floor reflection', hint: 'DUST DISTURBANCE', requires: 's1', unlockEvidenceId: 'dm-arkham-ventilation' },
      { id: 's3', order: 2, top: 54, left: 78, type: 'document', element: 'Key panel — right cell door', hint: 'ACCESS KEY', requires: 's2' },
      { id: 's4', order: 3, top: 30, left: 10, type: 'document', element: 'CELLS A1–A16 wall sign', hint: 'FILE 4479', requires: 's3', unlockEvidenceId: 'dm-arkham-file-4479' },
      { id: 's5', order: 4, top: 46, left: 50, type: 'trajectory', element: 'End corridor door', hint: 'ESCAPE PATTERN', requires: 's4', unlockEvidenceId: 'dm-arkham-escape-pattern' },
      { id: 's5b', order: 5, top: 46, left: 50, type: 'document', element: 'End corridor door — hidden notes', hint: 'CRANE NOTES', requires: 's5', unlockEvidenceId: 'dm-arkham-crane-notes' },
    ],
  },
  {
    id: 'inv-arkham-medical',
    title: 'Restricted Medical Records',
    sceneId: 'arkham-intensivo',
    caseId: 'arkham',
    objective: 'Analyze Wing B Medical Data',
    hypothesis: 'Wing B records partially erased post-1989 — experimental treatment off-books.',
    requiresScanFirst: true,
    scanAnalysisLines: [
      'MEDICAL DATABASE SCAN…',
      'CORRUPTED SECTORS FOUND',
      'RESTRICTED WING B ACCESS',
    ],
    evidenceId: 'dm-arkham-medical-corrupt',
    trail: [
      { id: 's1', order: 0, top: 48, left: 38, type: 'medical', element: 'Barred window — treatment door', hint: 'ERASED SECTOR', requires: 'scan' },
      { id: 's2', order: 1, top: 52, left: 38, type: 'document', element: 'Treatment door handle', hint: 'TREATMENT LOG', requires: 's1' },
      { id: 's3', order: 2, top: 22, left: 18, type: 'access', element: 'INTENSIVE TREATMENT wall sign', hint: 'RESTRICTED FILE', requires: 's2' },
    ],
  },
  {
    id: 'inv-arkham-unknown',
    title: 'Unknown Subject Investigation',
    sceneId: 'arkham-lunatico',
    caseId: 'arkham',
    objective: 'Identify Unknown Subject',
    hypothesis: 'Threat designation EXTREME — identity sealed. Biometric match inconclusive.',
    scanAnalysisLines: [
      'SECURE DATABASE BREACH SCAN…',
      'EXTREME THREAT SIGNATURE',
      'BIOMETRIC ANOMALY DETECTED',
    ],
    evidenceId: 'dm-arkham-unknown-subject',
    trail: [
      { id: 's1', order: 0, top: 32, left: 22, type: 'threat', element: 'WARD C ROOM 9 sign', hint: 'THREAT MARKER' },
      { id: 's2', order: 1, top: 32, left: 78, type: 'biometric', element: 'WARD C ROOM 10 sign', hint: 'BIOMETRIC SCAN', requires: 's1' },
      { id: 's3', order: 2, top: 40, left: 50, type: 'document', element: 'Figure at corridor end', hint: 'SEALED FILE', requires: 's2' },
      { id: 's4', order: 3, top: 40, left: 50, type: 'threat', element: 'End corridor — subject profile', hint: 'SUBJECT PROFILE', requires: 's3' },
    ],
  },
  {
    id: 'inv-wayne-surveillance',
    title: 'Corporate Surveillance Investigation',
    sceneId: 'wayne-exterior',
    caseId: 'wayne',
    objective: 'Locate Hidden Divisions',
    hypothesis: 'Off-books R&D unit detected — budget untraceable on exterior grid.',
    scanAnalysisLines: [
      'FACADE SCAN…',
      'RESTRICTED FLOOR SIGNATURE',
      'SURVEILLANCE GRID ACTIVE',
    ],
    evidenceId: 'dm-wayne-division',
    trail: [
      { id: 's1', order: 0, top: 44, left: 40, type: 'surveillance', element: 'Lit window band on tower', hint: 'CAMERA BLIND' },
      { id: 's2', order: 1, top: 30, left: 42, type: 'access', element: 'WAYNE TOWER illuminated sign', hint: 'RESTRICTED ACCESS', requires: 's1' },
      { id: 's3', order: 2, top: 44, left: 40, type: 'document', element: 'Tower facade window row', hint: 'DIVISION LEDGER', requires: 's2' },
    ],
  },
  {
    id: 'inv-wayne-executive',
    title: 'Executive Access Investigation',
    sceneId: 'wayne-lobby',
    caseId: 'wayne',
    objective: 'Trace Executive Clearance',
    hypothesis: 'Floor 38+ requires board authorization — credentials cloned at lobby terminal.',
    scanAnalysisLines: [
      'LOBBY SECURITY SCAN…',
      'EXECUTIVE BADGE CLONED',
      'ELEVATOR ACCESS LOGGED',
    ],
    evidenceId: 'dm-wayne-clearance',
    trail: [
      { id: 's1', order: 0, top: 38, left: 50, type: 'access', element: 'Wayne Enterprises logo — back wall', hint: 'BADGE READER' },
      { id: 's2', order: 1, top: 56, left: 50, type: 'footprint', element: 'Reception desk arch', hint: 'EXECUTIVE ROUTE', requires: 's1' },
      { id: 's3', order: 2, top: 56, left: 50, type: 'document', element: 'Executive archway', hint: 'CLEARANCE LOG', requires: 's2' },
    ],
  },
  {
    id: 'inv-wayne-research',
    title: 'Research Division Investigation',
    sceneId: 'wayne-sala',
    caseId: 'wayne',
    objective: 'Uncover Research Division',
    hypothesis: 'Codename EYES OF GOTHAM — classified project on executive floor.',
    scanAnalysisLines: [
      'EXECUTIVE FLOOR SCAN…',
      'CLASSIFIED PROJECT DETECTED',
      'HIDDEN ARCHIVES LOCATED',
    ],
    evidenceId: 'dm-wayne-research',
    trail: [
      { id: 's1', order: 0, top: 58, left: 48, type: 'document', element: 'Laptop on executive desk', hint: 'PROJECT BRIEF' },
      { id: 's2', order: 1, top: 38, left: 40, type: 'access', element: 'Martha Wayne portrait', hint: 'SECURE CABINET', requires: 's1' },
      { id: 's3', order: 2, top: 28, left: 50, type: 'document', element: 'Wayne W logo — back wall', hint: 'EYES OF GOTHAM', requires: 's2' },
    ],
  },
  {
    id: 'inv-wayne-hidden-access',
    title: 'Hidden Access Investigation',
    sceneId: 'wayne-despacho',
    caseId: 'wayne',
    objective: 'Locate Hidden Access Point',
    revealsBatcomputerAccess: true,
    hypothesis: 'Secure uplink to Wayne Network — Batcomputer access point behind executive desk.',
    scanAnalysisLines: [
      'SCANNING OFFICE…',
      'ENCRYPTED UPLINK DETECTED',
      'BATCOMPUTER ACCESS IDENTIFIED',
    ],
    evidenceId: 'dm-wayne-terminal',
    trail: [
      { id: 's1', order: 0, top: 56, left: 36, type: 'document', element: 'Documents left of laptop', hint: 'FINANCIAL LEDGER' },
      { id: 's2', order: 1, top: 48, left: 20, type: 'surveillance', element: 'Framed photo on cabinet', hint: 'HIDDEN LENS', requires: 's1', unlockEvidenceId: 'dm-wayne-financial' },
      { id: 's3', order: 2, top: 54, left: 48, type: 'access', element: 'Open laptop on desk', hint: 'DESK PANEL', requires: 's2' },
      { id: 's4', order: 3, top: 54, left: 48, type: 'access', element: 'Laptop — network uplink', hint: 'NETWORK UPLINK', requires: 's3' },
    ],
  },
]

export const getInvestigationByScene = (sceneId: string): SceneInvestigation | undefined =>
  sceneInvestigations.find(i => i.sceneId === sceneId)

export const getInvestigationById = (id: string): SceneInvestigation | undefined =>
  sceneInvestigations.find(i => i.id === id)

export const getInvestigationsByCase = (caseId: InvestigationCaseId) =>
  sceneInvestigations.filter(i => i.caseId === caseId)
