export type DropKind = 'large' | 'medium'
export type DropPhase = 'static' | 'rest' | 'slide' | 'fade'

export interface WetDrop {
  id: number
  nx: number
  ny: number
  radius: number
  kind: DropKind
  phase: DropPhase
  restTicks: number
  vx: number
  vy: number
  wobble: number
  wobbleSpeed: number
  trailOrigin: { x: number; y: number } | null
}

export interface WetTrail {
  ax: number
  ay: number
  bx: number
  by: number
  width: number
  life: number
  maxLife: number
}

export interface WetGlassCounts {
  large: number
  medium: number
}

let nextId = 0

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function kindRadius(kind: DropKind): number {
  if (kind === 'large') return rand(0.028, 0.062)
  return rand(0.006, 0.02)
}

export function getDropCounts(intensity: number): WetGlassCounts {
  return {
    large: Math.min(40, Math.max(20, Math.round(20 + intensity * 20))),
    medium: Math.min(150, Math.max(80, Math.round(80 + intensity * 70))),
  }
}

export function createDrop(
  kind: DropKind,
  phase: DropPhase = 'rest',
  nx?: number,
  ny?: number,
): WetDrop {
  return {
    id: nextId++,
    nx: nx ?? rand(0.04, 0.96),
    ny: ny ?? rand(0.04, 0.92),
    radius: kindRadius(kind),
    kind,
    phase,
    restTicks: phase === 'static' ? Infinity : Math.round(rand(120, 420)),
    vx: 0,
    vy: 0,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: rand(0.006, 0.018),
    trailOrigin: null,
  }
}

export class WetGlassSimulation {
  drops: WetDrop[] = []
  trails: WetTrail[] = []
  private spawnCd = 0
  private windPhase = Math.random() * Math.PI * 2
  private counts: WetGlassCounts = { large: 28, medium: 100 }

  reset(intensity: number) {
    this.drops = []
    this.trails = []
    this.spawnCd = 0
    this.counts = getDropCounts(intensity)

    const staticLarge = Math.round(this.counts.large * 0.42)
    const staticMedium = Math.round(this.counts.medium * 0.38)
    const restMedium = this.counts.medium - staticMedium
    const restLarge = this.counts.large - staticLarge

    for (let i = 0; i < staticLarge; i++) {
      this.drops.push(createDrop('large', 'static'))
    }
    for (let i = 0; i < restLarge; i++) {
      this.drops.push(createDrop('large', 'rest'))
    }
    for (let i = 0; i < staticMedium; i++) {
      this.drops.push(createDrop('medium', 'static'))
    }
    for (let i = 0; i < restMedium; i++) {
      this.drops.push(createDrop('medium', 'rest'))
    }
  }

  tick(intensity: number, windAngle: number) {
    if (intensity <= 0) return

    this.windPhase += 0.003
    const windX =
      Math.sin(windAngle + this.windPhase) * (0.00006 + intensity * 0.0001) +
      Math.sin(this.windPhase * 2.3) * 0.000025

    const maxDrops = this.counts.large + this.counts.medium + 8
    this.spawnCd++

    if (this.spawnCd > 140 && this.drops.length < maxDrops && Math.random() < intensity * 0.14) {
      this.spawnCd = 0
      const d = createDrop('medium', 'slide')
      d.ny = rand(0.02, 0.2)
      d.vy = rand(0.00018, 0.00038)
      d.vx = windX * 1.6
      d.trailOrigin = { x: d.nx, y: d.ny }
      this.drops.push(d)
    }

    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i]

      if (d.phase === 'static') continue

      if (d.phase === 'rest') {
        d.wobble += d.wobbleSpeed
        d.nx += Math.sin(d.wobble) * 0.00003
        d.restTicks--
        const slideChance = d.kind === 'large' ? 0.06 : 0.14
        if (d.restTicks <= 0 && Math.random() < slideChance) {
          d.phase = 'slide'
          d.trailOrigin = { x: d.nx, y: d.ny }
          d.vy = rand(0.00022, 0.00048) + d.radius * 0.003
          d.vx = windX + Math.sin(d.wobble) * 0.00005
        }
      } else if (d.phase === 'slide') {
        d.vy += rand(0.000006, 0.000014)
        d.vx += windX * 0.28 + Math.sin(d.wobble + this.windPhase * 1.4) * 0.000012
        d.wobble += d.wobbleSpeed * 1.2
        d.nx += d.vx + Math.sin(d.wobble * 1.3) * 0.00004
        d.ny += d.vy
        if (d.ny > 1.05) d.phase = 'fade'
      } else {
        d.radius *= 0.993
        if (d.radius < 0.003) this.drops.splice(i, 1)
      }
    }

    for (let i = 0; i < this.drops.length; i++) {
      for (let j = i + 1; j < this.drops.length; j++) {
        const a = this.drops[i]
        const b = this.drops[j]
        const dist = Math.hypot(a.nx - b.nx, a.ny - b.ny)
        if (dist < a.radius + b.radius) {
          const merged = Math.sqrt(a.radius * a.radius + b.radius * b.radius) * 0.88
          a.nx = (a.nx + b.nx) / 2
          a.ny = (a.ny + b.ny) / 2
          a.radius = Math.min(merged, a.kind === 'large' ? 0.08 : 0.042)
          if (a.phase === 'rest' && b.phase === 'slide') a.phase = 'slide'
          this.drops.splice(j, 1)
          break
        }
      }
    }

    const activeTrails = this.drops
      .filter(d => d.phase === 'slide' && d.trailOrigin)
      .map(d => ({
        ax: d.trailOrigin!.x,
        ay: d.trailOrigin!.y,
        bx: d.nx,
        by: d.ny,
        width: d.radius * 0.5,
        life: 1,
        maxLife: 1,
      }))

    for (const t of activeTrails) {
      const existing = this.trails.find(
        tr => Math.abs(tr.ax - t.ax) < 0.001 && Math.abs(tr.ay - t.ay) < 0.001,
      )
      if (existing) {
        existing.bx = t.bx
        existing.by = t.by
        existing.life = 1
      } else {
        this.trails.push({ ...t })
      }
    }

    for (let i = this.trails.length - 1; i >= 0; i--) {
      this.trails[i].life -= 0.0038
      if (this.trails[i].life <= 0) this.trails.splice(i, 1)
    }

    if (this.trails.length > 32) this.trails.splice(0, this.trails.length - 32)
  }
}
