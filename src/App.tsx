import { useState, useCallback } from 'react'
import '@/core/interaction/validateHotspots'
import CinematicIntro from '@/components/ui/CinematicIntro'
import FogLayer from '@/components/atmosphere/FogLayer'
import AtmosphereLayer from '@/components/atmosphere/AtmosphereLayer'
import WetGlassEffect from '@/components/atmosphere/WetGlassEffect'
import ImmersionAudioBridge from '@/components/immersion/ImmersionAudioBridge'
import { SceneProvider } from '@/core/navigation/SceneContext'
import SceneRenderer from '@/core/scenes/SceneRenderer'
import ArchiveTransition from '@/core/transitions/ArchiveTransition'
import CinematicCursor from '@/components/cinematic/CinematicCursor'
import SceneHUD from '@/components/cinematic/SceneHUD'
import { InvestigationProvider } from '@/core/investigation/InvestigationContext'
import InvestigationHUD from '@/components/cinematic/InvestigationHUD'
import FileUnlockedOverlay from '@/components/cinematic/FileUnlockedOverlay'
import { DetectiveProvider } from '@/core/detective/DetectiveContext'
import DetectiveHUD from '@/components/detective/DetectiveHUD'
import DetectiveModeLayer from '@/components/detective/DetectiveModeLayer'
import DetectiveScanWave from '@/components/detective/DetectiveScanWave'
import DetectiveScanAnalysisOverlay from '@/components/detective/DetectiveScanAnalysisOverlay'
import DetectiveEvidenceOverlay from '@/components/detective/DetectiveEvidenceOverlay'
import DetectiveMilestoneOverlay from '@/components/detective/DetectiveMilestoneOverlay'
import DetectiveSceneTracker from '@/components/detective/DetectiveSceneTracker'
import DetectiveNavigationBridge from '@/components/detective/DetectiveNavigationBridge'
import NavigationHud from '@/components/navigation/NavigationHud'
import { InteractionDebugProvider } from '@/core/interaction/InteractionDebugContext'
import InteractionDebugHud from '@/components/interaction/InteractionDebugHud'

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
          <DetectiveProvider>
          <InvestigationProvider>
            <InteractionDebugProvider>
              <DetectiveSceneTracker />
              <DetectiveNavigationBridge />
              <ImmersionAudioBridge />

              <SceneRenderer />

              <FogLayer />
              <AtmosphereLayer />
              <WetGlassEffect />

              <DetectiveModeLayer />
              <ArchiveTransition />
              <DetectiveScanWave />
              <DetectiveScanAnalysisOverlay />

              <SceneHUD />
              <InvestigationHUD />
              <DetectiveHUD />

              <DetectiveEvidenceOverlay />
              <FileUnlockedOverlay />
              <DetectiveMilestoneOverlay />

              <NavigationHud />

              <CinematicCursor />
              <InteractionDebugHud />
            </InteractionDebugProvider>
          </InvestigationProvider>
          </DetectiveProvider>
        </SceneProvider>
      )}
    </>
  )
}

