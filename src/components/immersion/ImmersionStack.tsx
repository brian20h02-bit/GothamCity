import FogLayer from '@/components/atmosphere/FogLayer'
import AtmosphereLayer from '@/components/atmosphere/AtmosphereLayer'
import WetGlassEffect from '@/components/atmosphere/WetGlassEffect'
import SceneRenderer from '@/core/scenes/SceneRenderer'

/** @deprecated Use SceneRenderer + FogLayer + AtmosphereLayer + WetGlassEffect */
export default function ImmersionStack() {
  return (
    <>
      <SceneRenderer />
      <FogLayer />
      <AtmosphereLayer />
      <WetGlassEffect />
    </>
  )
}
