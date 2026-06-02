// ─── Evidence Model ──────────────────────────────────────────────────────────

export interface Evidence {
  id:          string
  title:       string
  description: string   // short — shown in hotspot tooltip
  detail:      string   // long — shown in evidence panel
  scene:       string   // sceneId where this evidence lives
}

// ─── Crime Alley (4 — findable) ──────────────────────────────────────────────
const crimeAlleyEvidence: Evidence[] = [
  {
    id:          'broken-camera',
    title:       'BROKEN CAMERA',
    description: 'Security camera. Lens shattered. Recording corrupted.',
    detail:      'GCPD surveillance unit found smashed at the alley entrance. Last recorded timestamp: 22:47. Data irretrievable. Suspected deliberate sabotage.',
    scene:       'crime-alley-investigation',
  },
  {
    id:          'witness-report',
    title:       'WITNESS REPORT',
    description: 'Handwritten. Unsigned. Filed anonymously.',
    detail:      '"He didn\'t run. He just… watched." Single page. Author unknown. Filed with GCPD Precinct 14. No follow-up investigation authorized.',
    scene:       'crime-alley-investigation',
  },
  {
    id:          'rose-fragment',
    title:       'ROSE FRAGMENT',
    description: 'Single petal. Dried. Left at the scene annually.',
    detail:      'Left at the exact location of the incident every November 5th since 1981. No prints. No DNA. Origin unknown. Treated as non-evidence by GCPD.',
    scene:       'crime-alley-investigation',
  },
  {
    id:          'anonymous-letter',
    title:       'ANONYMOUS LETTER',
    description: 'Typed. No return address. Mailed the day after.',
    detail:      '"They will not be forgotten." Seven words. No signature. Postmarked East End. Recipient: Commissioner Gordon. Classified and sealed.',
    scene:       'crime-alley-investigation',
  },
]

// ─── Arkham Asylum (5 — findable in arkham-puertas) ────────────────────────
const arkhamEvidence: Evidence[] = [
  { id: 'arkham-patient-file', title: 'PATIENT FILE 4479', description: 'Restricted medical record. Identity withheld.', detail: 'Subject admitted 1989. Diagnosis: acute paranoid schizophrenia. Notes redacted by Dr. Crane. Multiple unauthorized treatments documented.', scene: 'arkham-puertas' },
  { id: 'arkham-blueprint',    title: 'ASYLUM BLUEPRINT',  description: 'Original plans. Sections modified post-1989.',    detail: 'Original 1898 blueprints show three additional sub-basement levels. Added in 1989 renovation. Access codes not included in this record.', scene: 'arkham-puertas' },
  { id: 'arkham-interview',    title: 'DR. CRANE INTERVIEW', description: 'Transcript. 90% redacted.',                      detail: 'Crane interview — [REDACTED] — patient welfare — [REDACTED] — aerosol compound — [REDACTED] — unauthorized clinical trials — [REDACTED] — Board approval bypassed.', scene: 'arkham-puertas' },
  { id: 'arkham-chemical',     title: 'COMPOUND ANALYSIS', description: 'Unknown aerosol. Lab analysis ongoing.',           detail: 'Sample recovered from sub-basement ventilation shaft. Chemical composition: unclassified. Effects: acute fear response. Source: Crane laboratory, Wing D.', scene: 'arkham-puertas' },
  { id: 'arkham-escape-log',   title: 'ESCAPE INCIDENT LOG', description: '14 documented escapes in 10 years.',             detail: '14 escapes between 1988–1998. All files individually sealed. Common factor: perimeter breach at sub-basement level. No pattern identified per official GCPD report.', scene: 'arkham-puertas' },
]

// ─── Wayne Tower (4 — findable in wayne-despacho) ──────────────────────────
const wayneTowerEvidence: Evidence[] = [
  { id: 'wayne-financial',  title: 'FINANCIAL RECORD',   description: 'Classified transactions. Offshore accounts.',   detail: 'Transaction log showing $48M transferred to shell entities in the Caymans between 1989–1994. Authorized by board signatory: B. WAYNE. Purpose: CLASSIFIED.', scene: 'wayne-despacho' },
  { id: 'wayne-contract',   title: 'ARMS CONTRACT',      description: 'Military-grade tech. Buyer redacted.',          detail: 'Contract for experimental sonar surveillance technology. Buyer: [REDACTED]. Delivery date: ongoing. Project codename: EYES OF GOTHAM.', scene: 'wayne-despacho' },
  { id: 'wayne-autopsy',    title: 'AUTOPSY REPORT',     description: 'Thomas Wayne. Discrepancies noted internally.', detail: 'Official report lists cause of death: gunshot wound. Internal memo attached notes inconsistency in ballistic trajectory. Sealed by district attorney 1981.', scene: 'wayne-despacho' },
  { id: 'wayne-photograph', title: 'SURVEILLANCE PHOTO', description: 'Wayne Manor. Unknown vehicle. 1981.',           detail: 'Black vehicle registered to unnamed entity photographed outside Wayne Manor gate, November 4 1981 — 19 hours before the incident. Plates: unreadable.', scene: 'wayne-despacho' },
]

// ─── The Narrows stubs (5) ───────────────────────────────────────────────────
const narrowsEvidence: Evidence[] = [
  { id: 'narrows-toxin-report',  title: 'TOXIN REPORT',           description: 'Mass hallucination event. Covered up.',      detail: 'CLEARANCE LEVEL IV REQUIRED TO ACCESS FULL RECORD.', scene: 'narrows-investigation' },
  { id: 'narrows-water-map',     title: 'WATER MAIN ACCESS MAP',  description: 'Infrastructure points marked by hand.',      detail: 'CLEARANCE LEVEL IV REQUIRED TO ACCESS FULL RECORD.', scene: 'narrows-investigation' },
  { id: 'narrows-memo',          title: 'GCPD INTERNAL MEMO',     description: 'Evacuation plan. Never executed.',           detail: 'CLEARANCE LEVEL IV REQUIRED TO ACCESS FULL RECORD.', scene: 'narrows-investigation' },
  { id: 'narrows-informant',     title: 'INFORMANT DOSSIER',      description: 'Handler: unknown. Status: missing.',         detail: 'CLEARANCE LEVEL IV REQUIRED TO ACCESS FULL RECORD.', scene: 'narrows-investigation' },
  { id: 'narrows-media-order',   title: 'MEDIA SUPPRESSION ORDER', description: 'Signed by the mayor. Date redacted.',      detail: 'CLEARANCE LEVEL IV REQUIRED TO ACCESS FULL RECORD.', scene: 'narrows-investigation' },
]

// ─── Master list (18 total) ───────────────────────────────────────────────────
export const allEvidence: Evidence[] = [
  ...crimeAlleyEvidence,
  ...arkhamEvidence,
  ...wayneTowerEvidence,
  ...narrowsEvidence,
]

export const TOTAL_EVIDENCE = allEvidence.length  // 18

export const getEvidenceById = (id: string): Evidence | undefined =>
  allEvidence.find(e => e.id === id)

export const getEvidenceByScene = (sceneId: string): Evidence[] =>
  allEvidence.filter(e => e.scene === sceneId)
