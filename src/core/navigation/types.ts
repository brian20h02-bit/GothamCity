// ─── Scene Navigation System — Types ────────────────────────────────────────

export type SceneId =
  | 'gotham-city'
  | 'crime-alley'
  | 'the-incident'
  | 'the-archives'
  | 'crime-alley-investigation'
  | 'arkham-investigation'
  | 'arkham-entrada'
  | 'arkham-fachada'
  | 'arkham-atrio'
  | 'arkham-puertas'
  | 'arkham-intensivo'
  | 'arkham-lunatico'
  | 'wayne-exterior'
  | 'wayne-lobby'
  | 'wayne-sala'
  | 'wayne-despacho'
  | 'batcomputer'
  | 'batcomputer-control'

export type TransitionType = 'archive' | 'memory' | 'batcomputer' | 'none'

export interface Hotspot {
  /** Unique key within scene */
  id: string
  /** Clickable area as % of scene dimensions */
  area: {
    top:    number // %
    left:   number // %
    width:  number // %
    height: number // %
  }
  /** Label shown on cursor / tooltip */
  label: string
  /** Action verb shown on custom cursor */
  action: 'INVESTIGATE' | 'ACCESS' | 'ENTER' | 'VIEW'
  /** Scene to transition into on click */
  targetScene: SceneId | null
  transitionType: TransitionType
}

export interface Scene {
  id:          SceneId
  title:       string
  subtitle:    string
  archiveCode: string        // e.g. "ARCHIVE 01/04"
  location:    string        // shown in HUD
  background:  string        // path to image
  hotspots:    Hotspot[]
  nextScene:   SceneId | null
  prevScene:   SceneId | null
}
