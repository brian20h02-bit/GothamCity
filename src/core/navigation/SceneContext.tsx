// @refresh reset
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { scenes, getSceneById } from './scenes'
import type { Scene, SceneId, TransitionType } from './types'

export type SoundEvent =
  | 'onSceneEnter'
  | 'onSceneLeave'
  | 'onHotspotHover'
  | 'onArchiveOpen'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emitSoundEvent = (_event: SoundEvent): void => {}

export interface TransitionState {
  active:  boolean
  type:    TransitionType
  phase:   'idle' | 'freeze' | 'flash'
}

interface NavigateOptions {
  /** No registrar en sceneHistory (p. ej. restauración inicial) */
  skipHistory?: boolean
}

interface SceneContextValue {
  currentScene:   Scene
  previousScene:  Scene | null
  allScenes:      Scene[]
  transition:     TransitionState
  sceneHistory:   SceneId[]
  navigateTo:     (id: SceneId, type?: TransitionType, options?: NavigateOptions) => void
  navigateNext:   () => void
  navigatePrev:   () => void
  goBack:         () => void
  canGoNext:      boolean
  canGoPrev:      boolean
  canGoBack:      boolean
}

const SceneContext = createContext<SceneContextValue | null>(null)

interface SceneProviderProps {
  children: ReactNode
  initialScene?: SceneId
}

const FLASH_AT = { archive: 160, memory: 200, batcomputer: 100, back: 200, none: 0 } as const
const END_AT   = { archive: 400, memory: 460, batcomputer: 1000, back: 620, none: 36 } as const

export function SceneProvider({ children, initialScene = 'gotham-city' }: SceneProviderProps) {
  const [currentScene, setCurrentScene] = useState<Scene>(
    () => getSceneById(initialScene) ?? scenes[0],
  )

  const [transition, setTransition] = useState<TransitionState>({
    active: false,
    type:   'none',
    phase:  'idle',
  })

  /** Pila real de escenas visitadas (último = anterior inmediato) */
  const [sceneHistory, setSceneHistory] = useState<SceneId[]>([])

  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const endTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const transitionActiveRef = useRef(false)

  const runTransition = useCallback(
    (target: Scene, type: TransitionType) => {
      if (flashTimer.current) clearTimeout(flashTimer.current)
      if (endTimer.current) clearTimeout(endTimer.current)

      emitSoundEvent('onSceneLeave')
      transitionActiveRef.current = true

      setTransition({ active: true, type, phase: 'freeze' })

      flashTimer.current = setTimeout(() => {
        setTransition(prev => ({ ...prev, phase: 'flash' }))
        setCurrentScene(target)
        emitSoundEvent('onSceneEnter')
      }, FLASH_AT[type])

      endTimer.current = setTimeout(() => {
        transitionActiveRef.current = false
        setTransition({ active: false, type: 'none', phase: 'idle' })
      }, END_AT[type])
    },
    [],
  )

  const navigateTo = useCallback(
    (id: SceneId, type: TransitionType = 'archive', options?: NavigateOptions) => {
      const target = getSceneById(id)
      if (!target || transitionActiveRef.current) return
      if (id === currentScene.id) return

      if (!options?.skipHistory) {
        setSceneHistory(prev => {
          const last = prev[prev.length - 1]
          if (last === currentScene.id) return prev
          return [...prev, currentScene.id]
        })
      }

      runTransition(target, type)
    },
    [currentScene.id, runTransition],
  )

  const goBack = useCallback(() => {
    if (transitionActiveRef.current || sceneHistory.length === 0) return

    const previousSceneId = sceneHistory[sceneHistory.length - 1]
    const target = getSceneById(previousSceneId)
    if (!target) return

    setSceneHistory(prev => prev.slice(0, -1))
    runTransition(target, 'back')
  }, [sceneHistory, runTransition])

  const navigateNext = useCallback(() => {
    if (currentScene.nextScene) navigateTo(currentScene.nextScene)
  }, [currentScene.nextScene, navigateTo])

  const navigatePrev = useCallback(() => {
    goBack()
  }, [goBack])

  const previousScene = useMemo(() => {
    if (!sceneHistory.length) return null
    const prevId = sceneHistory[sceneHistory.length - 1]
    return getSceneById(prevId) ?? null
  }, [sceneHistory])

  const value: SceneContextValue = {
    currentScene,
    previousScene,
    allScenes: scenes,
    transition,
    sceneHistory,
    navigateTo,
    navigateNext,
    navigatePrev,
    goBack,
    canGoNext: !!currentScene.nextScene,
    canGoPrev: sceneHistory.length > 0,
    canGoBack: sceneHistory.length > 0,
  }

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
}

export function useScene(): SceneContextValue {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error('useScene must be used inside <SceneProvider>')
  return ctx
}
