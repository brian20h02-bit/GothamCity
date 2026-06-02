import { useState, useCallback } from 'react'
import CinematicIntro from '@/components/ui/CinematicIntro'
import RainCanvas from '@/components/ui/RainCanvas'
import FogLayer from '@/components/ui/FogLayer'
import LightningSystem from '@/components/atmosphere/LightningSystem'
import { SceneProvider } from '@/core/navigation/SceneContext'
import SceneRenderer from '@/core/scenes/SceneRenderer'
import ArchiveTransition from '@/core/transitions/ArchiveTransition'
import CinematicCursor from '@/components/cinematic/CinematicCursor'
import SceneHUD from '@/components/cinematic/SceneHUD'
import { InvestigationProvider } from '@/core/investigation/InvestigationContext'
import InvestigationHUD from '@/components/cinematic/InvestigationHUD'
import EvidenceFoundOverlay from '@/components/cinematic/EvidenceFoundOverlay'
import FileUnlockedOverlay from '@/components/cinematic/FileUnlockedOverlay'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  const handleIntroComplete = useCallback(() => {
    setLoaded(true)
  }, [])

  return (
    <>
      {!loaded && <CinematicIntro onComplete={handleIntroComplete} />}

      {loaded && (
        <SceneProvider>
          <InvestigationProvider>
            {/* Global atmosphere */}
            <RainCanvas />
            <FogLayer />
            <LightningSystem />

            {/* Scene layer */}
            <SceneRenderer />

            {/* Scene transition overlay */}
            <ArchiveTransition />

            {/* HUD layers */}
            <SceneHUD />
            <InvestigationHUD />

            {/* Investigation overlays (above everything except cursor) */}
            <EvidenceFoundOverlay />
            <FileUnlockedOverlay />

            {/* Custom cursor (always topmost) */}
            <CinematicCursor />
          </InvestigationProvider>
        </SceneProvider>
      )}
    </>
  )
}

