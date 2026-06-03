import { useEffect, useRef } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import { useDetective } from '@/core/detective/DetectiveContext'

/** Apaga Detective Mode al cambiar de escena (navigate / goBack) */
export default function DetectiveNavigationBridge() {
  const { currentScene } = useScene()
  const { deactivateDetectiveMode } = useDetective()
  const prevSceneId = useRef(currentScene.id)

  useEffect(() => {
    if (prevSceneId.current !== currentScene.id) {
      deactivateDetectiveMode()
    }
    prevSceneId.current = currentScene.id
  }, [currentScene.id, deactivateDetectiveMode])

  return null
}
