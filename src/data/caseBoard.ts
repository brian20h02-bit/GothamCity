export type BoardNodeKind = 'evidence' | 'event' | 'location'

export interface CaseBoardNode {
  id:       string
  kind:     BoardNodeKind
  label:    string
  sublabel?: string
  x:        number
  y:        number
  evidenceId?: string
  region?:  'arkham' | 'wayne' | 'batcomputer' | 'crime'
}

export interface CaseBoardEdge {
  from: string
  to:   string
}

export const caseBoardNodes: CaseBoardNode[] = [
  { id: 'loc-crime', kind: 'location', label: 'CRIME ALLEY', sublabel: 'ORIGIN', x: 8, y: 42, region: 'crime' },
  { id: 'ev-crime', kind: 'event', label: 'WAYNE MURDER', sublabel: '1981', x: 18, y: 28 },

  { id: 'loc-arkham', kind: 'location', label: 'ARKHAM', sublabel: 'ISLAND', x: 32, y: 55, region: 'arkham' },
  { id: 'ev-breach', kind: 'evidence', label: 'SECURITY BREACH', evidenceId: 'dm-arkham-breach', x: 28, y: 38 },
  { id: 'ev-transfer', kind: 'evidence', label: 'TRANSFER ROUTE', evidenceId: 'dm-arkham-transfer', x: 36, y: 32 },
  { id: 'ev-unknown', kind: 'evidence', label: 'UNKNOWN SUBJECT', evidenceId: 'dm-arkham-unknown-subject', x: 40, y: 48 },

  { id: 'loc-wayne', kind: 'location', label: 'WAYNE TOWER', sublabel: 'MIDTOWN', x: 58, y: 42, region: 'wayne' },
  { id: 'ev-division', kind: 'evidence', label: 'HIDDEN DIVISION', evidenceId: 'dm-wayne-division', x: 54, y: 28 },
  { id: 'ev-terminal', kind: 'evidence', label: 'BATCOMPUTER LINK', evidenceId: 'dm-wayne-terminal', x: 62, y: 32 },

  { id: 'loc-bat', kind: 'location', label: 'BATCAVE', sublabel: 'CORE', x: 82, y: 45, region: 'batcomputer' },
  { id: 'ev-grid', kind: 'evidence', label: 'SIGNAL GRID', evidenceId: 'dm-bat-signal-grid', x: 78, y: 30 },
  { id: 'ev-core', kind: 'evidence', label: 'NETWORK CORE', evidenceId: 'dm-bat-network-core', x: 88, y: 38 },
]

export const caseBoardEdges: CaseBoardEdge[] = [
  { from: 'loc-crime', to: 'ev-crime' },
  { from: 'ev-crime', to: 'loc-arkham' },
  { from: 'loc-arkham', to: 'ev-breach' },
  { from: 'ev-breach', to: 'ev-transfer' },
  { from: 'ev-transfer', to: 'ev-unknown' },
  { from: 'ev-crime', to: 'loc-wayne' },
  { from: 'loc-wayne', to: 'ev-division' },
  { from: 'ev-division', to: 'ev-terminal' },
  { from: 'ev-terminal', to: 'loc-bat' },
  { from: 'loc-bat', to: 'ev-grid' },
  { from: 'ev-grid', to: 'ev-core' },
  { from: 'ev-unknown', to: 'loc-wayne' },
]

export const getBoardNodesForEvidence = (foundIds: string[]) =>
  caseBoardNodes.map(n => ({
    ...n,
    discovered: n.evidenceId ? foundIds.includes(n.evidenceId) : true,
  }))
