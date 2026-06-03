import { Z_INDEX } from '@/config/layers'
import GoBackButton from '@/components/cinematic/GoBackButton'

/**
 * Capa de navegación global — por encima de Detective Mode, escena y atmósfera.
 * Solo GO BACK recibe pointer-events; el resto de la capa es transparente.
 */
export default function NavigationHud() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: Z_INDEX.NAVIGATION_HUD }}
      aria-label="Navigation HUD"
    >
      <GoBackButton />
    </div>
  )
}
