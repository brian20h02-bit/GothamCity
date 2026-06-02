// @refresh reset
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import type { ReactNode } from 'react'
import { allEvidence, getEvidenceById, getEvidenceByScene, TOTAL_EVIDENCE } from '@/data/evidence'
import { investigationFiles, getFileById } from '@/data/investigationFiles'
import type { Evidence } from '@/data/evidence'
import type { InvestigationFile } from '@/data/investigationFiles'

// ─── Sound event architecture (no audio yet) ─────────────────────────────────
export type InvestigationSoundEvent =
  | 'onEvidenceFound'
  | 'onFileUnlocked'
  | 'onSceneEnter'
  | 'onSceneLeave'
  | 'onClearanceUpgrade'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const emitInvestigationSound = (_event: InvestigationSoundEvent): void => {
  // TODO: wire to audio system when implemented
}

// ─── State ────────────────────────────────────────────────────────────────────
interface InvestigationState {
  foundEvidenceIds:  string[]
  unlockedFileIds:   string[]
  pendingEvidence:   Evidence | null
  pendingFile:       InvestigationFile | null
}

type Action =
  | { type: 'DISCOVER_EVIDENCE'; evidenceId: string; evidence: Evidence; unlockedFileIds: string[]; newFile: InvestigationFile | null }
  | { type: 'DISMISS_EVIDENCE_NOTIFICATION' }
  | { type: 'DISMISS_FILE_NOTIFICATION' }
  | { type: 'RESET' }

function reducer(state: InvestigationState, action: Action): InvestigationState {
  switch (action.type) {
    case 'DISCOVER_EVIDENCE':
      return {
        ...state,
        foundEvidenceIds:  [...state.foundEvidenceIds, action.evidenceId],
        unlockedFileIds:   action.unlockedFileIds,
        pendingEvidence:   action.evidence,
        pendingFile:       action.newFile,
      }
    case 'DISMISS_EVIDENCE_NOTIFICATION':
      return { ...state, pendingEvidence: null }
    case 'DISMISS_FILE_NOTIFICATION':
      return { ...state, pendingFile: null }
    case 'RESET':
      return initialState()
    default:
      return state
  }
}

// ─── localStorage ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'gotham-investigation-v1'

/** Arkham + Wayne activos desde el inicio (FASE 8) */
const DEFAULT_UNLOCKED_FILES = ['crime-alley-inv', 'arkham-inv', 'wayne-tower-inv']

function loadPersistedState(): Pick<InvestigationState, 'foundEvidenceIds' | 'unlockedFileIds'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<InvestigationState>
      const saved = Array.isArray(parsed.unlockedFileIds) ? parsed.unlockedFileIds : []
      return {
        foundEvidenceIds: Array.isArray(parsed.foundEvidenceIds) ? parsed.foundEvidenceIds : [],
        unlockedFileIds:  [...new Set([...DEFAULT_UNLOCKED_FILES, ...saved])],
      }
    }
  } catch { /* ignore */ }
  return { foundEvidenceIds: [], unlockedFileIds: DEFAULT_UNLOCKED_FILES }
}

function initialState(): InvestigationState {
  return {
    ...loadPersistedState(),
    pendingEvidence: null,
    pendingFile:     null,
  }
}

// ─── Derived helpers ──────────────────────────────────────────────────────────
function computeClearanceLevel(unlockedFileIds: string[]): number {
  return Math.min(unlockedFileIds.length, 5)
}

function computeProgress(foundEvidenceIds: string[]): number {
  return Math.round((foundEvidenceIds.length / TOTAL_EVIDENCE) * 100)
}

// ─── Context value type ───────────────────────────────────────────────────────
interface InvestigationContextValue {
  // State
  foundEvidenceIds:  string[]
  unlockedFileIds:   string[]
  pendingEvidence:   Evidence | null
  pendingFile:       InvestigationFile | null

  // Derived
  clearanceLevel:    number
  progress:          number
  foundCount:        number
  totalCount:        number

  // Actions
  discoverEvidence:           (id: string) => void
  dismissEvidenceNotification: () => void
  dismissFileNotification:     () => void
  resetInvestigation:          () => void

