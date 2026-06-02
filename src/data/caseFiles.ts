export type CaseStatus = 'OPEN' | 'RESTRICTED' | 'SECURE' | 'ACTIVE' | 'UNDER SURVEILLANCE' | 'CRITICAL'
export type ClassificationLevel = 'LEVEL I' | 'LEVEL II' | 'LEVEL III' | 'LEVEL IV' | 'LEVEL V'

export interface CaseFile {
  id: string
  caseNumber: string
  name: string
  status: CaseStatus
  date: string
  classification: ClassificationLevel
  excerpt: string
}

export const caseFiles: CaseFile[] = [
  {
    id:             'crime-alley',
    caseNumber:     'CASE FILE 001',
    name:           'CRIME ALLEY',
    status:         'OPEN',
    date:           'NOV 5, 1981',
    classification: 'LEVEL IV',
    excerpt:        'Double homicide. Park Row district. Suspects at large. Investigation ongoing.',
  },
  {
    id:             'arkham-asylum',
    caseNumber:     'CASE FILE 002',
    name:           'ARKHAM ASYLUM',
    status:         'RESTRICTED',
    date:           'MAR 18, 1974',
    classification: 'LEVEL V',
    excerpt:        'High-security psychiatric facility. Multiple containment breaches on record.',
  },
  {
    id:             'wayne-tower',
    caseNumber:     'CASE FILE 003',
    name:           'WAYNE TOWER',
    status:         'SECURE',
    date:           'JAN 12, 1939',
    classification: 'LEVEL II',
    excerpt:        'Corporate headquarters. Enhanced security protocols. Surveillance active.',
  },
  {
    id:             'the-narrows',
    caseNumber:     'CASE FILE 004',
    name:           'THE NARROWS',
    status:         'ACTIVE',
    date:           'APR 3, 2005',
    classification: 'LEVEL IV',
    excerpt:        'High crime density. Gang activity elevated. Patrol units deployed.',
  },
  {
    id:             'gotham-harbor',
    caseNumber:     'CASE FILE 005',
    name:           'GOTHAM HARBOR',
    status:         'UNDER SURVEILLANCE',
    date:           'SEP 29, 2007',
    classification: 'LEVEL III',
    excerpt:        'Suspected smuggling routes. Organized crime presence. Intel gathering.',
  },
  {
    id:             'east-end',
    caseNumber:     'CASE FILE 006',
    name:           'EAST END',
    status:         'CRITICAL',
    date:           'FEB 14, 2009',
    classification: 'LEVEL V',
    excerpt:        'Immediate threat assessment required. Multiple incidents unresolved.',
  },
]
