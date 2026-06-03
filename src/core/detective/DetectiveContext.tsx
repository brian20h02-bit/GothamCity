// @refresh reset
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import {
  DETECTIVE_EVIDENCE_TOTAL,
  detectiveEvidenceList,
  getDetectiveEvidenceById,
  getDetectiveEvidenceByScene,
  type DetectiveEvidence,
} from '@/data/detectiveEvidence'
import {
  getInvestigationByScene,
  sceneInvestigations,
  type SceneInvestigation,
} from '@/data/sceneInvestigations'
import type { SceneId } from '@/core/navigation/types'
import {
  computeCaseCompletion,
  computeMainInvestigationCompletion,
  getGlobalObjective,
} from '@/core/detective/caseCompletion'
import {
  getNextTrailStep,
  isInvestigationComplete,
} from '@/core/detective/investigationTrail'
import {
  DEFAULT_UNLOCKED_FILES,
  tryUnlockNextFiles,
} from '@/core/investigation/fileUnlock'
import type { InvestigationFile } from '@/data/investigationFiles'
import { STORAGE_KEY, purgeLegacyProgress, resetAllProgress } from '@/core/persistence/progressStorage'
import { emitDetectiveSound } from '@/sound/detectiveSounds'

purgeLegacyProgress()
const SCAN_WAVE_MS = 2000
const SCAN_MESSAGE_MS = 10000
const NO_EVIDENCE_MS = 7000
const ACTIVATION_MS = 480

export type ScanPhase = 'idle' | 'wave' | 'message' | 'no_evidence'

export type { DetectiveSoundEvent } from '@/sound/detectiveSounds'
export { emitDetectiveSound } from '@/sound/detectiveSounds'

const EXPLORABLE_SCENES: SceneId[] = [
  'gotham-city', 'crime-alley', 'the-incident',
  'crime-alley-investigation', 'narrows-investigation',
  'arkham-entrada', 'arkham-fachada', 'arkham-atrio', 'arkham-puertas', 'arkham-intensivo', 'arkham-lunatico',
  'wayne-exterior', 'wayne-lobby', 'wayne-sala', 'wayne-despacho',
  'batcomputer', 'batcomputer-control',
]

interface DetectiveState {
  active:                    boolean
  activating:                boolean
  scanWave:                  boolean
  scanPhase:                 ScanPhase
  scanRevealUntil:           number
  scanCompletedScenes:       string[]
  activeScanSceneId:         SceneId | null
  scanHypothesis:            { title: string; lines: string[]; noEvidence?: boolean } | null
  foundEvidenceIds:          string[]
  exploredSceneIds:          string[]
  trailProgress:             Record<string, string[]>
  concludedInvestigations:   string[]
  batcomputerAccessRevealed: boolean
  unlockedFileIds:           string[]
  pendingEvidence:           DetectiveEvidence | null
  pendingFile:               InvestigationFile | null
  milestone50Shown:          boolean
  milestone100Shown:         boolean
}

type Action =
  | { type: 'TOGGLE' }
  | { type: 'ACTIVATION_DONE' }
  | { type: 'SCAN_START'; investigation: SceneInvestigation | null; sceneId: SceneId }
  | { type: 'SCAN_WAVE_DONE' }
  | { type: 'SCAN_MESSAGE'; payload: { title: string; lines: string[]; noEvidence?: boolean }; sceneId: string }
  | { type: 'SCAN_MESSAGE_END' }
  | { type: 'SCAN_NO_EVIDENCE_END' }
  | { type: 'DISCOVER'; evidence: DetectiveEvidence }
  | { type: 'DISMISS_EVIDENCE' }
  | { type: 'DISMISS_FILE' }
  | { type: 'RESET' }
  | { type: 'VISIT_TRAIL'; investigationId: string; stepId: string }
  | { type: 'CONCLUDE_INVESTIGATION'; investigationId: string }
  | { type: 'REVEAL_BATCOMPUTER' }
  | { type: 'EXPLORE'; sceneId: SceneId }
  | { type: 'MILESTONE_50' }
  | { type: 'MILESTONE_100' }
  | { type: 'FORCE_OFF' }
  | { type: 'HYDRATE'; payload: Partial<DetectiveState> }

function loadUnlockedFileIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw) as { unlockedFileIds?: string[] }
      if (Array.isArray(p.unlockedFileIds) && p.unlockedFileIds.length > 0) {
        return [...new Set([...DEFAULT_UNLOCKED_FILES, ...p.unlockedFileIds])]
      }
    }
  } catch { /* ignore */ }
  return DEFAULT_UNLOCKED_FILES
}

function loadPersisted(): Pick<
  DetectiveState,
  | 'foundEvidenceIds'
  | 'exploredSceneIds'
  | 'trailProgress'
  | 'concludedInvestigations'
  | 'batcomputerAccessRevealed'
  | 'scanCompletedScenes'
  | 'milestone50Shown'
  | 'milestone100Shown'
  | 'unlockedFileIds'
> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw) as Partial<DetectiveState>
      return {
        foundEvidenceIds:          Array.isArray(p.foundEvidenceIds) ? p.foundEvidenceIds : [],
        exploredSceneIds:          Array.isArray(p.exploredSceneIds) ? p.exploredSceneIds : [],
        trailProgress:             p.trailProgress && typeof p.trailProgress === 'object' ? p.trailProgress : {},
        concludedInvestigations:   Array.isArray(p.concludedInvestigations) ? p.concludedInvestigations : [],
        batcomputerAccessRevealed: !!p.batcomputerAccessRevealed,
        scanCompletedScenes:       Array.isArray(p.scanCompletedScenes) ? p.scanCompletedScenes : [],
        milestone50Shown:          !!p.milestone50Shown,
        milestone100Shown:         !!p.milestone100Shown,
        unlockedFileIds:           loadUnlockedFileIds(),
      }
    }
  } catch { /* ignore */ }
  return {
    foundEvidenceIds: [],
    exploredSceneIds: [],
    trailProgress: {},
    concludedInvestigations: [],
    batcomputerAccessRevealed: false,
    scanCompletedScenes: [],
    milestone50Shown: false,
    milestone100Shown: false,
    unlockedFileIds: DEFAULT_UNLOCKED_FILES,
  }
}

function initialState(): DetectiveState {
  return {
    active: false,
    activating: false,
    scanWave: false,
    scanPhase: 'idle',
    scanRevealUntil: 0,
    scanHypothesis: null,
    activeScanSceneId: null,
    pendingEvidence: null,
    pendingFile: null,
    ...loadPersisted(),
  }
}

function discoverIfNew(state: DetectiveState, evidence: DetectiveEvidence): DetectiveState {
  if (state.foundEvidenceIds.includes(evidence.id)) return state
  const newFound = [...state.foundEvidenceIds, evidence.id]
  const { unlockedFileIds, newFile } = tryUnlockNextFiles(newFound, state.unlockedFileIds)
  emitDetectiveSound('evidenceFound')
  return {
    ...state,
    foundEvidenceIds: newFound,
    unlockedFileIds,
    pendingEvidence: evidence,
    pendingFile: newFile,
  }
}

