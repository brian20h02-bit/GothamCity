import { immersionAudio } from './ImmersionAudioEngine'

export type DetectiveSoundEvent =
  | 'modeOn'
  | 'modeOff'
  | 'scan'
  | 'evidenceFound'

export function emitDetectiveSound(event: DetectiveSoundEvent): void {
  switch (event) {
    case 'modeOn':
      immersionAudio.playDetectiveActivate()
      immersionAudio.setDetectiveMode(true)
      break
    case 'modeOff':
      immersionAudio.playDetectiveDeactivate()
      immersionAudio.setDetectiveMode(false)
      break
    case 'scan':
      immersionAudio.setDetectiveMode(true)
      break
    case 'evidenceFound':
      break
  }
}
