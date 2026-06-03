import { useMemo, useState } from 'react'
import { useScene } from '@/core/navigation/SceneContext'
import { useDetective } from '@/core/detective/DetectiveContext'
import { getReadFileAnchorsForScene, type ReadFileContent } from '@/data/readFileAnchors'
import { getPatientById } from '@/data/arkhamRecords'
import { buildReadFileHint } from '@/core/interaction/contextualLabels'
import InfoHotspot from './InfoHotspot'
import ReadFileModal from './ReadFileModal'
import { anchorToHitProps } from './hotspotGeometry'

export default function ReadFileLayer() {
  const { currentScene, transition } = useScene()
  const { active: detectiveOn } = useDetective()
  const [openContent, setOpenContent] = useState<ReadFileContent | null>(null)

  const anchors = useMemo(
    () => getReadFileAnchorsForScene(currentScene.id),
    [currentScene.id],
  )

  const busy = transition.active

  const modalProps = useMemo(() => {
    if (!openContent) return null
    if (openContent.type === 'subjects') {
      return {
        mode: 'subjects' as const,
        data: {
          title: openContent.title,
          subtitle: openContent.subtitle,
          subjects: openContent.subjects,
        },
      }
    }
    const patient = getPatientById(openContent.patientId)
    if (!patient) return null
    return {
      mode: 'patient' as const,
      data: { title: openContent.title, patient },
    }
  }, [openContent])

  if (anchors.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 41 }}>
      {anchors.map(anchor => {
        const label = anchor.content.type === 'patient'
          ? getPatientById(anchor.content.patientId)?.name ?? 'Patient File'
          : 'Treatment Records'

        return (
          <InfoHotspot
            key={anchor.id}
            {...anchorToHitProps(anchor)}
            hint={buildReadFileHint(label)}
            detectiveOn={detectiveOn}
            disabled={busy}
            ariaLabel={`Read file — ${anchor.element}`}
            debugId={anchor.id}
            elementHint={anchor.element}
            onOpen={() => setOpenContent(anchor.content)}
          />
        )
      })}

      {modalProps?.mode === 'subjects' && (
        <ReadFileModal
          open={!!openContent}
          onClose={() => setOpenContent(null)}
          mode="subjects"
          data={modalProps.data}
        />
      )}
      {modalProps?.mode === 'patient' && (
        <ReadFileModal
          open={!!openContent}
          onClose={() => setOpenContent(null)}
          mode="patient"
          data={modalProps.data}
        />
      )}
    </div>
  )
}