function reducer(state: DetectiveState, action: Action): DetectiveState {
  switch (action.type) {
    case 'TOGGLE':
      if (state.activating) return state
      if (state.active) {
        emitDetectiveSound('modeOff')
        return {
          ...state,
          active: false,
          activating: false,
          scanPhase: 'idle',
          scanWave: false,
          scanHypothesis: null,
          scanRevealUntil: 0,
          activeScanSceneId: null,
        }
      }
      emitDetectiveSound('modeOn')
      return { ...state, active: true, activating: true }
    case 'ACTIVATION_DONE':
      return { ...state, activating: false }
    case 'SCAN_START':
      if (!state.active || state.scanWave) return state
      emitDetectiveSound('scan')
      return {
        ...state,
        scanWave: true,
        scanPhase: 'wave',
        scanHypothesis: null,
        activeScanSceneId: action.sceneId,
      }
    case 'SCAN_WAVE_DONE':
      return { ...state, scanWave: false }
    case 'SCAN_MESSAGE':
      return {
        ...state,
        scanPhase: action.payload.noEvidence ? 'no_evidence' : 'message',
        scanHypothesis: action.payload,
        scanRevealUntil: Date.now() + (action.payload.noEvidence ? NO_EVIDENCE_MS : SCAN_MESSAGE_MS),
        scanCompletedScenes: action.payload.noEvidence
          ? state.scanCompletedScenes
          : state.scanCompletedScenes.includes(action.sceneId)
            ? state.scanCompletedScenes
            : [...state.scanCompletedScenes, action.sceneId],
      }
    case 'SCAN_MESSAGE_END':
      return {
        ...state,
        scanRevealUntil: 0,
        scanPhase: 'idle',
        scanHypothesis: null,
        activeScanSceneId: null,
      }
    case 'SCAN_NO_EVIDENCE_END':
      return {
        ...state,
        active: false,
        activating: false,
        scanWave: false,
        scanPhase: 'idle',
        scanRevealUntil: 0,
        scanHypothesis: null,
        activeScanSceneId: null,
      }
    case 'DISCOVER': {
      if (state.foundEvidenceIds.includes(action.evidence.id)) return state
      return discoverIfNew(state, action.evidence)
    }
    case 'DISMISS_EVIDENCE':
      return { ...state, pendingEvidence: null }
    case 'DISMISS_FILE':
      return { ...state, pendingFile: null }
    case 'RESET':
      resetAllProgress()
      return initialState()
    case 'VISIT_TRAIL': {
      const investigation = sceneInvestigations.find(i => i.id === action.investigationId)
      if (!investigation) return state

      const visited = [...(state.trailProgress[action.investigationId] ?? [])]
      if (visited.includes(action.stepId)) return state

      const next = getNextTrailStep(investigation, visited)
      if (next && next.id !== action.stepId) return state

      const newVisited = [...visited, action.stepId]
      let nextState: DetectiveState = {
        ...state,
        trailProgress: {
          ...state.trailProgress,
          [action.investigationId]: newVisited,
        },
      }

      const step = investigation.trail.find(s => s.id === action.stepId)
      if (step?.unlockEvidenceId) {
        const ev = getDetectiveEvidenceById(step.unlockEvidenceId)
        if (ev) nextState = discoverIfNew(nextState, ev)
      }

      if (isInvestigationComplete(investigation, newVisited)) {
        const primary = getDetectiveEvidenceById(investigation.evidenceId)
        if (primary) nextState = discoverIfNew(nextState, primary)
        if (investigation.revealsBatcomputerAccess) {
          nextState = { ...nextState, batcomputerAccessRevealed: true }
        }
        if (!nextState.concludedInvestigations.includes(action.investigationId)) {
          nextState = {
            ...nextState,
            concludedInvestigations: [...nextState.concludedInvestigations, action.investigationId],
          }
        }
      }
      return nextState
    }
    case 'CONCLUDE_INVESTIGATION': {
      const investigation = sceneInvestigations.find(i => i.id === action.investigationId)
      if (!investigation) return state
      const primary = getDetectiveEvidenceById(investigation.evidenceId)
      let nextState = state
      if (primary) nextState = discoverIfNew(nextState, primary)
      if (investigation.revealsBatcomputerAccess) {
        nextState = { ...nextState, batcomputerAccessRevealed: true }
      }
      return {
        ...nextState,
        concludedInvestigations: nextState.concludedInvestigations.includes(action.investigationId)
          ? nextState.concludedInvestigations
          : [...nextState.concludedInvestigations, action.investigationId],
      }
    }
    case 'REVEAL_BATCOMPUTER':
      return { ...state, batcomputerAccessRevealed: true }
    case 'EXPLORE':
      if (state.exploredSceneIds.includes(action.sceneId)) return state
      return { ...state, exploredSceneIds: [...state.exploredSceneIds, action.sceneId] }
    case 'MILESTONE_50':
      return { ...state, milestone50Shown: true }
    case 'MILESTONE_100':
      return { ...state, milestone100Shown: true }
    case 'FORCE_OFF':
      return {
        ...state,
        active: false,
        activating: false,
        scanWave: false,
        scanPhase: 'idle',
        scanRevealUntil: 0,
        scanHypothesis: null,
        activeScanSceneId: null,
      }
    case 'HYDRATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

function computeLegacyCompletion(
  found: number,
  explored: number,
  unlockedFiles: number,
): number {
  const evidencePct = (found / DETECTIVE_EVIDENCE_TOTAL) * 60
  const locPct = (explored / EXPLORABLE_SCENES.length) * 25
  const filePct = (Math.min(unlockedFiles, 5) / 5) * 15
  return Math.min(100, Math.round(evidencePct + locPct + filePct))
}

interface DetectiveContextValue {
  active:                      boolean
  activating:                  boolean
  scanWave:                    boolean
  scanPhase:                   ScanPhase
  scanMessageActive:           boolean
  scanRevealActive:            boolean
  scanHypothesis:              { title: string; lines: string[]; noEvidence?: boolean } | null
  foundEvidenceIds:            string[]
  exploredSceneIds:            string[]
  trailProgress:               Record<string, string[]>
  pendingEvidence:             DetectiveEvidence | null
  pendingFile:                 InvestigationFile | null
  unlockedFileIds:             string[]
  clearanceLevel:              number
  foundCount:                  number
  totalCount:                  number
  investigationCompletion:     number
  arkhamCaseCompletion:        number
  wayneCaseCompletion:         number
  mainInvestigationCompletion: number
  getObjectiveForScene:        (sceneId: string) => string
  batcomputerAccessRevealed:   boolean
  milestone50Shown:            boolean
  milestone100Shown:           boolean
  pendingMilestone:            '50' | '100' | null
  activeScanSceneId:           SceneId | null
  toggleDetectiveMode:         () => void
  deactivateDetectiveMode:     () => void
  triggerScan:                 (sceneId: string) => void
  discoverEvidence:            (id: string) => void
  visitTrailStep:              (investigationId: string, stepId: string) => void
  dismissEvidence:           () => void
  dismissFile:               () => void
  resetInvestigation:        () => void
  markSceneExplored:           (sceneId: SceneId) => void
  dismissMilestone:            () => void
  isFileUnlocked:              (fileId: string) => boolean
  isEvidenceFound:             (id: string) => boolean
  getSceneEvidence:            (sceneId: string) => DetectiveEvidence[]
  getSceneInvestigation:       (sceneId: string) => SceneInvestigation | undefined
  getTrailVisited:             (investigationId: string) => string[]
  hasScanCompletedForScene:    (sceneId: string) => boolean
  isInvestigationConcluded:    (investigationId: string) => boolean
  allEvidence:                 DetectiveEvidence[]
}

const DetectiveContext = createContext<DetectiveContextValue | null>(null)

export function DetectiveProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const activationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scanWaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pendingMilestone, setPendingMilestone] = useState<'50' | '100' | null>(null)
  const milestoneRef = useRef({ prev: 0 })
  const pendingScanInv = useRef<SceneInvestigation | null>(null)
  const pendingScanSceneId = useRef<SceneId | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      foundEvidenceIds:          state.foundEvidenceIds,
      exploredSceneIds:          state.exploredSceneIds,
      trailProgress:             state.trailProgress,
      concludedInvestigations:   state.concludedInvestigations,
      batcomputerAccessRevealed: state.batcomputerAccessRevealed,
      scanCompletedScenes:       state.scanCompletedScenes,
      milestone50Shown:          state.milestone50Shown,
      milestone100Shown:         state.milestone100Shown,
      unlockedFileIds:           state.unlockedFileIds,
    }))
  }, [
    state.foundEvidenceIds,
    state.exploredSceneIds,
    state.trailProgress,
    state.concludedInvestigations,
    state.batcomputerAccessRevealed,
    state.scanCompletedScenes,
    state.milestone50Shown,
    state.milestone100Shown,
    state.unlockedFileIds,
  ])

  useEffect(() => {
    if (state.activating) {
      activationTimer.current = setTimeout(() => dispatch({ type: 'ACTIVATION_DONE' }), ACTIVATION_MS)
      return () => { if (activationTimer.current) clearTimeout(activationTimer.current) }
    }
  }, [state.activating])

  useEffect(() => {
    if (state.scanWave) {
      scanWaveTimer.current = setTimeout(() => {
        dispatch({ type: 'SCAN_WAVE_DONE' })
        const sceneId = pendingScanSceneId.current
        if (!sceneId) return

        const unfound = getDetectiveEvidenceByScene(sceneId).filter(
          e => !state.foundEvidenceIds.includes(e.id),
        ).length

        if (unfound === 0) {
          dispatch({
            type: 'SCAN_MESSAGE',
            sceneId,
            payload: { title: 'NO EVIDENCE REMAINING', lines: [], noEvidence: true },
          })
        } else {
          dispatch({
            type: 'SCAN_MESSAGE',
            sceneId,
            payload: { title: 'UNKNOWN SUBJECT DETECTED', lines: ['FOLLOW THE EVIDENCE'] },
          })
        }
      }, SCAN_WAVE_MS)
      return () => { if (scanWaveTimer.current) clearTimeout(scanWaveTimer.current) }
    }
  }, [state.scanWave, state.foundEvidenceIds])

  useEffect(() => {
    if (
      (state.scanPhase === 'message' || state.scanPhase === 'no_evidence') &&
      state.scanRevealUntil > 0
    ) {
      const ms = Math.max(0, state.scanRevealUntil - Date.now())
      const action = state.scanPhase === 'no_evidence' ? 'SCAN_NO_EVIDENCE_END' : 'SCAN_MESSAGE_END'

      const timer = setTimeout(() => dispatch({ type: action }), ms)
      return () => clearTimeout(timer)
    }
  }, [state.scanPhase, state.scanRevealUntil])

  const mainInvestigationCompletion = useMemo(
    () => computeMainInvestigationCompletion(state.foundEvidenceIds),
    [state.foundEvidenceIds],
  )

  const arkhamCaseCompletion = useMemo(
    () => computeCaseCompletion('arkham', state.foundEvidenceIds),
    [state.foundEvidenceIds],
  )

  const wayneCaseCompletion = useMemo(
    () => computeCaseCompletion('wayne', state.foundEvidenceIds),
    [state.foundEvidenceIds],
  )

  const investigationCompletion = useMemo(
    () => computeLegacyCompletion(
      state.foundEvidenceIds.length,
      state.exploredSceneIds.length,
      state.unlockedFileIds.length,
    ),
    [state.foundEvidenceIds.length, state.exploredSceneIds.length, state.unlockedFileIds.length],
  )

  const getObjectiveForScene = useCallback(
    (sceneId: string) => getGlobalObjective(
      state.foundEvidenceIds,
      state.batcomputerAccessRevealed,
      sceneId,
    ),
    [state.foundEvidenceIds, state.batcomputerAccessRevealed],
  )

  useEffect(() => {
    const prev = milestoneRef.current.prev
    milestoneRef.current.prev = mainInvestigationCompletion
    if (mainInvestigationCompletion >= 50 && prev < 50 && !state.milestone50Shown) {
      dispatch({ type: 'MILESTONE_50' })
      setPendingMilestone('50')
    }
    if (mainInvestigationCompletion >= 100 && prev < 100 && !state.milestone100Shown) {
      dispatch({ type: 'MILESTONE_100' })
      setPendingMilestone('100')
    }
  }, [mainInvestigationCompletion, state.milestone50Shown, state.milestone100Shown])

  const scanMessageActive =
    state.scanPhase === 'message' || state.scanPhase === 'no_evidence'

  const scanRevealActive = state.active && (
    state.scanPhase === 'wave' ||
    state.scanPhase === 'message' ||
    state.scanCompletedScenes.length > 0
  )

  const toggleDetectiveMode = useCallback(() => dispatch({ type: 'TOGGLE' }), [])

  const deactivateDetectiveMode = useCallback(() => dispatch({ type: 'FORCE_OFF' }), [])

  const triggerScan = useCallback((sceneId: string) => {
    const inv = getInvestigationByScene(sceneId) ?? null
    pendingScanInv.current = inv
    pendingScanSceneId.current = sceneId as SceneId
    dispatch({ type: 'SCAN_START', investigation: inv, sceneId: sceneId as SceneId })
  }, [])

  const dismissEvidence = useCallback(() => dispatch({ type: 'DISMISS_EVIDENCE' }), [])
  const dismissFile = useCallback(() => dispatch({ type: 'DISMISS_FILE' }), [])
  const resetInvestigation = useCallback(() => dispatch({ type: 'RESET' }), [])
  const markSceneExplored = useCallback((sceneId: SceneId) => dispatch({ type: 'EXPLORE', sceneId }), [])
  const dismissMilestone = useCallback(() => setPendingMilestone(null), [])

  const discoverEvidence = useCallback((id: string) => {
    const ev = getDetectiveEvidenceById(id)
    if (!ev || state.foundEvidenceIds.includes(id)) return
    dispatch({ type: 'DISCOVER', evidence: ev })
  }, [state.foundEvidenceIds])

  const visitTrailStep = useCallback((investigationId: string, stepId: string) => {
    dispatch({ type: 'VISIT_TRAIL', investigationId, stepId })
  }, [])

  const value: DetectiveContextValue = {
    active:                      state.active,
    activating:                    state.activating,
    scanWave:                    state.scanWave,
    scanPhase:                   state.scanPhase,
    scanMessageActive,
    scanRevealActive,
    activeScanSceneId:           state.activeScanSceneId,
    scanHypothesis:              state.scanHypothesis,
    foundEvidenceIds:            state.foundEvidenceIds,
    exploredSceneIds:            state.exploredSceneIds,
    trailProgress:               state.trailProgress,
    pendingEvidence:             state.pendingEvidence,
    pendingFile:                 state.pendingFile,
    unlockedFileIds:             state.unlockedFileIds,
    clearanceLevel:              Math.min(state.unlockedFileIds.length, 5),
    foundCount:                  state.foundEvidenceIds.length,
    totalCount:                  DETECTIVE_EVIDENCE_TOTAL,
    investigationCompletion,
    arkhamCaseCompletion,
    wayneCaseCompletion,
    mainInvestigationCompletion,
    getObjectiveForScene,
    batcomputerAccessRevealed:   state.batcomputerAccessRevealed,
    milestone50Shown:            state.milestone50Shown,
    milestone100Shown:           state.milestone100Shown,
    pendingMilestone,
    toggleDetectiveMode,
    deactivateDetectiveMode,
    triggerScan,
    discoverEvidence,
    visitTrailStep,
    dismissEvidence,
    dismissFile,
    resetInvestigation,
    markSceneExplored,
    dismissMilestone,
    isFileUnlocked:              (fileId) => state.unlockedFileIds.includes(fileId),
    isEvidenceFound:             (id) => state.foundEvidenceIds.includes(id),
    getSceneEvidence:            (sceneId) => getDetectiveEvidenceByScene(sceneId),
    getSceneInvestigation:       (sceneId) => getInvestigationByScene(sceneId),
    getTrailVisited:             (id) => state.trailProgress[id] ?? [],
    hasScanCompletedForScene:    (sceneId) => state.scanCompletedScenes.includes(sceneId),
    isInvestigationConcluded:    (id) => state.concludedInvestigations.includes(id),
    allEvidence:                 detectiveEvidenceList,
  }

  return (
    <DetectiveContext.Provider value={value}>
      {children}
    </DetectiveContext.Provider>
  )
}

export function useDetective(): DetectiveContextValue {
  const ctx = useContext(DetectiveContext)
  if (!ctx) throw new Error('useDetective must be used inside <DetectiveProvider>')
  return ctx
}
