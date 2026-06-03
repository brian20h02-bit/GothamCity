import type { SceneId } from '@/core/navigation/types'
import type { VisualAnchor } from '@/data/sceneAnchors'
import { INTENSIVE_SUBJECTS, getPatientById } from '@/data/arkhamRecords'

export type ReadFileContent =
  | { type: 'subjects'; title: string; subtitle: string; subjects: typeof INTENSIVE_SUBJECTS }
  | { type: 'patient'; title: string; patientId: string }

export interface ReadFileAnchor extends VisualAnchor {
  sceneId: SceneId
  content: ReadFileContent
}

export const readFileAnchors: ReadFileAnchor[] = [
  {
    id: 'read-intensivo-terminal',
    sceneId: 'arkham-intensivo',
    element: 'Medical terminal — treatment records panel',
    top: 48, left: 38, width: 10, height: 12,
    content: {
      type: 'subjects',
      title: 'INTENSIVE TREATMENT — ACTIVE SUBJECTS',
      subtitle: 'WING B — RESTRICTED ACCESS',
      subjects: INTENSIVE_SUBJECTS,
    },
  },
  {
    id: 'read-lunatico-door-a',
    sceneId: 'arkham-lunatico',
    element: 'Cell door A — left corridor',
    top: 54, left: 22, width: 8, height: 18,
    content: { type: 'patient', title: 'PATIENT FILE', patientId: '2201' },
  },
  {
    id: 'read-lunatico-door-b',
    sceneId: 'arkham-lunatico',
    element: 'Cell door B',
    top: 54, left: 36, width: 8, height: 18,
    content: { type: 'patient', title: 'PATIENT FILE', patientId: '1104' },
  },
  {
    id: 'read-lunatico-door-c',
    sceneId: 'arkham-lunatico',
    element: 'Cell door C',
    top: 54, left: 50, width: 8, height: 18,
    content: { type: 'patient', title: 'PATIENT FILE', patientId: '0560' },
  },
  {
    id: 'read-lunatico-door-d',
    sceneId: 'arkham-lunatico',
    element: 'Cell door D',
    top: 54, left: 64, width: 8, height: 18,
    content: { type: 'patient', title: 'PATIENT FILE', patientId: '3318' },
  },
  {
    id: 'read-lunatico-door-e',
    sceneId: 'arkham-lunatico',
    element: 'Cell door E — end corridor',
    top: 54, left: 78, width: 8, height: 18,
    content: { type: 'patient', title: 'PATIENT FILE', patientId: '0871' },
  },
]

export const getReadFileAnchorsForScene = (sceneId: string) =>
  readFileAnchors.filter(a => a.sceneId === sceneId)

export function resolveReadFileContent(content: ReadFileContent) {
  if (content.type === 'subjects') return content
  const patient = getPatientById(content.patientId)
  return { ...content, patient }
}
