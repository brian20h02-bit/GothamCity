// ─── Investigation File Model ─────────────────────────────────────────────────

export interface InvestigationFile {
  id:                string
  caseNumber:        string
  title:             string
  location:          string
  clearanceRequired: number   // 1–5
  evidenceRequired:  number   // evidence found in case needed to unlock next
  sceneId:           string | null
  description:       string
  unlocksFileId:     string | null  // which file to unlock on completion
}

export const investigationFiles: InvestigationFile[] = [
  {
    id:                'crime-alley-inv',
    caseNumber:        'FILE 001',
    title:             'CRIME ALLEY',
    location:          'PARK ROW — EAST GOTHAM',
    clearanceRequired: 1,
    evidenceRequired:  4,
    sceneId:           'crime-alley-investigation',
    description:       'Double homicide. November 1981. Case never officially closed.',
    unlocksFileId:     'arkham-inv',
  },
  {
    id:                'arkham-inv',
    caseNumber:        'FILE 002',
    title:             'ARKHAM ASYLUM',
    location:          'ARKHAM ISLAND',
    clearanceRequired: 2,
    evidenceRequired:  5,
    sceneId:           'arkham-entrada',
    description:       'Classified psychiatric facility. Unauthorized experiments suspected. Dr. Jonathan Crane — person of interest.',
    unlocksFileId:     'wayne-tower-inv',
  },
  {
    id:                'wayne-tower-inv',
    caseNumber:        'FILE 003',
    title:             'WAYNE TOWER',
    location:          'MIDTOWN GOTHAM',
    clearanceRequired: 3,
    evidenceRequired:  4,
    sceneId:           'wayne-exterior',
    description:       'Wayne Enterprises. The tower that watches over Gotham. What is Bruce Wayne hiding?',
    unlocksFileId:     'narrows-inv',
  },
  {
    id:                'narrows-inv',
    caseNumber:        'FILE 004',
    title:             'THE NARROWS',
    location:          'LOWER EAST GOTHAM',
    clearanceRequired: 4,
    evidenceRequired:  5,
    sceneId:           'narrows-investigation',
    description:       'Mass hallucination event. Infrastructure sabotage. Records sealed.',
    unlocksFileId:     'batcomputer-inv',
  },
  {
    id:                'batcomputer-inv',
    caseNumber:        'FILE 005',
    title:             'BATCOMPUTER',
    location:          'WAYNE NETWORK — SECURE HUB',
    clearanceRequired: 5,
    evidenceRequired:  7,
    sceneId:           'batcomputer',
    description:       'Central intelligence system. Full Gotham grid access. Executive authority only.',
    unlocksFileId:     null,
  },
]

export const getFileById = (id: string): InvestigationFile | undefined =>
  investigationFiles.find(f => f.id === id)
