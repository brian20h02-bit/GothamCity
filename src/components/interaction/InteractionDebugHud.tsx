import { useScene } from '@/core/navigation/SceneContext'
import { useDetective } from '@/core/detective/DetectiveContext'
import { useInteractionDebug } from '@/core/interaction/InteractionDebugContext'
import { getSceneBackLabel } from '@/core/navigation/sceneLabels'
import { getNavigationForScene } from '@/data/sceneAnchors'
import { getInvestigationByScene } from '@/data/sceneInvestigations'

export default function InteractionDebugHud() {
  const { enabled } = useInteractionDebug()
  const { currentScene, sceneHistory } = useScene()
  const { active: detectiveOn } = useDetective()

  if (!import.meta.env.DEV || !enabled) return null

  const navAnchors = getNavigationForScene(currentScene.id)
  const hasTrail = !!getInvestigationByScene(currentScene.id)

  return (
    <div
      className="fixed top-4 left-4 z-[10000] font-mono pointer-events-none"
      style={{
        fontSize: '10px',
        lineHeight: 1.55,
        color: 'rgba(140,230,180,0.95)',
        background: 'rgba(4,12,8,0.94)',
        border: '1px solid rgba(80,200,140,0.4)',
        padding: '10px 12px',
        maxWidth: 320,
      }}
    >
      <p style={{ letterSpacing: '2px', marginBottom: 6 }}>INTERACTION DEBUG · CTRL+SHIFT+D</p>
      <p><strong>Scene:</strong> {currentScene.id}</p>
      <p><strong>Detective:</strong> {detectiveOn ? 'ON' : 'off'}</p>
      <p style={{ marginTop: 8 }}><strong>Navigation anchors</strong></p>
      {navAnchors.length === 0 ? (
        <p style={{ opacity: 0.5 }}> (none)</p>
      ) : (
        navAnchors.map(n => (
          <p key={n.id} style={{ color: 'rgba(220,175,90,0.95)' }}>
            ■ {n.element} → {n.targetScene}
          </p>
        ))
      )}
      <p style={{ marginTop: 8 }}><strong>History</strong> ({sceneHistory.length})</p>
      {sceneHistory.map((id, i) => (
        <p key={`${id}-${i}`}>{i + 1}. {getSceneBackLabel(id)}</p>
      ))}
      {hasTrail && detectiveOn && (
        <p style={{ marginTop: 8, color: 'rgba(160,190,255,0.95)' }}>
          ■ Trail steps on visual elements (invisible hitboxes)
        </p>
      )}
    </div>
  )
}
