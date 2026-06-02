/**
 * Sound architecture placeholder for Gotham Archives.
 * Ready for integration — no audio is played until explicitly enabled.
 */

export type SoundId = 'rain' | 'wind' | 'siren' | 'traffic' | 'thunder'

export interface SoundTrack {
  id: SoundId
  src: string
  loop: boolean
  volume: number
  fadeIn: number  // ms
  fadeOut: number // ms
}

export const soundTracks: SoundTrack[] = [
  { id: 'rain',    src: '/audio/rain-ambient.mp3',   loop: true,  volume: 0.35, fadeIn: 2000, fadeOut: 1500 },
  { id: 'wind',    src: '/audio/wind-distant.mp3',   loop: true,  volume: 0.2,  fadeIn: 3000, fadeOut: 2000 },
  { id: 'siren',   src: '/audio/siren-distant.mp3',  loop: false, volume: 0.15, fadeIn: 500,  fadeOut: 1000 },
  { id: 'traffic', src: '/audio/traffic-city.mp3',   loop: true,  volume: 0.1,  fadeIn: 2000, fadeOut: 2000 },
  { id: 'thunder', src: '/audio/thunder.mp3',         loop: false, volume: 0.4,  fadeIn: 0,    fadeOut: 0    },
]

// TODO: Implement SoundManager class using Web Audio API
// - AudioContext with gain nodes per track
// - Fade in/out via GainNode.gain.linearRampToValueAtTime
// - Master volume control
// - User gesture requirement handling (autoplay policy)
// - Persistent user preference (muted/unmuted)
export class SoundManager {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  play(_id: SoundId): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stop(_id: SoundId): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMaster(_volume: number): void {}
}

export const soundManager = new SoundManager()

// ─── Investigation Sound Events ───────────────────────────────────────────────
// Event architecture — no audio implemented yet.
// Wire these to SoundManager or a Web Audio API player when ready.

export type InvestigationSoundEvent =
  | 'onEvidenceFound'    // brief chime / paper shuffle
  | 'onFileUnlocked'     // cinematic sting
  | 'onSceneEnter'       // ambient layer crossfade
  | 'onSceneLeave'       // ambient fade out
  | 'onClearanceUpgrade' // authority notification sound

export interface InvestigationSoundConfig {
  event:  InvestigationSoundEvent
  src:    string           // audio file path (not yet present)
  volume: number
  delay:  number           // ms offset from event trigger
}

export const investigationSoundConfig: InvestigationSoundConfig[] = [
  { event: 'onEvidenceFound',    src: '/audio/evidence-found.mp3',    volume: 0.5, delay: 0    },
  { event: 'onFileUnlocked',     src: '/audio/file-unlocked.mp3',     volume: 0.6, delay: 300  },
  { event: 'onSceneEnter',       src: '/audio/scene-enter.mp3',       volume: 0.3, delay: 0    },
  { event: 'onSceneLeave',       src: '/audio/scene-leave.mp3',       volume: 0.3, delay: 0    },
  { event: 'onClearanceUpgrade', src: '/audio/clearance-upgrade.mp3', volume: 0.7, delay: 500  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const triggerInvestigationSound = (_event: InvestigationSoundEvent): void => {
  // TODO: Resolve config, load audio file, play via soundManager / Web Audio API
}
