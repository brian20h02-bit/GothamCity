export interface SubjectRecord {
  id:       string
  name:     string
  ward:     string
  status:   string
  diagnosis: string
  admitted: string
  incidents: number
}

export interface PatientRecord {
  id:        string
  name:      string
  diagnosis: string
  ward:      string
  admit:     string
  status:    string
  threat:    string
  history:   string
}

export const INTENSIVE_SUBJECTS: SubjectRecord[] = [
  { id: 'R-0042', name: 'SUBJECT A', ward: 'INTENSIVE WING',  status: 'ACTIVE',    diagnosis: 'Acute paranoid psychosis',            admitted: '1989-03-14', incidents: 7  },
  { id: 'R-0118', name: 'SUBJECT B', ward: 'ISOLATION UNIT',  status: 'CRITICAL',  diagnosis: 'Unclassified neurological condition',  admitted: '1991-07-22', incidents: 14 },
  { id: 'R-0203', name: 'SUBJECT C', ward: 'TREATMENT B',     status: 'MONITORED', diagnosis: 'Chemical-induced delirium',            admitted: '1993-11-08', incidents: 3  },
  { id: 'R-0389', name: 'SUBJECT D', ward: 'SOLITARY',        status: 'DANGEROUS', diagnosis: 'Extreme violent behavior disorder',    admitted: '1987-05-30', incidents: 23 },
  { id: 'R-0512', name: 'SUBJECT E', ward: 'OBSERVATION',     status: 'ACTIVE',    diagnosis: 'Severe dissociative disorder',         admitted: '1995-02-18', incidents: 2  },
  { id: 'R-0671', name: 'SUBJECT F', ward: 'WING B — SEC.',   status: 'CRITICAL',  diagnosis: 'Experimental treatment — ongoing',    admitted: '1994-09-03', incidents: 9  },
]

export const PATIENT_DATABASE: PatientRecord[] = [
  { id: '2201', name: 'DENT, H.',    diagnosis: 'Dissociative identity disorder',         ward: 'A — MONITORED',    admit: '1991-11-02', status: 'ESCAPED',   threat: 'HIGH',     history: 'Escaped November 1994. GCPD alert active. Do not approach without armed backup. Dual identity confirmed.' },
  { id: '1104', name: 'ISLEY, P.',   diagnosis: 'Eco-reactive psychosis',                 ward: 'C — SECURED',      admit: '1994-05-30', status: 'CONTAINED', threat: 'MEDIUM',   history: 'Isolated to sealed ward. All plant material removed. External contact prohibited. Cooperation level: low.' },
  { id: '0560', name: 'FRIES, V.',   diagnosis: 'Cryogenic exposure — neurological dmg',  ward: 'D — ISOLATED',     admit: '1992-12-01', status: 'CONTAINED', threat: 'HIGH',     history: 'Requires sub-zero environment. Special unit maintained at -20°C. Cooperative when isolated from aggravation.' },
  { id: '3318', name: 'NAPIER, J.',  diagnosis: 'Unclassified — see attached notes',      ward: 'MAXIMUM SECURITY', admit: '1988-07-19', status: 'ESCAPED',   threat: 'CRITICAL', history: 'Entire file destroyed post-escape 1989. Subject whereabouts: unknown. Classified threat designation: Omega.' },
  { id: '0871', name: 'NASHTON, E.', diagnosis: 'Obsessive-compulsive narcissism',        ward: 'B — MONITORED',    admit: '1993-08-14', status: 'ACTIVE',    threat: 'HIGH',     history: 'IQ designated classified. Communication limited to written form. Fixation on riddles and puzzles.' },
]

export const getPatientById = (id: string) =>
  PATIENT_DATABASE.find(p => p.id === id)
