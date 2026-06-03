import type { SceneId } from '@/core/navigation/types'

/** Escenarios principales — disparan murciélagos al ingresar */
export const MAIN_HUB_SCENES: readonly SceneId[] = [
  'crime-alley',
  'crime-alley-investigation',
  'arkham-entrada',
  'wayne-exterior',
  'batcomputer',
] as const

export function isMainHubScene(sceneId: SceneId): boolean {
  return (MAIN_HUB_SCENES as readonly string[]).includes(sceneId)
}
