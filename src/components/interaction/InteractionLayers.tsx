import { useMemo } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import { useDetective } from '@/core/detective/DetectiveContext'
import { getDetectiveEvidenceByScene } from '@/data/detectiveEvidence'
import { getNavigationForScene, getObjectAnchor } from '@/data/sceneAnchors'
import {
  buildNavigationHint,
  buildEvidenceHint,
  buildTerminalHint,
} from '@/core/interaction/contextualLabels'
import NavigationHotspot from './NavigationHotspot'
import EvidenceHotspot from './EvidenceHotspot'
import { anchorToHitProps } from './hotspotGeometry'
import { getObjectAnchor as getLaptopAnchor } from '@/data/sceneAnchors'
import type { TransitionType } from '@/core/navigation/types'

interface Props {
  onBatcomputerAccess: () => void
}

export default function InteractionLayers({ onBatcomputerAccess }: Props) {
  const { currentScene, navigateTo, transition } = useScene()
  const {
    active: detectiveOn,
    discoverEvidence,
    isEvidenceFound,
    batcomputerAccessRevealed,
  } = useDetective()

  const navAnchors = useMemo(
    () => getNavigationForScene(currentScene.id),
    [currentScene.id],
  )

  const busy = transition.active

  const batcomputerRevealed =
    batcomputerAccessRevealed || isEvidenceFound('dm-wayne-terminal')

  const sceneEvidence = useMemo(
    () => getDetectiveEvidenceByScene(currentScene.id),
    [currentScene.id],
  )

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 40 }} aria-label="Interaction layers">
      {/* Navegación hacia adelante — desactivada en modo detective (solo GO BACK) */}
      {!detectiveOn &&
        navAnchors.map(nav => (
          <NavigationHotspot
            key={nav.id}
            {...anchorToHitProps(nav)}
            hint={buildNavigationHint(nav.cursorAction, nav.destinationName)}
            disabled={busy}
            ariaLabel={nav.label}
            debugId={nav.id}
            elementHint={nav.element}
            onNavigate={() => navigateTo(nav.targetScene, nav.transitionType as TransitionType)}
          />
        ))}

      {/* Evidencias — siempre clickeables con detective ON (trail no bloquea hotspots) */}
      {sceneEvidence.map(ev => {
          if (isEvidenceFound(ev.id)) return null
          const anchor = getObjectAnchor(ev.id)

          return (
            <EvidenceHotspot
              key={ev.id}
              {...(anchor
                ? anchorToHitProps(anchor)
                : { top: ev.top, left: ev.left, hitRadius: 36 })}
              hint={buildEvidenceHint(ev.title)}
              detectiveOn={detectiveOn}
              disabled={busy}
              ariaLabel={ev.title}
              debugId={`ev:${ev.id}`}
              elementHint={anchor?.element}
              onCollect={() => discoverEvidence(ev.id)}
            />
          )
        })}

      {!detectiveOn && currentScene.id === 'wayne-despacho' && batcomputerRevealed && (
        <NavigationHotspot
          {...anchorToHitProps(
            getLaptopAnchor('batcomputer-laptop') ?? getLaptopAnchor('dm-wayne-terminal')!,
          )}
          hint={buildTerminalHint('Batcomputer')}
          disabled={busy}
          ariaLabel="Access Batcomputer"
          debugId="nav:batcomputer-laptop"
          elementHint="Laptop — Batcomputer uplink"
          onNavigate={onBatcomputerAccess}
        />
      )}
    </div>
  )
}
