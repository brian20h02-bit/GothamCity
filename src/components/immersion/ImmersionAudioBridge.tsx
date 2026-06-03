import { useEffect, useRef } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import { useDetective } from '@/core/detective/DetectiveContext'
import { getSceneAtmosphere } from '@/data/sceneAtmosphere'
import { DETECTIVE_EVIDENCE_TOTAL } from '@/data/detectiveEvidence'
import { bindAudioUnlock, immersionAudio } from '@/sound/ImmersionAudioEngine'
import { isMainHubScene } from '@/sound/mainHubScenes'

export default function ImmersionAudioBridge() {
  const { currentScene } = useScene()
  const { foundEvidenceIds } = useDetective()
  const prevCount = useRef(foundEvidenceIds.length)
  const prevScene = useRef(currentScene.id)

  useEffect(() => {
    bindAudioUnlock()
    void immersionAudio.preloadSamples()
  }, [])

  useEffect(() => {
    const profile = getSceneAtmosphere(currentScene.id)
    const sceneChanged = prevScene.current !== currentScene.id

    if (sceneChanged && isMainHubScene(currentScene.id)) {
      immersionAudio.playBatSwarm()
    }

    void immersionAudio.syncScene(currentScene.id, profile)
    prevScene.current = currentScene.id
  }, [currentScene.id])

  useEffect(() => {
    const count = foundEvidenceIds.length
    if (count > prevCount.current) {
      const isFinal = count >= DETECTIVE_EVIDENCE_TOTAL
      immersionAudio.playEvidenceFound(isFinal)
    }
    prevCount.current = count
  }, [foundEvidenceIds.length])

  return null
}
