import * as THREE from 'three'
import type { WetDrop, WetTrail } from './wetGlassSimulation'

export const MAP_SIZE = 320

function idx(x: number, y: number) {
  return (y * MAP_SIZE + x) * 4
}

export class WetGlassMapGenerator {
  readonly normalTex: THREE.DataTexture
  readonly flowTex: THREE.DataTexture
  readonly distortTex: THREE.DataTexture

  private normalBuf: Uint8Array
  private flowBuf: Uint8Array
  private distortBuf: Uint8Array

  constructor() {
    const px = MAP_SIZE * MAP_SIZE * 4
    this.normalBuf = new Uint8Array(px)
    this.flowBuf = new Uint8Array(px)
    this.distortBuf = new Uint8Array(px)

    this.normalTex = new THREE.DataTexture(
      this.normalBuf,
      MAP_SIZE,
      MAP_SIZE,
      THREE.RGBAFormat,
    )
    this.flowTex = new THREE.DataTexture(
      this.flowBuf,
      MAP_SIZE,
      MAP_SIZE,
      THREE.RGBAFormat,
    )
    this.distortTex = new THREE.DataTexture(
      this.distortBuf,
      MAP_SIZE,
      MAP_SIZE,
      THREE.RGBAFormat,
    )

    for (const tex of [this.normalTex, this.flowTex, this.distortTex]) {
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      tex.flipY = false
    }
  }

  clear() {
    for (let i = 0; i < MAP_SIZE * MAP_SIZE; i++) {
      const o = i * 4
      this.normalBuf[o] = 128
      this.normalBuf[o + 1] = 128
      this.normalBuf[o + 2] = 255
      this.normalBuf[o + 3] = 255
      this.flowBuf[o] = 128
      this.flowBuf[o + 1] = 128
      this.flowBuf[o + 2] = 0
      this.flowBuf[o + 3] = 255
      this.distortBuf[o] = 0
      this.distortBuf[o + 1] = 0
      this.distortBuf[o + 2] = 0
      this.distortBuf[o + 3] = 255
    }
  }

  private blendNormal(px: number, py: number, nx: number, ny: number, nz: number, weight: number) {
    if (px < 0 || py < 0 || px >= MAP_SIZE || py >= MAP_SIZE) return
    const o = idx(px, py)
    const w = Math.min(1, weight)
    const inv = 1 - w
    const ex = (this.normalBuf[o] / 255) * 2 - 1
    const ey = (this.normalBuf[o + 1] / 255) * 2 - 1
    const ez = (this.normalBuf[o + 2] / 255) * 2 - 1
    let bx = ex * inv + nx * w
    let by = ey * inv + ny * w
    let bz = ez * inv + nz * w
    const len = Math.hypot(bx, by, bz) || 1
    bx /= len
    by /= len
    bz /= len
    this.normalBuf[o] = Math.round((bx * 0.5 + 0.5) * 255)
    this.normalBuf[o + 1] = Math.round((by * 0.5 + 0.5) * 255)
    this.normalBuf[o + 2] = Math.round((bz * 0.5 + 0.5) * 255)
  }

  private setDistort(px: number, py: number, amount: number) {
    if (px < 0 || py < 0 || px >= MAP_SIZE || py >= MAP_SIZE) return
    const o = idx(px, py)
    this.distortBuf[o] = Math.max(this.distortBuf[o], Math.round(Math.min(1, amount) * 255))
  }

  private setFlow(px: number, py: number, fx: number, fy: number, alpha: number) {
    if (px < 0 || py < 0 || px >= MAP_SIZE || py >= MAP_SIZE) return
    const o = idx(px, py)
    const w = Math.min(1, alpha)
    const inv = 1 - w
    const ex = (this.flowBuf[o] / 255) * 2 - 1
    const ey = (this.flowBuf[o + 1] / 255) * 2 - 1
    const bx = ex * inv + fx * w
    const by = ey * inv + fy * w
    this.flowBuf[o] = Math.round((bx * 0.5 + 0.5) * 255)
    this.flowBuf[o + 1] = Math.round((by * 0.5 + 0.5) * 255)
  }

