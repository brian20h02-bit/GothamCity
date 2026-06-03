import type { SceneId } from '@/core/navigation/types'
import { getObjectAnchor } from '@/data/sceneAnchors'

export type EvidenceClassification = 'ALPHA' | 'BETA' | 'GAMMA' | 'OMEGA' | 'RESTRICTED'
export type EvidenceRegion = 'crime-alley' | 'arkham' | 'wayne' | 'narrows' | 'batcomputer'
export type CaseFileId =
  | 'crime-alley-inv'
  | 'arkham-inv'
  | 'wayne-tower-inv'
  | 'narrows-inv'
  | 'batcomputer-inv'

export interface DetectiveEvidence {
  id:             string
  title:          string
  description:    string
  detail?:        string
  location:       string
  sceneId:        SceneId
  classification: EvidenceClassification
  region:         EvidenceRegion
  caseFileId:     CaseFileId
  top:            number
  left:           number
}

function pos(id: string, fallback: { top: number; left: number }) {
  const a = getObjectAnchor(id)
  return a ? { top: a.top, left: a.left } : fallback
}

const crimeAlley: DetectiveEvidence[] = [
  { id: 'broken-camera',    title: 'BROKEN CAMERA',     description: 'Security camera. Lens shattered. Recording corrupted.', location: 'PARK ROW — ALLEY ENTRANCE', sceneId: 'crime-alley-investigation', classification: 'BETA',       region: 'crime-alley', caseFileId: 'crime-alley-inv', ...pos('broken-camera', { top: 38, left: 12 }), detail: 'GCPD surveillance unit found smashed at the alley entrance. Last recorded timestamp: 22:47. Data irretrievable.' },
  { id: 'witness-report',   title: 'WITNESS REPORT',    description: 'Handwritten. Unsigned. Filed anonymously.',           location: 'PARK ROW — ALLEY FLOOR',    sceneId: 'crime-alley-investigation', classification: 'GAMMA',      region: 'crime-alley', caseFileId: 'crime-alley-inv', ...pos('witness-report', { top: 62, left: 28 }), detail: '"He didn\'t run. He just… watched." Single page. No follow-up investigation authorized.' },
  { id: 'rose-fragment',    title: 'ROSE FRAGMENT',     description: 'Single petal. Dried. Left at the scene annually.',      location: 'PARK ROW — PAVEMENT',       sceneId: 'crime-alley-investigation', classification: 'ALPHA',      region: 'crime-alley', caseFileId: 'crime-alley-inv', ...pos('rose-fragment', { top: 78, left: 52 }), detail: 'Left at the exact location every November 5th since 1981. No prints. No DNA.' },
  { id: 'anonymous-letter', title: 'ANONYMOUS LETTER',  description: 'Typed. No return address. Mailed the day after.',     location: 'PARK ROW — MAILBOX',        sceneId: 'crime-alley-investigation', classification: 'RESTRICTED', region: 'crime-alley', caseFileId: 'crime-alley-inv', ...pos('anonymous-letter', { top: 48, left: 72 }), detail: '"They will not be forgotten." Postmarked East End. Recipient: Commissioner Gordon.' },
]

