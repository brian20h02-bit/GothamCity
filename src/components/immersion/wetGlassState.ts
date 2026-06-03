export interface GlassDropSnapshot {
  id: number
  x: number
  y: number
  r: number
  distort: number
}

type Listener = (drops: GlassDropSnapshot[]) => void

let snapshots: GlassDropSnapshot[] = []
const listeners = new Set<Listener>()

export function publishGlassDrops(drops: GlassDropSnapshot[]): void {
  snapshots = drops
  listeners.forEach(fn => fn(drops))
}

export function subscribeGlassDrops(fn: Listener): () => void {
  listeners.add(fn)
  fn(snapshots)
  return () => listeners.delete(fn)
}
