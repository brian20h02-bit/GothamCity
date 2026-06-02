import { useCallback } from 'react'
import { motion } from 'framer-motion'
import type { Hotspot as HotspotDef } from '@/core/navigation/types'
import { useScene } from '@/core/navigation/SceneContext'
import type { SceneId, TransitionType } from '@/core/navigation/types'

interface HotspotProps {
  hotspot: HotspotDef
}

export default function Hotspot({ hotspot }: HotspotProps) {
  const { navigateTo, transition } = useScene()

  const handleEnter = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('hotspot-enter', { detail: hotspot.action }),
    )
  }, [hotspot.action])

  const handleLeave = useCallback(() => {
    window.dispatchEvent(new CustomEvent('hotspot-leave'))
  }, [])

  const handleClick = useCallback(() => {
    if (transition.active || !hotspot.targetScene) return
    navigateTo(hotspot.targetScene as SceneId, hotspot.transitionType as TransitionType)
  }, [hotspot.targetScene, hotspot.transitionType, navigateTo, transition.active])

  const { top, left, width, height } = hotspot.area

  return (
    <motion.button
      className="absolute pointer-events-auto"
      style={{
        top:    `${top}%`,
        left:   `${left}%`,
        width:  `${width}%`,
        height: `${height}%`,
        background: 'transparent',
        border: 'none',
        zIndex: 10,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      aria-label={hotspot.label}
      whileHover={{}}
    >
      {/* Subtle corner indicators that pulse on hover */}
      <motion.span
        aria-hidden="true"
        className="absolute top-0 left-0 w-3 h-3"
        style={{ borderTop: '1px solid rgba(229,229,229,0.4)', borderLeft: '1px solid rgba(229,229,229,0.4)', opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute top-0 right-0 w-3 h-3"
        style={{ borderTop: '1px solid rgba(229,229,229,0.4)', borderRight: '1px solid rgba(229,229,229,0.4)', opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-3 h-3"
        style={{ borderBottom: '1px solid rgba(229,229,229,0.4)', borderLeft: '1px solid rgba(229,229,229,0.4)', opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-3 h-3"
        style={{ borderBottom: '1px solid rgba(229,229,229,0.4)', borderRight: '1px solid rgba(229,229,229,0.4)', opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      />
    </motion.button>
  )
}