  private stampDrop(drop: WetDrop) {
    const cx = Math.round(drop.nx * MAP_SIZE)
    const cy = Math.round((1 - drop.ny) * MAP_SIZE)
    const rPx = Math.max(2, Math.round(drop.radius * MAP_SIZE))
    const strength = drop.kind === 'large' ? 1 : drop.kind === 'medium' ? 0.75 : 0.55

    for (let py = cy - rPx; py <= cy + rPx; py++) {
      for (let px = cx - rPx; px <= cx + rPx; px++) {
        const dx = (px + 0.5 - cx) / rPx
        const dy = (py + 0.5 - cy) / rPx
        const dist = Math.hypot(dx, dy)
        if (dist >= 1) continue
        const lens = 1 - dist * dist
        const nz = Math.sqrt(Math.max(0.01, lens))
        const nx = (dx / Math.max(0.001, dist)) * (1 - nz) * strength
        const ny = (dy / Math.max(0.001, dist)) * (1 - nz) * strength
        this.blendNormal(px, py, nx, ny, nz, lens * strength)
        this.setDistort(px, py, lens * 0.85 * strength)
      }
    }
  }

  private stampTrail(trail: WetTrail) {
    const ax = trail.ax * MAP_SIZE
    const ay = (1 - trail.ay) * MAP_SIZE
    const bx = trail.bx * MAP_SIZE
    const by = (1 - trail.by) * MAP_SIZE
    const dx = bx - ax
    const dy = by - ay
    const len = Math.hypot(dx, dy)
    if (len < 1) return

    const nx = dx / len
    const ny = dy / len
    const pxn = -ny
    const pyn = nx
    const halfW = Math.max(1, trail.width * MAP_SIZE * 0.5)
    const steps = Math.ceil(len)
    const fade = trail.life / trail.maxLife

    for (let s = 0; s <= steps; s++) {
      const t = s / steps
      const cx = ax + dx * t
      const cy = ay + dy * t
      for (let w = -halfW; w <= halfW; w++) {
        const px = Math.round(cx + pxn * w)
        const py = Math.round(cy + pyn * w)
        const edge = 1 - Math.abs(w) / (halfW + 0.001)
        const wgt = edge * fade * 0.65
        this.blendNormal(px, py, pxn * 0.35, pyn * 0.35, 0.92, wgt)
        this.setFlow(px, py, nx, ny, wgt)
        this.setDistort(px, py, wgt * 0.45)
      }
    }
  }

  /** Micro wetness — film base muy sutil */
  private stampBaseFilm(intensity: number, time: number) {
    const step = 6
    for (let py = 0; py < MAP_SIZE; py += step) {
      for (let px = 0; px < MAP_SIZE; px += step) {
        const u = px / MAP_SIZE
        const v = py / MAP_SIZE
        const n =
          Math.sin(u * 36 + time * 0.25) * Math.cos(v * 28 - time * 0.2) * 0.035 * intensity
        const m =
          Math.sin(u * 18 - time * 0.12) * Math.sin(v * 22 + time * 0.15) * 0.022 * intensity
        this.blendNormal(px, py, n, m, 0.99, 0.08 * intensity)
        this.setDistort(px, py, (Math.abs(n) + Math.abs(m)) * 0.15)
      }
    }
  }

  rebuild(drops: WetDrop[], trails: WetTrail[], intensity: number, time: number) {
    this.clear()
    this.stampBaseFilm(intensity, time)

    const sorted = [...drops].sort((a, b) => a.radius - b.radius)
    for (const trail of trails) this.stampTrail(trail)
    for (const drop of sorted) this.stampDrop(drop)
  }

  upload() {
    this.normalTex.needsUpdate = true
    this.flowTex.needsUpdate = true
    this.distortTex.needsUpdate = true
  }

  dispose() {
    this.normalTex.dispose()
    this.flowTex.dispose()
    this.distortTex.dispose()
  }
}
