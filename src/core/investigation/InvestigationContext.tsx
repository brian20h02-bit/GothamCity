// @refresh reset
import type { ReactNode } from 'react'
import { useDetective } from '@/core/detective/DetectiveContext'
import {
  getDetectiveEvidenceByScene,
} from '@/data/detectiveEvidence'
import { investigationFiles } from '@/data/investigationFiles'
import { allEvidence, TOTAL_EVIDENCE } from '@/data/evidence'
import type { Evidence } from '@/data/evidence'
import type { InvestigationFile } from '@/data/investigationFiles'

export type InvestigationSoundEvent =
  | 'onEvidenceFound'
  | 'onFileUnlocked'
  | 'onSceneEnter'
  | 'onSceneLeave'
  | 'onClearanceUpgrade'

export const emitInvestigationSound = (_event: InvestigationSoundEvent): void => {}

interface InvestigationContextValue {
  foundEvidenceIds:            string[]
  unlockedFileIds:             string[]
  pendingEvidence:             Evidence | null
  pendingFile:                 InvestigationFile | null
  clearanceLevel:              number
  progress:                    number
  foundCount:                  number
  totalCount:                  number
  discoverEvidence:            (id: string) => void
  dismissEvidenceNotification: () => void
  dismissFileNotification:     () => void
  resetInvestigation:          () => void
  isEvidenceFound:             (id: string) => boolean
  isFileUnlocked:              (fileId: string) => boolean
  getFoundForScene:            (sceneId: string) => Evidence[]
  allEvidence:                 typeof allEvidence
  investigationFiles:          typeof investigationFiles
}


/** Facade sobre DetectiveContext — una sola fuente de evidencias */
export function InvestigationProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function useInvestigation(): InvestigationContextValue {
  const d = useDetective()
  const progress = Math.round((d.foundCount / TOTAL_EVIDENCE) * 100)

  return {
    foundEvidenceIds: d.foundEvidenceIds,
    unlockedFileIds:  d.unlockedFileIds,
    pendingEvidence:  d.pendingEvidence
      ? {
          id:          d.pendingEvidence.id,
          title:       d.pendingEvidence.title,
          description: d.pendingEvidence.description,
          detail:      d.pendingEvidence.detail ?? d.pendingEvidence.description,
          scene:       d.pendingEvidence.sceneId,
        }
      : null,
    pendingFile:      d.pendingFile,
    clearanceLevel:   d.clearanceLevel,
    progress,
    foundCount:       d.foundCount,
    totalCount:       TOTAL_EVIDENCE,
    discoverEvidence: d.discoverEvidence,
    dismissEvidenceNotification: d.dismissEvidence,
    dismissFileNotification:     d.dismissFile,
    resetInvestigation:          d.resetInvestigation,
    isEvidenceFound:             d.isEvidenceFound,
    isFileUnlocked:              d.isFileUnlocked,
    getFoundForScene: (sceneId) =>
      getDetectiveEvidenceByScene(sceneId)
        .filter(e => d.foundEvidenceIds.includes(e.id))
        .map(e => ({
          id:          e.id,
          title:       e.title,
          description: e.description,
          detail:      e.detail ?? e.description,
          scene:       e.sceneId,
        })),
    allEvidence,
    investigationFiles,
  }
}
