import { useEffect, useRef } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import { useDetective } from '@/core/detective/DetectiveContext'

/** Marca ubicaciones exploradas y dispara scan al activar detective mode */
export default function DetectiveSceneTracker() {
  const { currentScene } = useScene()
  const { markSceneExplored, active, triggerScan, scanPhase } = useDetective()
  const prevActive = useRef(false)

  useEffect(() => {
    markSceneExplored(currentScene.id)
  }, [currentScene.id, markSceneExplored])

  useEffect(() => {
    if (active && !prevActive.current && scanPhase === 'idle') {
      triggerScan(currentScene.id)
    }
    prevActive.current = active
  }, [active, currentScene.id, triggerScan, scanPhase])

  return null
}
