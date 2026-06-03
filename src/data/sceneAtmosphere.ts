import type { SceneId } from '@/core/navigation/types'
import type { ParticleMode } from '@/components/immersion/AmbientParticles'

export type AtmosphereRegion =
  | 'gotham'
  | 'crime-alley'
  | 'arkham'
  | 'wayne'
  | 'batcomputer'
  | 'narrows'
  | 'archives'

export type FogDensity = 'none' | 'light' | 'medium' | 'dense' | 'industrial'
export type FogVariant = 'urban' | 'cold' | 'industrial' | 'minimal'

export interface SceneAtmosphereProfile {
  region:           AtmosphereRegion
  rainIntensity:    number
  rainWind:         number
  fogDensity:       FogDensity
  fogStrength:      number   // multiplier 1–2
  fogTint:          string
  fogVariant:       FogVariant
  lightning:        boolean
  lightningRate:    number
  humidity:         number
  windowRain:       boolean  // legacy alias — ver isWetGlassEnabled()
  sewerSteam:       boolean
  industrialFog:    boolean
  urbanVapor:       boolean
  lampFlicker:      boolean
  windowGlow:       boolean
  screenPulse:      boolean
  dimLevel:         number
  cameraDrift:      number
  parallaxStrength: number
  ambientVolume:    number
  rainVolume:       number
  windVolume:       number   // wind-howl 0–1 (Arkham interior)
  particleMode:     ParticleMode
}

const ARKHAM_EXTERIOR_SCENES: SceneId[] = [
  'arkham-entrada',
  'arkham-fachada',
  'arkham-investigation',
]

export function isArkhamExteriorScene(sceneId: SceneId): boolean {
  return (ARKHAM_EXTERIOR_SCENES as readonly string[]).includes(sceneId)
}

export function isArkhamInteriorScene(sceneId: SceneId): boolean {
  return sceneId.startsWith('arkham') && !isArkhamExteriorScene(sceneId)
}

/** Atrio en adelante — sin lluvia, solo wind-howl */
export function isArkhamWindHowlScene(sceneId: SceneId): boolean {
  return isArkhamInteriorScene(sceneId)
}

/** Escenas bajo techo — Wet Glass OFF */
const INDOOR_SCENES: readonly SceneId[] = [
  'arkham-atrio',
  'arkham-puertas',
  'arkham-intensivo',
  'arkham-lunatico',
  'wayne-lobby',
  'wayne-sala',
  'wayne-despacho',
  'batcomputer',
  'batcomputer-control',
  'the-archives',
]

export function isIndoorScene(sceneId: SceneId): boolean {
  return (INDOOR_SCENES as readonly string[]).includes(sceneId)
}

/** Cristal mojado — solo exteriores al aire libre */
export function isWetGlassEnabled(sceneId: SceneId): boolean {
  if (isIndoorScene(sceneId)) return false
  if (sceneId.startsWith('batcomputer')) return false
  if (sceneId.startsWith('wayne') && sceneId !== 'wayne-exterior') return false
  if (isArkhamInteriorScene(sceneId)) return false
  return true
}

const DEFAULT: SceneAtmosphereProfile = {
  region: 'gotham',
  rainIntensity: 0.78,
  rainWind: 0.26,
  fogDensity: 'medium',
  fogStrength: 0.82,
  fogTint: '44,44,46',
  fogVariant: 'urban',
  lightning: true,
  lightningRate: 0.8,
  humidity: 0.5,
  windowRain: true,
  sewerSteam: false,
  industrialFog: false,
  urbanVapor: true,
  lampFlicker: true,
  windowGlow: true,
  screenPulse: false,
  dimLevel: 0,
  cameraDrift: 2,
  parallaxStrength: 1,
  ambientVolume: 0.55,
  rainVolume: 0.72,
  windVolume: 0,
  particleMode: 'none',
}

