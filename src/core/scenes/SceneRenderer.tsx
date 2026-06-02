import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useMemo } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import Hotspot from '@/components/interactive/Hotspot'
import SceneBackground, { type BackgroundDrift } from '@/components/cinematic/SceneBackground'
import type { SceneId } from '@/core/navigation/types'

const sceneComponents: Record<SceneId, React.LazyExoticComponent<() => JSX.Element>> = {
  'gotham-city':               lazy(() => import('./SceneGothamCity')),
  'crime-alley':               lazy(() => import('./SceneCrimeAlley')),
  'the-incident':              lazy(() => import('./SceneTheIncident')),
  'the-archives':              lazy(() => import('./SceneTheArchives')),
  'crime-alley-investigation': lazy(() => import('./SceneCrimeAlleyInvestigation')),
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
  const { currentScene, transition } = useScene()
  const SceneContent = sceneComponents[currentScene.id]
  const showBg       = !NO_BACKGROUND.includes(currentScene.id) && !!currentScene.background
  const bgCfg        = BG_CONFIG[currentScene.id] ?? { drift: 'none' as const, parallax: false }
  const isFreeze     = transition.phase === 'freeze'

  const overlayStrength = useMemo(() => {
    if (currentScene.id.startsWith('batcomputer')) return 0.28
    if (currentScene.id.startsWith('arkham')) return 0.38
    if (currentScene.id.startsWith('wayne')) return 0.34
    return 0.52
  }, [currentScene.id])

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{
            opacity: transition.phase === 'flash' ? 0 : 1,
            scale:   isFreeze ? 1.04 : 1,
          }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{
            opacity: { duration: 0.28, ease: EASE },
            scale:   { duration: 0.28, ease: EASE },
          }}
          style={{ willChange: 'transform, opacity' }}
        >
          {showBg && (
            <SceneBackground
              src={currentScene.background}
              drift={bgCfg.drift}
              parallax={bgCfg.parallax}
              isZooming={isFreeze}
            />
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

          <div className="absolute inset-0" style={{ zIndex: 2 }}>
            <Suspense fallback={null}>
              <SceneContent />
            </Suspense>
          </div>

          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
            {currentScene.hotspots.map(h => (
              <Hotspot key={h.id} hotspot={h} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
