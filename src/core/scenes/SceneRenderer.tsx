import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useMemo, useCallback } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import SceneWorld, { type BackgroundDrift } from '@/components/cinematic/SceneWorld'
import SceneAnchoredHotspots from '@/components/cinematic/SceneAnchoredHotspots'
import DetectiveTacticalHud from '@/components/detective/DetectiveTacticalHud'
import { getSceneAtmosphere } from '@/data/sceneAtmosphere'
import { Z_INDEX } from '@/config/layers'
import type { SceneId } from '@/core/navigation/types'

const sceneComponents: Record<SceneId, React.LazyExoticComponent<() => JSX.Element | null>> = {
  'gotham-city':               lazy(() => import('./SceneGothamCity')),
  'crime-alley':               lazy(() => import('./SceneCrimeAlley')),
  'the-incident':              lazy(() => import('./SceneTheIncident')),
  'the-archives':              lazy(() => import('./SceneTheArchives')),
  'crime-alley-investigation': lazy(() => import('./SceneCrimeAlleyInvestigation')),
  'narrows-investigation':     lazy(() => import('./SceneNarrowsInvestigation')),
  'arkham-investigation':      lazy(() => import('./SceneArkhamInvestigation')),
  'arkham-entrada':            lazy(() => import('./SceneArkhamEntrada')),
  'arkham-fachada':            lazy(() => import('./SceneArkhamFachada')),
  'arkham-atrio':              lazy(() => import('./SceneArkhamAtrio')),
  'arkham-puertas':            lazy(() => import('./SceneArkhamPuertas')),
  'arkham-intensivo':          lazy(() => import('./SceneArkhamIntensivo')),
  'arkham-lunatico':           lazy(() => import('./SceneArkhamLunatico')),
  'wayne-exterior':            lazy(() => import('./SceneWayneExterior')),
  'wayne-lobby':               lazy(() => import('./SceneWayneLobby')),
  'wayne-sala':                lazy(() => import('./SceneWayneSala')),
  'wayne-despacho':            lazy(() => import('./SceneWayneDespacho')),
  'batcomputer':               lazy(() => import('./SceneBatcomputer')),
  'batcomputer-control':       lazy(() => import('./SceneBatcomputerControl')),
}

const NO_BACKGROUND: SceneId[] = ['the-archives']

const BG_CONFIG: Partial<Record<SceneId, { drift: BackgroundDrift; parallax: boolean }>> = {
  'arkham-entrada':            { drift: 'subtle',   parallax: true },
  'arkham-fachada':            { drift: 'approach', parallax: true },
  'arkham-atrio':              { drift: 'subtle',   parallax: true },
  'arkham-puertas':            { drift: 'none',     parallax: true },
  'arkham-intensivo':          { drift: 'none',     parallax: false },
  'arkham-lunatico':           { drift: 'none',     parallax: false },
  'arkham-investigation':      { drift: 'none',     parallax: true },
  'wayne-exterior':            { drift: 'subtle',   parallax: true },
  'wayne-lobby':               { drift: 'none',     parallax: true },
  'wayne-sala':                { drift: 'none',     parallax: true },
  'wayne-despacho':            { drift: 'none',     parallax: true },
  'batcomputer':               { drift: 'none',     parallax: false },
  'batcomputer-control':       { drift: 'none',     parallax: false },
  'gotham-city':               { drift: 'none',     parallax: true },
  'crime-alley':               { drift: 'none',     parallax: true },
  'the-incident':              { drift: 'none',     parallax: true },
  'crime-alley-investigation': { drift: 'none',     parallax: true },
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function SceneRenderer() {
  const { currentScene, transition, navigateTo } = useScene()
  const SceneContent = sceneComponents[currentScene.id]
  const showBg       = !NO_BACKGROUND.includes(currentScene.id) && !!currentScene.background
  const bgCfg        = BG_CONFIG[currentScene.id] ?? { drift: 'none' as const, parallax: false }
  const isFreeze     = transition.phase === 'freeze'

  const onBatcomputerAccess = useCallback(
    () => navigateTo('batcomputer', 'batcomputer'),
    [navigateTo],
  )

  const overlayStrength = useMemo(() => {
    const base = getSceneAtmosphere(currentScene.id)
    if (currentScene.id.startsWith('batcomputer')) return 0.22 + base.dimLevel * 0.1
    if (currentScene.id.startsWith('wayne')) return 0.28 + base.dimLevel * 0.15
    if (currentScene.id.startsWith('arkham')) return 0.42
    return 0.55
  }, [currentScene.id])

  const atmosphere = useMemo(
    () => getSceneAtmosphere(currentScene.id),
    [currentScene.id],
  )

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: Z_INDEX.SCENE }}>
      <DetectiveTacticalHud />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{
            opacity: transition.phase === 'flash' ? 0 : 1,
            scale:   isFreeze ? 1.035 : 1,
          }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{
            opacity: { duration: 0.55, ease: EASE },
            scale:   { duration: 0.65, ease: EASE },
          }}
          style={{ willChange: 'transform, opacity' }}
        >
          {showBg ? (
            <SceneWorld
              src={currentScene.background}
              drift={bgCfg.drift}
              parallax={bgCfg.parallax}
              isZooming={isFreeze}
              cameraDrift={atmosphere.cameraDrift}
              parallaxStrength={atmosphere.parallaxStrength}
            >
              <SceneAnchoredHotspots onBatcomputerAccess={onBatcomputerAccess} />
            </SceneWorld>
          ) : (
            <SceneAnchoredHotspots onBatcomputerAccess={onBatcomputerAccess} />
          )}

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              background: `linear-gradient(to top, rgba(5,5,5,${overlayStrength}) 0%, rgba(5,5,5,${overlayStrength * 0.28}) 55%, rgba(5,5,5,${overlayStrength * 0.65}) 100%)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1, background: 'radial-gradient(ellipse at center, transparent 55%, rgba(5,5,5,0.28) 100%)' }}
          />

          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
            <Suspense fallback={null}>
              <SceneContent />
            </Suspense>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
