import { useMemo, useState } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import { useDetective } from '@/core/detective/DetectiveContext'
import {
  getBatcomputerPanelAnchorsForScene,
  type BatcomputerPanelAnchor,
} from '@/data/batcomputerPanelAnchors'
import { buildTerminalHint } from '@/core/interaction/contextualLabels'
import InfoHotspot from './InfoHotspot'
import BatcomputerPanelModal from '@/components/batcomputer/BatcomputerPanelModal'
import { anchorToHitProps } from './hotspotGeometry'

/** Paneles del Batcomputer — solo clickeables con detective OFF */
export default function BatcomputerPanelLayer() {
  const { currentScene, transition } = useScene()
  const { active: detectiveOn } = useDetective()
  const [openPanel, setOpenPanel] = useState<BatcomputerPanelAnchor | null>(null)

  const anchors = useMemo(
    () => getBatcomputerPanelAnchorsForScene(currentScene.id),
    [currentScene.id],
  )

  const busy = transition.active

  if (anchors.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 41 }}>
      {anchors.map(anchor => (
        <InfoHotspot
          key={anchor.id}
          {...anchorToHitProps(anchor)}
          hint={buildTerminalHint(anchor.label)}
          detectiveOn={detectiveOn}
          disabled={busy}
          ariaLabel={`Access ${anchor.label}`}
          debugId={anchor.id}
          elementHint={anchor.element}
          onOpen={() => setOpenPanel(anchor)}
        />
      ))}

      {openPanel && (
        <BatcomputerPanelModal
          open={!!openPanel}
          onClose={() => setOpenPanel(null)}
          panelId={openPanel.panelId}
          title={openPanel.label}
        />
      )}
    </div>
  )
}
