import InteractionLayers from '@/components/interaction/InteractionLayers'
import ReadFileLayer from '@/components/interaction/ReadFileLayer'
import BatcomputerPanelLayer from '@/components/interaction/BatcomputerPanelLayer'
import SceneInvestigationLayer from '@/components/detective/SceneInvestigationLayer'

interface Props {
  onBatcomputerAccess: () => void
}

/** Investigación (z12) debajo de interacción (z40) */
export default function SceneAnchoredHotspots({ onBatcomputerAccess }: Props) {
  return (
    <>
      <SceneInvestigationLayer />
      <InteractionLayers onBatcomputerAccess={onBatcomputerAccess} />
      <BatcomputerPanelLayer />
      <ReadFileLayer />
    </>
  )
}
