import type { SceneId } from '@/core/navigation/types'

export type BatcomputerPanelId =
  | 'network-map'
  | 'case-board'
  | 'timeline'
  | 'case-database'
  | 'status'
  | 'activity-log'
  | 'gotham-status'
  | 'active-scans'

export interface BatcomputerPanelAnchor {
  id:       string
  sceneId:  SceneId
  element:  string
  top:      number
  left:     number
  width:    number
  height:   number
  panelId:  BatcomputerPanelId
  label:    string
}

/** Pantallas clickeables — solo con detective OFF (InfoHotspot) */
export const batcomputerPanelAnchors: BatcomputerPanelAnchor[] = [
  {
    id: 'bat-panel-network',
    sceneId: 'batcomputer',
    element: 'Left monitor — Gotham network map',
    top: 40, left: 26, width: 16, height: 14,
    panelId: 'network-map',
    label: 'NETWORK MAP',
  },
  {
    id: 'bat-panel-caseboard',
    sceneId: 'batcomputer',
    element: 'Center monitor — investigation board',
    top: 34, left: 48, width: 18, height: 16,
    panelId: 'case-board',
    label: 'CASE BOARD',
  },
  {
    id: 'bat-panel-database',
    sceneId: 'batcomputer',
    element: 'Right monitor — case file database',
    top: 40, left: 72, width: 14, height: 14,
    panelId: 'case-database',
    label: 'CASE DATABASE',
  },
  {
    id: 'bat-panel-timeline',
    sceneId: 'batcomputer',
    element: 'Lower console — timeline system',
    top: 58, left: 44, width: 22, height: 10,
    panelId: 'timeline',
    label: 'TIMELINE',
  },
  {
    id: 'bat-panel-status',
    sceneId: 'batcomputer',
    element: 'Upper status strip — live metrics',
    top: 18, left: 50, width: 28, height: 8,
    panelId: 'status',
    label: 'SYSTEM STATUS',
  },
  // Control center — paneles inferiores de la sala
  {
    id: 'bat-ctrl-activity',
    sceneId: 'batcomputer-control',
    element: 'Left console panel — activity log',
    top: 72, left: 18, width: 22, height: 14,
    panelId: 'activity-log',
    label: 'ACTIVITY LOG',
  },
  {
    id: 'bat-ctrl-status',
    sceneId: 'batcomputer-control',
    element: 'Center console — Gotham status',
    top: 72, left: 42, width: 22, height: 14,
    panelId: 'gotham-status',
    label: 'GOTHAM STATUS',
  },
  {
    id: 'bat-ctrl-scans',
    sceneId: 'batcomputer-control',
    element: 'Right console panel — active scans',
    top: 72, left: 66, width: 22, height: 14,
    panelId: 'active-scans',
    label: 'ACTIVE SCANS',
  },
]

export const getBatcomputerPanelAnchorsForScene = (sceneId: string) =>
  batcomputerPanelAnchors.filter(a => a.sceneId === sceneId)

export const getBatcomputerPanelTitle = (panelId: BatcomputerPanelId): string => {
  const anchor = batcomputerPanelAnchors.find(a => a.panelId === panelId)
  return anchor?.label ?? panelId.toUpperCase()
}
