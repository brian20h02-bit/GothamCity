import type { SceneInvestigation, TrailStep } from '@/data/sceneInvestigations'

export function getVisitedSteps(
  investigation: SceneInvestigation,
  trailProgress: Record<string, string[]>,
): string[] {
  return trailProgress[investigation.id] ?? []
}

export function isStepRevealed(
  step: TrailStep,
  investigation: SceneInvestigation,
  visited: string[],
  scanActive: boolean,
  scanCompletedForScene: boolean,
): boolean {
  if (!step.requires) {
    if (investigation.requiresScanFirst) {
      return scanCompletedForScene || scanActive
    }
    return true
  }
  if (step.requires === 'scan') {
    return scanCompletedForScene || scanActive
  }
  return visited.includes(step.requires)
}

export function getNextTrailStep(
  investigation: SceneInvestigation,
  visited: string[],
): TrailStep | undefined {
  const sorted = [...investigation.trail].sort((a, b) => a.order - b.order)
  return sorted.find(s => !visited.includes(s.id))
}

export function isInvestigationComplete(
  investigation: SceneInvestigation,
  visited: string[],
): boolean {
  return investigation.trail.every(s => visited.includes(s.id))
}

export function getRevealedSteps(
  investigation: SceneInvestigation,
  trailProgress: Record<string, string[]>,
  scanActive: boolean,
  scanCompletedForScene: boolean,
): TrailStep[] {
  const visited = getVisitedSteps(investigation, trailProgress)
  return investigation.trail.filter(s =>
    isStepRevealed(s, investigation, visited, scanActive, scanCompletedForScene),
  )
}
