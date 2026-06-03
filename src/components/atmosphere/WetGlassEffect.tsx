import { memo, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useScene } from '@/core/navigation/SceneContext'
import { getSceneAtmosphere, isWetGlassEnabled } from '@/data/sceneAtmosphere'
import { Z_INDEX } from '@/config/layers'
import WetGlassScene from './wetGlass/WetGlassScene'

/** Cristal mojado — capa óptica sobre la escena (solo exteriores) */
export default memo(function WetGlassEffect() {
  const { currentScene } = useScene()
  const profile = useMemo(() => getSceneAtmosphere(currentScene.id), [currentScene.id])
  const enabled = isWetGlassEnabled(currentScene.id)
  const intensity = profile.rainIntensity

  if (!enabled || intensity <= 0 || !currentScene.background) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: Z_INDEX.WET_GLASS }}
      aria-hidden="true"
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], left: -1, right: 1, top: 1, bottom: -1, near: 0, far: 2 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.75]}
        frameloop="always"
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <WetGlassScene
          intensity={intensity}
          windAngle={profile.rainWind}
          backgroundUrl={currentScene.background}
        />
      </Canvas>
    </div>
  )
})
