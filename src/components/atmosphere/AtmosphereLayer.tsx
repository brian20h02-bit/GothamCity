import { memo, useMemo } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import { getSceneAtmosphere } from '@/data/sceneAtmosphere'
import DynamicLighting from '@/components/immersion/DynamicLighting'
import SceneMicroAnimations from '@/components/immersion/SceneMicroAnimations'
import LightningSystem from '@/components/atmosphere/LightningSystem'
import { Z_INDEX } from '@/config/layers'

/** Iluminación dinámica, micro-animaciones y relámpagos — sin niebla ni vapor */
export default memo(function AtmosphereLayer() {
  const { currentScene } = useScene()
  const profile = useMemo(() => getSceneAtmosphere(currentScene.id), [currentScene.id])

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: Z_INDEX.ATMOSPHERE }}>
      <DynamicLighting
        region={profile.region}
        lampFlicker={profile.lampFlicker}
        windowGlow={profile.windowGlow}
        screenPulse={profile.screenPulse}
        dimLevel={profile.dimLevel}
        zIndex={1}
      />

      <SceneMicroAnimations region={profile.region} zIndex={2} />

      {profile.lightning && (
        <LightningSystem rate={profile.lightningRate} />
      )}
    </div>
  )
})