  // Helpers
  isEvidenceFound:    (id: string)   => boolean
  isFileUnlocked:     (fileId: string) => boolean
  getFoundForScene:   (sceneId: string) => Evidence[]

  // Reference data
  allEvidence:        typeof allEvidence
  investigationFiles: typeof investigationFiles
}

// ─── Context ──────────────────────────────────────────────────────────────────
const InvestigationContext = createContext<InvestigationContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function InvestigationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  // Persist to localStorage on state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      foundEvidenceIds: state.foundEvidenceIds,
      unlockedFileIds:  state.unlockedFileIds,
    }))
  }, [state.foundEvidenceIds, state.unlockedFileIds])

  const discoverEvidence = useCallback((id: string) => {
    if (state.foundEvidenceIds.includes(id)) return
    const evidence = getEvidenceById(id)
    if (!evidence) return

    const newFoundIds = [...state.foundEvidenceIds, id]
    let newUnlockedIds = [...state.unlockedFileIds]
    let newFile: InvestigationFile | null = null

    const parentFile = investigationFiles.find(f => {
      if (f.sceneId === evidence.scene) return true
      if (f.id === 'arkham-inv' && evidence.scene.startsWith('arkham')) return true
      if (f.id === 'wayne-tower-inv' && evidence.scene === 'wayne-despacho') return true
      return false
    })
    if (parentFile?.unlocksFileId) {
      const sceneEvidence = getEvidenceByScene(evidence.scene)
      const foundInScene  = sceneEvidence.filter(e => newFoundIds.includes(e.id))

      if (
        foundInScene.length >= parentFile.evidenceRequired &&
        !newUnlockedIds.includes(parentFile.unlocksFileId)
      ) {
        newUnlockedIds = [...newUnlockedIds, parentFile.unlocksFileId]
        newFile = getFileById(parentFile.unlocksFileId) ?? null
        emitInvestigationSound('onFileUnlocked')
        emitInvestigationSound('onClearanceUpgrade')
      }
    }

    emitInvestigationSound('onEvidenceFound')
    dispatch({
      type:            'DISCOVER_EVIDENCE',
      evidenceId:      id,
      evidence,
      unlockedFileIds: newUnlockedIds,
      newFile,
    })
  }, [state.foundEvidenceIds, state.unlockedFileIds])

  const dismissEvidenceNotification = useCallback(() => {
    dispatch({ type: 'DISMISS_EVIDENCE_NOTIFICATION' })
  }, [])

  const dismissFileNotification = useCallback(() => {
    dispatch({ type: 'DISMISS_FILE_NOTIFICATION' })
  }, [])

  const resetInvestigation = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    dispatch({ type: 'RESET' })
  }, [])

  const value: InvestigationContextValue = {
    foundEvidenceIds:  state.foundEvidenceIds,
    unlockedFileIds:   state.unlockedFileIds,
    pendingEvidence:   state.pendingEvidence,
    pendingFile:       state.pendingFile,

    clearanceLevel:    computeClearanceLevel(state.unlockedFileIds),
    progress:          computeProgress(state.foundEvidenceIds),
    foundCount:        state.foundEvidenceIds.length,
    totalCount:        TOTAL_EVIDENCE,

    discoverEvidence,
    dismissEvidenceNotification,
    dismissFileNotification,
    resetInvestigation,

    isEvidenceFound:  (id)     => state.foundEvidenceIds.includes(id),
    isFileUnlocked:   (fileId) => state.unlockedFileIds.includes(fileId),
    getFoundForScene: (sceneId) => getEvidenceByScene(sceneId).filter(e => state.foundEvidenceIds.includes(e.id)),

    allEvidence,
    investigationFiles,
  }

  return (
    <InvestigationContext.Provider value={value}>
      {children}
    </InvestigationContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useInvestigation(): InvestigationContextValue {
  const ctx = useContext(InvestigationContext)
  if (!ctx) throw new Error('useInvestigation must be used inside <InvestigationProvider>')
  return ctx
}
