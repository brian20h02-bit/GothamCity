import type { SceneId } from '@/core/navigation/types'
import type { TransitionType } from '@/core/navigation/types'

/** Navegación de progreso anclada a la imagen (puertas / pasillos) */
export interface ProgressAnchor {
  sceneId:       SceneId
  top:           number
  left:          number
  width:         number
  height:        number
  label:         string
  cursorAction:  'ENTER' | 'ACCESS' | 'OPEN LOCATION'
  targetScene:   SceneId
  transitionType: TransitionType
}

export const sceneProgressAnchors: ProgressAnchor[] = [
  {
    sceneId: 'arkham-puertas',
    top: 58, left: 42, width: 22, height: 18,
    label: 'INTENSIVE WING',
    cursorAction: 'ENTER',
    targetScene: 'arkham-intensivo',
    transitionType: 'archive',
  },
  {
    sceneId: 'arkham-intensivo',
    top: 72, left: 68, width: 20, height: 14,
    label: 'PATIENT DATABASE',
    cursorAction: 'OPEN LOCATION',
    targetScene: 'arkham-lunatico',
    transitionType: 'archive',
  },
  {
    sceneId: 'wayne-sala',
    top: 55, left: 48, width: 18, height: 22,
    label: 'PRIVATE OFFICE',
    cursorAction: 'ENTER',
    targetScene: 'wayne-despacho',
    transitionType: 'archive',
  },
]

export const getProgressAnchorsForScene = (sceneId: string) =>
  sceneProgressAnchors.filter(a => a.sceneId === sceneId)
