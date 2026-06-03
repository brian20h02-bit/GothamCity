import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScene } from '@/core/navigation/SceneContext'
import { getSceneBackLabel } from '@/core/navigation/sceneLabels'

const FADE = 0.15

export default function GoBackButton() {
  const { goBack, canGoBack, previousScene, transition, currentScene } = useScene()
  const [hovered, setHovered] = useState(false)
  const prevSceneId = useRef<string | null>(null)
  const [emphasis, setEmphasis] = useState(false)

  const show = canGoBack
  const interactive = canGoBack && !transition.active
  const destinationLabel = previousScene
    ? getSceneBackLabel(previousScene.id)
    : ''

  useEffect(() => {
    if (!canGoBack) {
      prevSceneId.current = currentScene.id
      setEmphasis(false)
      return
    }
    if (prevSceneId.current !== currentScene.id) {
      setEmphasis(true)
      const t = setTimeout(() => setEmphasis(false), 2000)
      prevSceneId.current = currentScene.id
      return () => clearTimeout(t)
    }
  }, [currentScene.id, canGoBack])

  const onEnter = useCallback(() => {
    if (!interactive) return
    setHovered(true)
    window.dispatchEvent(new CustomEvent('hotspot-enter', {
      detail: { actionLine: 'GO BACK', targetLine: destinationLabel },
    }))
  }, [interactive, destinationLabel])

  const onLeave = useCallback(() => {
    setHovered(false)
    window.dispatchEvent(new CustomEvent('hotspot-leave'))
  }, [])

  const opacity = !interactive ? 0.35 : hovered || emphasis ? 1 : 0.7
  const isArchivesHub = currentScene.id === 'the-archives'

  const positionStyle = isArchivesHub
    ? { top: 24, left: 24 }
    : { bottom: 24, left: '50%', transform: 'translateX(-50%)' }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="go-back"
          type="button"
          className={`fixed pointer-events-auto flex flex-col font-body ${
            isArchivesHub ? 'items-start text-left' : 'items-center text-center'
          }`}
          style={{
            ...positionStyle,
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            cursor: interactive ? 'none' : 'default',
            opacity,
            transition: `opacity ${FADE}s ease`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE }}
          onClick={() => interactive && goBack()}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          disabled={!interactive}
          aria-label={`Go back to ${destinationLabel}`}
        >
          <span
            className="font-display tracking-[0.35em]"
            style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: 'rgba(229,229,229,0.95)',
              letterSpacing: '0.35em',
            }}
          >
            ← GO BACK
          </span>
          <span
            className="font-display mt-3 tracking-[0.2em]"
            style={{
              fontSize: 12,
              color: 'rgba(229,229,229,0.75)',
            }}
          >
            {destinationLabel}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
