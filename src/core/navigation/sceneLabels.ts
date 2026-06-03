import type { SceneId } from './types'
import { getSceneById } from './scenes'

/** Etiquetas legibles para navegación GO BACK (estilo narrative adventure) */
const BACK_LABEL_OVERRIDES: Partial<Record<SceneId, string>> = {
  'arkham-entrada':            'ARKHAM ENTRANCE',
  'arkham-fachada':            'ARKHAM FACADE',
  'arkham-atrio':              'ARKHAM ATRIUM',
  'arkham-puertas':            'CLASSIFIED RECORDS',
  'arkham-intensivo':          'INTENSIVE TREATMENT',
  'arkham-lunatico':           'PATIENT DATABASE',
  'arkham-investigation':      'ARKHAM DOSSIER',
  'wayne-exterior':            'WAYNE TOWER',
  'wayne-lobby':               'WAYNE TOWER LOBBY',
  'wayne-sala':                'EXECUTIVE OPERATIONS',
  'wayne-despacho':            'BRUCE WAYNE OFFICE',
  'batcomputer':               'BATCOMPUTER',
  'batcomputer-control':       'CONTROL CENTER',
  'crime-alley-investigation': 'CRIME ALLEY — INVESTIGATION',
  'narrows-investigation':     'THE NARROWS — INVESTIGATION',
  'gotham-city':               'GOTHAM CITY',
  'crime-alley':               'CRIME ALLEY',
  'the-incident':              'THE INCIDENT',
  'the-archives':              'GOTHAM ARCHIVES',
}

export function getSceneBackLabel(sceneId: SceneId): string {
  const override = BACK_LABEL_OVERRIDES[sceneId]
  if (override) return override
  const scene = getSceneById(sceneId)
  return scene?.title ?? sceneId.toUpperCase().replace(/-/g, ' ')
}