const arkham: DetectiveEvidence[] = [
  { id: 'dm-arkham-breach',          title: 'SECURITY BREACH LOG',     description: 'Perimeter failure logged. No response team dispatched.', location: 'ARKHAM — PERIMETER',        sceneId: 'arkham-entrada',    classification: 'RESTRICTED', region: 'arkham', caseFileId: 'arkham-inv', ...pos('dm-arkham-breach', { top: 56, left: 58 }) },
  { id: 'dm-arkham-transfer',        title: 'TRANSFER ROUTE',          description: 'Unauthorized cargo path bypassing main gate.',             location: 'ARKHAM — MAIN GATE',        sceneId: 'arkham-fachada',    classification: 'BETA',       region: 'arkham', caseFileId: 'arkham-inv', ...pos('dm-arkham-transfer', { top: 52, left: 50 }) },
  { id: 'dm-arkham-patient-logs',    title: 'PATIENT MOVEMENT LOGS',   description: 'Night transfers without escort signatures.',               location: 'ARKHAM — ATRIUM',           sceneId: 'arkham-atrio',      classification: 'BETA',       region: 'arkham', caseFileId: 'arkham-inv', ...pos('dm-arkham-patient-logs', { top: 58, left: 22 }) },
  { id: 'dm-arkham-security-access', title: 'RESTRICTED ACCESS KEY',   description: 'Level II vault credentials — duplicated.',                 location: 'ARKHAM — RECORDS VAULT',    sceneId: 'arkham-puertas',    classification: 'ALPHA',      region: 'arkham', caseFileId: 'arkham-inv', ...pos('dm-arkham-security-access', { top: 54, left: 78 }) },
  { id: 'dm-arkham-file-4479',       title: 'PATIENT FILE 4479',       description: 'Identity withheld. Crane annotations present.',            location: 'ARKHAM — RECORDS VAULT',    sceneId: 'arkham-puertas',    classification: 'OMEGA',      region: 'arkham', caseFileId: 'arkham-inv', ...pos('dm-arkham-file-4479', { top: 30, left: 10 }) },
  { id: 'dm-arkham-crane-notes',     title: 'CRANE RESEARCH NOTES',    description: 'Aerosol compound trials — board approval bypassed.',       location: 'ARKHAM — RECORDS VAULT',    sceneId: 'arkham-puertas',    classification: 'RESTRICTED', region: 'arkham', caseFileId: 'arkham-inv', ...pos('dm-arkham-crane-notes', { top: 46, left: 50 }) },
  { id: 'dm-arkham-ventilation',     title: 'VENTILATION SAMPLE',      description: 'Fear-response agent recovered from sub-basement.',         location: 'ARKHAM — RECORDS VAULT',    sceneId: 'arkham-puertas',    classification: 'GAMMA',      region: 'arkham', caseFileId: 'arkham-inv', ...pos('dm-arkham-ventilation', { top: 78, left: 14 }) },
  { id: 'dm-arkham-escape-pattern',  title: 'ESCAPE PATTERN',          description: '14 breaches. Common factor: sub-basement level.',          location: 'ARKHAM — RECORDS VAULT',    sceneId: 'arkham-puertas',    classification: 'ALPHA',      region: 'arkham', caseFileId: 'arkham-inv', ...pos('dm-arkham-escape-pattern', { top: 82, left: 50 }) },
  { id: 'dm-arkham-medical-corrupt', title: 'CORRUPTED MEDICAL DATA',  description: 'Wing B records partially erased post-1989.',               location: 'ARKHAM — INTENSIVE WING',   sceneId: 'arkham-intensivo',  classification: 'RESTRICTED', region: 'arkham', caseFileId: 'arkham-inv', ...pos('dm-arkham-medical-corrupt', { top: 48, left: 38 }) },
  { id: 'dm-arkham-unknown-subject', title: 'UNKNOWN SUBJECT',         description: 'Threat designation: EXTREME. File sealed.',                location: 'ARKHAM — SECURE DATABASE',  sceneId: 'arkham-lunatico',   classification: 'OMEGA',      region: 'arkham', caseFileId: 'arkham-inv', ...pos('dm-arkham-unknown-subject', { top: 40, left: 50 }) },
]

