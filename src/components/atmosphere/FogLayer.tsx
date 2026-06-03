import { memo, useMemo } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import { getSceneAtmosphere, getFogStrength } from '@/data/sceneAtmosphere'
import SceneFog from '@/components/immersion/SceneFog'
import UrbanAtmosphere from '@/components/immersion/UrbanAtmosphere'
import AtmosphericHaze from '@/components/atmosphere/AtmosphericHaze'
import { Z_INDEX } from '@/config/layers'

/**
 * Capas 2–4:
 * Depth fog → Steam volumes → Atmospheric haze
 */
export default memo(function FogLayer() {
  const { currentScene } = useScene()
  const profile = useMemo(() => getSceneAtmosphere(currentScene.id), [currentScene.id])
  const strength = getFogStrength(profile)

  if (profile.fogDensity === 'none' && !profile.sewerSteam && !profile.urbanVapor) {
    return profile.humidity > 0 ? (
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: Z_INDEX.FOG }}>
        <AtmosphericHaze level={profile.humidity * 0.35} region={profile.region} zIndex={3} />
      </div>
    ) : null
  }

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: Z_INDEX.FOG }}>
      {profile.fogDensity !== 'none' && strength > 0 && (
        <SceneFog
          density={profile.fogDensity}
          variant={profile.fogVariant}
          region={profile.region}
          tint={profile.fogTint}
          windAngle={profile.rainWind}
          strength={strength}
          zIndex={1}
        />
      )}

      {(profile.sewerSteam || profile.urbanVapor || profile.industrialFog) && (
        <UrbanAtmosphere
          region={profile.region}
          sewerSteam={profile.sewerSteam}
          industrialFog={profile.industrialFog}
          urbanVapor={profile.urbanVapor}
          windAngle={profile.rainWind}
          zIndex={2}
        />
      )}

      <AtmosphericHaze level={profile.humidity} region={profile.region} zIndex={3} />
    </div>
  )
})
