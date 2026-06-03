import { useMemo } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import { useDetective } from '@/core/detective/DetectiveContext'
import {
  getNextTrailStep,
  getRevealedSteps,
  getVisitedSteps,
} from '@/core/detective/investigationTrail'
import TrailMarker from './TrailMarker'

export default function SceneInvestigationLayer() {
  const { currentScene } = useScene()
  const {
    active,
    trailProgress,
    visitTrailStep,
    hasScanCompletedForScene,
    activeScanSceneId,
    getSceneInvestigation,
    isInvestigationConcluded,
    scanPhase,
  } = useDetective()

  const investigation = getSceneInvestigation(currentScene.id)

  const visited = useMemo(
    () => (investigation ? getVisitedSteps(investigation, trailProgress) : []),
    [investigation, trailProgress],
  )

  const scanDone = hasScanCompletedForScene(currentScene.id)
  const scanInProgressHere =
    activeScanSceneId === currentScene.id &&
    (scanPhase === 'wave' || scanPhase === 'message')
  const scanActiveForScene = scanDone || scanInProgressHere

  const revealed = useMemo(() => {
    if (!investigation) return []
    return getRevealedSteps(
      investigation,
      trailProgress,
      scanActiveForScene,
      scanDone,
    )
  }, [investigation, trailProgress, scanActiveForScene, scanDone])

  const nextStep = useMemo(
    () => (investigation ? getNextTrailStep(investigation, visited) : undefined),
    [investigation, visited],
  )

  if (!active || !investigation || isInvestigationConcluded(investigation.id)) return null

  // Sin banner persistente — el scan es transitorio vía overlay global
  if (investigation.requiresScanFirst && !scanDone && scanPhase === 'idle') {
    return null
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 12 }}
      aria-label="Scene investigation"
    >
      {revealed.map(step => (
        <TrailMarker
          key={step.id}
          top={step.top}
          left={step.left}
          type={step.type}
          hint={step.hint}
          element={step.element}
          active={nextStep?.id === step.id}
          visited={visited.includes(step.id)}
          onFollow={() => visitTrailStep(investigation.id, step.id)}
        />
      ))}
    </div>
  )
}
