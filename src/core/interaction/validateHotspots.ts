import type { VisualAnchor } from '@/data/sceneAnchors'
import { navigationAnchors, objectAnchors } from '@/data/sceneAnchors'
import { readFileAnchors } from '@/data/readFileAnchors'
import { detectiveEvidenceList } from '@/data/detectiveEvidence'
export type HotspotCategory = 'navigation' | 'evidence' | 'info'

export interface RegisteredHotspot {
  id:       string
  category: HotspotCategory
  sceneId:  string
  anchor:   VisualAnchor
}

function bounds(a: VisualAnchor) {
  const w = a.width ?? (a.hitRadius ? (a.hitRadius / 8) : 8)
  const h = a.height ?? (a.hitRadius ? (a.hitRadius / 8) : 8)
  return {
    top:    a.top - h / 2,
    left:   a.left - w / 2,
    bottom: a.top + h / 2,
    right:  a.left + w / 2,
  }
}

function overlaps(a: VisualAnchor, b: VisualAnchor): boolean {
  const A = bounds(a)
  const B = bounds(b)
  return !(A.right < B.left || A.left > B.right || A.bottom < B.top || A.top > B.bottom)
}

export function collectAllHotspots(): RegisteredHotspot[] {
  const list: RegisteredHotspot[] = []

  for (const nav of navigationAnchors) {
    list.push({ id: nav.id, category: 'navigation', sceneId: nav.sceneId, anchor: nav })
  }
  for (const [id, anchor] of Object.entries(objectAnchors)) {
    list.push({ id, category: 'evidence', sceneId: anchor.sceneId, anchor })
  }
  for (const info of readFileAnchors) {
    list.push({ id: info.id, category: 'info', sceneId: info.sceneId, anchor: info })
  }

  return list
}

export interface HotspotValidationIssue {
  type: 'duplicate_id' | 'spatial_collision' | 'missing_evidence_anchor'
  message: string
  ids: string[]
  sceneId?: string
}
export function validateHotspots(): HotspotValidationIssue[] {
  const issues: HotspotValidationIssue[] = []
  const all = collectAllHotspots()
  const idMap = new Map<string, RegisteredHotspot[]>()

  for (const h of all) {
    const existing = idMap.get(h.id) ?? []
    existing.push(h)
    idMap.set(h.id, existing)
  }

  for (const [id, entries] of idMap) {
    if (entries.length > 1) {
      issues.push({
        type: 'duplicate_id',
        message: `Hotspot id "${id}" belongs to multiple categories`,
        ids: entries.map(e => `${e.category}:${e.id}`),
        sceneId: entries[0]?.sceneId,
      })
    }
  }

  const byScene = new Map<string, RegisteredHotspot[]>()
  for (const h of all) {
    const scene = byScene.get(h.sceneId) ?? []
    scene.push(h)
    byScene.set(h.sceneId, scene)
  }

  for (const [sceneId, hotspots] of byScene) {
    for (let i = 0; i < hotspots.length; i++) {
      for (let j = i + 1; j < hotspots.length; j++) {
        const a = hotspots[i]
        const b = hotspots[j]
        if (a.category === b.category) continue
        if (overlaps(a.anchor, b.anchor)) {
          issues.push({
            type: 'spatial_collision',
            message: `${a.category} "${a.id}" overlaps ${b.category} "${b.id}" in scene ${sceneId}`,
            ids: [a.id, b.id],
            sceneId,
          })
        }
      }
    }
  }

  for (const ev of detectiveEvidenceList) {
    if (!objectAnchors[ev.id]) {
      issues.push({
        type: 'missing_evidence_anchor',
        message: `Evidence "${ev.id}" (${ev.title}) has no object anchor in sceneAnchors`,
        ids: [ev.id],
        sceneId: ev.sceneId,
      })
    }
  }

  return issues
}

/** Dev-only — log validation issues at startup */
export function runHotspotValidationDev(): void {
  if (!import.meta.env.DEV) return
  const issues = validateHotspots()
  if (issues.length > 0) {
    console.warn('[Gotham] Hotspot validation issues:', issues)
  }
}

runHotspotValidationDev()