const PROFILES: Record<AtmosphereRegion, SceneAtmosphereProfile> = {
  gotham: {
    ...DEFAULT,
    rainIntensity: 0.82,
    rainWind: 0.28,
    fogDensity: 'medium',
    fogStrength: 0.78,
    fogTint: '44,44,46',
    fogVariant: 'urban',
    windowRain: true,
    ambientVolume: 0.58,
    rainVolume: 0.75,
    windVolume: 0,
    particleMode: 'none',
  },
  'crime-alley': {
    ...DEFAULT,
    region: 'crime-alley',
    rainIntensity: 0.92,
    rainWind: 0.32,
    fogDensity: 'dense',
    fogStrength: 1.05,
    fogTint: '40,40,42',
    fogVariant: 'cold',
    lightning: true,
    lightningRate: 0.75,
    humidity: 0.72,
    windowRain: true,
    sewerSteam: true,
    urbanVapor: true,
    lampFlicker: true,
    windowGlow: false,
    cameraDrift: 2.5,
    ambientVolume: 0.62,
    rainVolume: 0.85,
    windVolume: 0,
    particleMode: 'crime-alley',
  },
  arkham: {
    ...DEFAULT,
    region: 'arkham',
    rainIntensity: 0.84,
    rainWind: 0.3,
    fogDensity: 'dense',
    fogStrength: 0.95,
    fogTint: '40,40,42',
    fogVariant: 'cold',
    lightning: true,
    lightningRate: 0.7,
    humidity: 0.82,
    windowRain: true,
    sewerSteam: false,
    industrialFog: false,
    urbanVapor: false,
    lampFlicker: true,
    windowGlow: false,
    cameraDrift: 2.5,
    ambientVolume: 0.58,
    rainVolume: 0.72,
    windVolume: 0,
    particleMode: 'arkham',
  },
  wayne: {
    ...DEFAULT,
    region: 'wayne',
    rainIntensity: 0.32,
    fogDensity: 'light',
    fogStrength: 0.72,
    fogTint: '50,55,62',
    fogVariant: 'minimal',
    lightning: false,
    humidity: 0.35,
    windowRain: true,
    sewerSteam: false,
    urbanVapor: false,
    lampFlicker: true,
    windowGlow: true,
    dimLevel: 0.35,
    cameraDrift: 1.2,
    parallaxStrength: 0.7,
    ambientVolume: 0.28,
    rainVolume: 0.35,
    particleMode: 'wayne',
  },
  batcomputer: {
    ...DEFAULT,
    region: 'batcomputer',
    rainIntensity: 0,
    fogDensity: 'none',
    fogStrength: 0,
    fogVariant: 'minimal',
    lightning: false,
    humidity: 0,
    windowRain: false,
    sewerSteam: false,
    urbanVapor: false,
    industrialFog: false,
    lampFlicker: false,
    windowGlow: false,
    screenPulse: true,
    dimLevel: 0.15,
    cameraDrift: 0.8,
    parallaxStrength: 0.35,
    ambientVolume: 0.38,
    rainVolume: 0,
    particleMode: 'batcomputer',
  },
  narrows: {
    ...DEFAULT,
    region: 'narrows',
    rainIntensity: 0.9,
    rainWind: 0.44,
    fogDensity: 'dense',
    fogStrength: 1.12,
    fogTint: '38,38,40',
    fogVariant: 'industrial',
    lightning: false,
    humidity: 0.78,
    windowRain: true,
    sewerSteam: true,
    industrialFog: true,
    urbanVapor: true,
    lampFlicker: true,
    windowGlow: false,
    cameraDrift: 3,
    ambientVolume: 0.65,
    rainVolume: 0.88,
    particleMode: 'narrows',
  },
  archives: {
    ...DEFAULT,
    region: 'archives',
    rainIntensity: 0.35,
    fogDensity: 'medium',
    fogStrength: 1.5,
    humidity: 0.45,
    windowRain: true,
    urbanVapor: false,
    cameraDrift: 1,
    ambientVolume: 0.45,
    rainVolume: 0.55,
    particleMode: 'none',
  },
}

function sceneToRegion(sceneId: SceneId): AtmosphereRegion {
  if (sceneId === 'the-archives') return 'archives'
  if (sceneId.startsWith('crime-alley') || sceneId === 'the-incident') return 'crime-alley'
  if (sceneId.startsWith('arkham')) return 'arkham'
  if (sceneId.startsWith('wayne')) return 'wayne'
  if (sceneId.startsWith('batcomputer')) return 'batcomputer'
  if (sceneId.startsWith('narrows')) return 'narrows'
  return 'gotham'
}

export function getSceneAtmosphere(sceneId: SceneId): SceneAtmosphereProfile {
  const region = sceneToRegion(sceneId)
  const base = { ...PROFILES[region] }

  if (isArkhamExteriorScene(sceneId)) {
    return {
      ...base,
      rainIntensity: 0.88,
      rainWind: 0.34,
      humidity: 0.78,
      windowRain: true,
      rainVolume: 0.72,
      windVolume: 0,
      ambientVolume: 0.58,
      particleMode: 'arkham' as ParticleMode,
    }
  }

  if (isArkhamInteriorScene(sceneId)) {
    return {
      ...base,
      rainIntensity: 0,
      fogDensity: 'medium',
      fogStrength: 1.65,
      fogVariant: 'cold' as FogVariant,
      humidity: 0.88,
      windowRain: false,
      rainVolume: 0,
      windVolume: 0.6,
      ambientVolume: 1,
      industrialFog: false,
      sewerSteam: false,
      urbanVapor: false,
      particleMode: 'arkham' as ParticleMode,
    }
  }

  return base
}

/** Densidad de niebla — valores contenidos, sin capa opaca global */
export function getFogStrength(profile: SceneAtmosphereProfile): number {
  if (profile.fogDensity === 'none' || profile.region === 'batcomputer') return 0

  let mult = profile.fogStrength
  if (profile.region === 'crime-alley') mult *= 1.18
  else if (profile.region === 'narrows') mult *= 1.22
  else if (profile.region === 'wayne') mult *= 0.55
  else if (profile.region === 'arkham') mult *= 0.95

  if (profile.fogDensity === 'dense') mult *= 1.05
  if (profile.fogDensity === 'light') mult *= 0.8

  return Math.min(1.35, mult)
}

/** @deprecated Use getFogStrength */
export const getStormFogStrength = getFogStrength

/** Perfil para la intro cinematográfica */
export function getIntroAtmosphere(): SceneAtmosphereProfile {
  return {
    ...PROFILES.gotham,
    rainIntensity: 0.75,
    fogDensity: 'dense',
    fogStrength: 0.9,
    fogTint: '44,44,46',
    fogVariant: 'urban',
    humidity: 0.7,
    windowRain: true,
    rainVolume: 0.82,
    ambientVolume: 0.65,
    windVolume: 0,
    particleMode: 'none',
  }
}
