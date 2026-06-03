import AnchoredHitTarget from './AnchoredHitTarget'
import { INTERACTION_PRIORITY } from '@/core/interaction/types'
import { buildTerminalHint } from '@/core/interaction/contextualLabels'
import { getObjectAnchor } from '@/data/sceneAnchors'

interface Props {
  onAccess:        () => void
  disabled?:       boolean
  detectiveOn:     boolean
  accessRevealed?: boolean
}

/** Laptop en el escritorio — sin indicadores artificiales */
export default function NotebookAccessTarget({
  onAccess,
  disabled,
  detectiveOn,
  accessRevealed = false,
}: Props) {
  const laptop = getObjectAnchor('batcomputer-laptop') ?? getObjectAnchor('dm-wayne-terminal')
  if (!laptop) return null

  if (detectiveOn && !accessRevealed) return null

  return (
    <AnchoredHitTarget
      top={laptop.top}
      left={laptop.left}
      hitWidthPct={laptop.width ?? 12}
      hitHeightPct={laptop.height ?? 8}
      hint={buildTerminalHint('Batcomputer')}
      hotspotType="ui"
      priority={INTERACTION_PRIORITY.UI}
      disabled={disabled}
      detectiveReveal={detectiveOn && accessRevealed}
      ariaLabel="Access Batcomputer — laptop"
      debugId="ui:batcomputer-laptop"
      elementHint={laptop.element}
      onActivate={onAccess}
    />
  )
}
