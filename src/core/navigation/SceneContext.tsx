// @refresh reset
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { scenes, getSceneById } from './scenes'
import type { Scene, SceneId, TransitionType } from './types'

// ─── Sound event hooks (architecture — no audio yet) ────────────────────────
export type SoundEvent =
  | 'onSceneEnter'
  | 'onSceneLeave'
  | 'onHotspotHover'
  | 'onArchiveOpen'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emitSoundEvent = (_event: SoundEvent): void => {
  // TODO: wire to SoundManager when audio is implemented
}

// ─── State types ─────────────────────────────────────────────────────────────
export interface TransitionState {
  active:  boolean
  type:    TransitionType
  /** freeze = scene hides | flash = scene swaps + quick reveal */
  phase:   'idle' | 'freeze' | 'flash'
}

interface SceneContextValue {
  currentScene:  Scene
  allScenes:     Scene[]
  transition:    TransitionState
  navigateTo:    (id: SceneId, type?: TransitionType) => void
  navigateNext:  () => void
  navigatePrev:  () => void
  canGoNext:     boolean
  canGoPrev:     boolean
}

// ─── Context ─────────────────────────────────────────────────────────────────
const SceneContext = createContext<SceneContextValue | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────
interface SceneProviderProps {
  children: ReactNode
  initialScene?: SceneId
}

/** GPU-friendly cuts — total ≤ ~450ms archive, ≤1000ms batcomputer */
const FLASH_AT = { archive: 160, memory: 200, batcomputer: 100, none: 0 } as const
const END_AT   = { archive: 400, memory: 460, batcomputer: 1000, none: 36 } as const

export function SceneProvider({ children, initialScene = 'gotham-city' }: SceneProviderProps) {
  const [currentScene, setCurrentScene] = useState<Scene>(
    () => getSceneById(initialScene) ?? scenes[0],
  )

  const [transition, setTransition] = useState<TransitionState>({
    active: false,
    type:   'none',
    phase:  'idle',
  })

  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const endTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigateTo = useCallback(
    (id: SceneId, type: TransitionType = 'archive') => {
      const target = getSceneById(id)
      if (!target || transition.active) return

      // Clear any previous timers (safety guard)
      if (flashTimer.current) clearTimeout(flashTimer.current)
      if (endTimer.current)   clearTimeout(endTimer.current)

      emitSoundEvent('onSceneLeave')

      setTransition({ active: true, type, phase: 'freeze' })

      flashTimer.current = setTimeout(() => {
        setTransition(prev => ({ ...prev, phase: 'flash' }))
        setCurrentScene(target)
        emitSoundEvent('onSceneEnter')
      }, FLASH_AT[type])

      endTimer.current = setTimeout(() => {
        setTransition({ active: false, type: 'none', phase: 'idle' })
      }, END_AT[type])
    },
    [transition.active],
  )

  const navigateNext = useCallback(() => {
    if (currentScene.nextScene) navigateTo(currentScene.nextScene)
  }, [currentScene.nextScene, navigateTo])

  const navigatePrev = useCallback(() => {
    if (currentScene.prevScene) navigateTo(currentScene.prevScene, 'memory')
  }, [currentScene.prevScene, navigateTo])

  const value: SceneContextValue = {
    currentScene,
    allScenes: scenes,
    transition,
    navigateTo,
    navigateNext,
    navigatePrev,
    canGoNext: !!currentScene.nextScene,
    canGoPrev: !!currentScene.prevScene,
  }

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useScene(): SceneContextValue {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error('useScene must be used inside <SceneProvider>')
  return ctx
}