const wayne: DetectiveEvidence[] = [
  { id: 'dm-wayne-division',    title: 'ENCRYPTED DIVISION',      description: 'Off-books R&D unit. Budget untraceable.',              location: 'WAYNE TOWER — EXTERIOR',  sceneId: 'wayne-exterior', classification: 'RESTRICTED', region: 'wayne', caseFileId: 'wayne-tower-inv', ...pos('dm-wayne-division', { top: 44, left: 40 }) },
  { id: 'dm-wayne-clearance',   title: 'EXECUTIVE CLEARANCE',     description: 'Floor 38+ requires board-level authorization.',        location: 'WAYNE TOWER — LOBBY',     sceneId: 'wayne-lobby',    classification: 'BETA',       region: 'wayne', caseFileId: 'wayne-tower-inv', ...pos('dm-wayne-clearance', { top: 38, left: 50 }) },
  { id: 'dm-wayne-research',    title: 'PRIVATE RESEARCH PROJECT', description: 'Codename: EYES OF GOTHAM. Status classified.',          location: 'WAYNE TOWER — FLOOR 38',  sceneId: 'wayne-sala',     classification: 'ALPHA',      region: 'wayne', caseFileId: 'wayne-tower-inv', ...pos('dm-wayne-research', { top: 58, left: 48 }) },
  { id: 'dm-wayne-terminal',    title: 'ACCESS TERMINAL',         description: 'Secure uplink to Wayne Network detected.',             location: 'WAYNE TOWER — FLOOR 42',  sceneId: 'wayne-despacho', classification: 'BETA',       region: 'wayne', caseFileId: 'wayne-tower-inv', ...pos('dm-wayne-terminal', { top: 54, left: 48 }) },
  { id: 'dm-wayne-financial',   title: 'FINANCIAL RECORD',        description: '$48M offshore transfers. Signatory: B. Wayne.',        location: 'WAYNE TOWER — FLOOR 42',  sceneId: 'wayne-despacho', classification: 'RESTRICTED', region: 'wayne', caseFileId: 'wayne-tower-inv', ...pos('dm-wayne-financial', { top: 56, left: 36 }) },
  { id: 'dm-wayne-contract',    title: 'ARMS CONTRACT',           description: 'Military-grade sonar tech. Buyer redacted.',            location: 'WAYNE TOWER — FLOOR 42',  sceneId: 'wayne-despacho', classification: 'GAMMA',      region: 'wayne', caseFileId: 'wayne-tower-inv', ...pos('dm-wayne-contract', { top: 58, left: 78 }) },
  { id: 'dm-wayne-autopsy',     title: 'AUTOPSY DISCREPANCY',     description: 'Ballistic trajectory inconsistent with official report.', location: 'WAYNE TOWER — FLOOR 42', sceneId: 'wayne-despacho', classification: 'OMEGA',      region: 'wayne', caseFileId: 'wayne-tower-inv', ...pos('dm-wayne-autopsy', { top: 48, left: 20 }) },
  { id: 'dm-wayne-surveillance', title: 'SURVEILLANCE PHOTO',     description: 'Unknown vehicle at Wayne Manor. Nov 4, 1981.',           location: 'WAYNE TOWER — FLOOR 42',  sceneId: 'wayne-despacho', classification: 'ALPHA',      region: 'wayne', caseFileId: 'wayne-tower-inv', ...pos('dm-wayne-surveillance', { top: 32, left: 38 }) },
]

const narrows: DetectiveEvidence[] = [
  { id: 'narrows-toxin-report',  title: 'TOXIN REPORT',            description: 'Mass hallucination event. Covered up.',       location: 'THE NARROWS — CLINIC',      sceneId: 'narrows-investigation', classification: 'RESTRICTED', region: 'narrows', caseFileId: 'narrows-inv', ...pos('narrows-toxin-report', { top: 32, left: 18 }), detail: 'City health bureau sealed the report within 48 hours. Agent origin: unknown.' },
  { id: 'narrows-water-map',     title: 'WATER MAIN ACCESS MAP',   description: 'Infrastructure points marked by hand.',       location: 'THE NARROWS — UTILITY',     sceneId: 'narrows-investigation', classification: 'BETA',       region: 'narrows', caseFileId: 'narrows-inv', ...pos('narrows-water-map', { top: 58, left: 42 }), detail: 'Hand-annotated map showing bypass routes into lower Gotham water grid.' },
  { id: 'narrows-memo',          title: 'GCPD INTERNAL MEMO',      description: 'Evacuation plan. Never executed.',            location: 'THE NARROWS — PRECINCT',    sceneId: 'narrows-investigation', classification: 'GAMMA',      region: 'narrows', caseFileId: 'narrows-inv', ...pos('narrows-memo', { top: 44, left: 68 }), detail: 'Draft evacuation order for Sector 7. Timestamp: 03:14. No deployment logged.' },
  { id: 'narrows-informant',     title: 'INFORMANT DOSSIER',       description: 'Handler: unknown. Status: missing.',          location: 'THE NARROWS — BACK ALLEY',  sceneId: 'narrows-investigation', classification: 'ALPHA',      region: 'narrows', caseFileId: 'narrows-inv', ...pos('narrows-informant', { top: 72, left: 24 }), detail: 'Asset codename RED FINCH. Last contact: 11 days ago. Handler signature redacted.' },
  { id: 'narrows-media-order',   title: 'MEDIA SUPPRESSION ORDER', description: 'Signed by the mayor. Date redacted.',         location: 'THE NARROWS — NEWSSTAND',   sceneId: 'narrows-investigation', classification: 'OMEGA',      region: 'narrows', caseFileId: 'narrows-inv', ...pos('narrows-media-order', { top: 38, left: 82 }), detail: 'All broadcast footage from the incident ordered destroyed under executive privilege.' },
]

