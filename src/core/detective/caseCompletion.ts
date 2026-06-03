import { detectiveEvidenceList } from '@/data/detectiveEvidence'
import {
  getInvestigationByScene,
  sceneInvestigations,
  type InvestigationCaseId,
} from '@/data/sceneInvestigations'

export function computeCaseCompletion(
  caseId: InvestigationCaseId | 'crime-alley' | 'narrows',
  foundEvidenceIds: string[],
): number {
  const investigations = sceneInvestigations.filter(i => i.caseId === caseId)
  const regionMap: Record<string, string> = {
    'crime-alley': 'crime-alley',
    narrows:       'narrows',
    arkham:        'arkham',
    wayne:         'wayne',
  }
  const region = regionMap[caseId]
  if (!region && investigations.length === 0) return 0

  const caseEvidenceIds = detectiveEvidenceList
    .filter(e => {
      if (caseId === 'arkham') return e.region === 'arkham'
      if (caseId === 'wayne') return e.region === 'wayne'
      if (caseId === 'crime-alley') return e.region === 'crime-alley'
      if (caseId === 'narrows') return e.region === 'narrows'
      return true
    })
    .map(e => e.id)

  const foundInCase = caseEvidenceIds.filter(id => foundEvidenceIds.includes(id)).length
  return Math.min(100, Math.round((foundInCase / caseEvidenceIds.length) * 100))
}

export function computeMainInvestigationCompletion(foundEvidenceIds: string[]): number {
  const total = detectiveEvidenceList.length
  if (total === 0) return 0
  return Math.min(100, Math.round((foundEvidenceIds.length / total) * 100))
}

export function getGlobalObjective(
  foundEvidenceIds: string[],
  batcomputerAccessRevealed: boolean,
  currentSceneId: string,
): string {
  const inv = getInvestigationByScene(currentSceneId)
  if (inv && !foundEvidenceIds.includes(inv.evidenceId)) {
    return `Follow the trail — ${inv.objective}`
  }

  if (!batcomputerAccessRevealed) return 'Locate Hidden Access Point'

  const arkham = computeCaseCompletion('arkham', foundEvidenceIds)
  const wayne = computeCaseCompletion('wayne', foundEvidenceIds)
  if (arkham < 100) return 'Complete Arkham Case'
  if (wayne < 100) return 'Complete Wayne Case'
  if (foundEvidenceIds.length < detectiveEvidenceList.length) return 'Resolve Main Investigation'
  return 'Review Case Board — Batcomputer'
}
