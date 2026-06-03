// Re-export unified evidence registry for legacy imports
import {
  detectiveEvidenceList,
  DETECTIVE_EVIDENCE_TOTAL,
  getDetectiveEvidenceById,
  getDetectiveEvidenceByScene,
  type DetectiveEvidence,
} from '@/data/detectiveEvidence'

export interface Evidence {
  id:          string
  title:       string
  description: string
  detail:      string
  scene:       string
}

function toLegacyEvidence(e: DetectiveEvidence): Evidence {
  return {
    id:          e.id,
    title:       e.title,
    description: e.description,
    detail:      e.detail ?? e.description,
    scene:       e.sceneId,
  }
}

export const allEvidence: Evidence[] = detectiveEvidenceList.map(toLegacyEvidence)
export const TOTAL_EVIDENCE = DETECTIVE_EVIDENCE_TOTAL

export const getEvidenceById = (id: string): Evidence | undefined => {
  const ev = getDetectiveEvidenceById(id)
  return ev ? toLegacyEvidence(ev) : undefined
}

export const getEvidenceByScene = (sceneId: string): Evidence[] =>
  getDetectiveEvidenceByScene(sceneId).map(toLegacyEvidence)