const batcomputer: DetectiveEvidence[] = [
  { id: 'dm-bat-signal-grid',    title: 'GOTHAM SIGNAL GRID',      description: 'City-wide surveillance mesh — partial coverage.',       location: 'BATCAVE — HUB',           sceneId: 'batcomputer',         classification: 'BETA',       region: 'batcomputer', caseFileId: 'batcomputer-inv', ...pos('dm-bat-signal-grid', { top: 35, left: 50 }) },
  { id: 'dm-bat-case-link',      title: 'CASE FILE LINKAGE',       description: 'Crime Alley incident connected to Arkham transfer.',     location: 'BATCAVE — HUB',           sceneId: 'batcomputer',         classification: 'ALPHA',      region: 'batcomputer', caseFileId: 'batcomputer-inv', ...pos('dm-bat-case-link', { top: 55, left: 30 }) },
  { id: 'dm-bat-wayne-audit',    title: 'WAYNE AUDIT TRAIL',       description: 'Prototype inventory gaps flagged since 1989.',         location: 'BATCAVE — HUB',           sceneId: 'batcomputer',         classification: 'RESTRICTED', region: 'batcomputer', caseFileId: 'batcomputer-inv', ...pos('dm-bat-wayne-audit', { top: 60, left: 70 }) },
  { id: 'dm-bat-thermal-map',    title: 'THERMAL CITY MAP',        description: 'Anomaly clusters in Narrows and East End.',            location: 'BATCAVE — CONTROL',       sceneId: 'batcomputer-control', classification: 'BETA',       region: 'batcomputer', caseFileId: 'batcomputer-inv', ...pos('dm-bat-thermal-map', { top: 40, left: 45 }) },
  { id: 'dm-bat-arkham-feed',    title: 'ARKHAM LIVE FEED',        description: 'Restored link. Wing B motion detected.',               location: 'BATCAVE — CONTROL',       sceneId: 'batcomputer-control', classification: 'GAMMA',      region: 'batcomputer', caseFileId: 'batcomputer-inv', ...pos('dm-bat-arkham-feed', { top: 65, left: 20 }) },
  { id: 'dm-bat-gcpd-intercept', title: 'GCPD INTERCEPT',          description: 'Encrypted channel — recurring keyword: RED HOOD.',     location: 'BATCAVE — CONTROL',       sceneId: 'batcomputer-control', classification: 'ALPHA',      region: 'batcomputer', caseFileId: 'batcomputer-inv', ...pos('dm-bat-gcpd-intercept', { top: 30, left: 75 }) },
  { id: 'dm-bat-network-core',   title: 'NETWORK CORE ANALYSIS',   description: 'Full Gotham intelligence graph compiled.',             location: 'BATCAVE — CONTROL',       sceneId: 'batcomputer-control', classification: 'OMEGA',      region: 'batcomputer', caseFileId: 'batcomputer-inv', ...pos('dm-bat-network-core', { top: 50, left: 50 }) },
]

export const detectiveEvidenceList: DetectiveEvidence[] = [
  ...crimeAlley,
  ...arkham,
  ...wayne,
  ...narrows,
  ...batcomputer,
]

export const DETECTIVE_EVIDENCE_TOTAL = detectiveEvidenceList.length

export const getDetectiveEvidenceById = (id: string) =>
  detectiveEvidenceList.find(e => e.id === id)

export const getDetectiveEvidenceByScene = (sceneId: string) =>
  detectiveEvidenceList.filter(e => e.sceneId === sceneId)

export const getDetectiveEvidenceByCase = (caseFileId: CaseFileId) =>
  detectiveEvidenceList.filter(e => e.caseFileId === caseFileId)
