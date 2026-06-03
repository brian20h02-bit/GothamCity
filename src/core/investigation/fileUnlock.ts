import {
  detectiveEvidenceList,
  type DetectiveEvidence,
} from '@/data/detectiveEvidence'
import { investigationFiles, getFileById, type InvestigationFile } from '@/data/investigationFiles'

export const DEFAULT_UNLOCKED_FILES = ['crime-alley-inv']

export function countEvidenceForFile(fileId: string, foundIds: string[]): number {
  return detectiveEvidenceList.filter(
    e => e.caseFileId === fileId && foundIds.includes(e.id),
  ).length
}

export function tryUnlockNextFiles(
  foundIds: string[],
  unlockedIds: string[],
): { unlockedFileIds: string[]; newFile: InvestigationFile | null } {
  let ids = [...new Set(unlockedIds)]
  let newFile: InvestigationFile | null = null

  for (const file of investigationFiles) {
    if (!ids.includes(file.id) || !file.unlocksFileId) continue
    if (ids.includes(file.unlocksFileId)) continue

    if (countEvidenceForFile(file.id, foundIds) >= file.evidenceRequired) {
      ids = [...ids, file.unlocksFileId]
      newFile = getFileById(file.unlocksFileId) ?? null
    }
  }

  return { unlockedFileIds: ids, newFile }
}

export function getParentFileForEvidence(evidence: DetectiveEvidence): InvestigationFile | undefined {
  return investigationFiles.find(f => f.id === evidence.caseFileId)
}
