import type { AtmosphereRegion, SceneAtmosphereProfile } from '@/data/sceneAtmosphere'
import {
  isArkhamExteriorScene,
  isArkhamWindHowlScene,
} from '@/data/sceneAtmosphere'
import type { SceneId } from '@/core/navigation/types'
import { AUDIO_PATHS, loadAudioSample, playBuffer } from './audioSampleLoader'

type LayerHandle = { stop: () => void }

class ImmersionAudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private ambientBus: GainNode | null = null
  private rainBus: GainNode | null = null
  private sfxBus: GainNode | null = null
  private ambientLayers: LayerHandle[] = []
  private rainLayers: LayerHandle[] = []
  private rainSampleLayer: LayerHandle | null = null
  private windHowlLayer: LayerHandle | null = null
  private windHowlBuffer: AudioBuffer | null = null
  private currentRegion: AtmosphereRegion | null = null
  private currentSceneId: SceneId | null = null
  private arkhamAudioPhase: 'exterior' | 'interior' | null = null
  private rainLoadGeneration = 0
  private detectiveFilter: BiquadFilterNode | null = null
  private initialized = false
  private muted = false
  private introPlaying = false

  async ensureReady(): Promise<void> {
    if (this.initialized && this.ctx) {
      if (this.ctx.state === 'suspended') await this.ctx.resume()
      return
    }
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return

    this.ctx = new Ctx()
    this.master = this.ctx.createGain()
    this.master.gain.value = this.muted ? 0 : 0.92

    this.ambientBus = this.ctx.createGain()
    this.ambientBus.gain.value = 0

    this.rainBus = this.ctx.createGain()
    this.rainBus.gain.value = 0

    this.sfxBus = this.ctx.createGain()
    this.sfxBus.gain.value = 0.85

    this.detectiveFilter = this.ctx.createBiquadFilter()
    this.detectiveFilter.type = 'lowpass'
    this.detectiveFilter.frequency.value = 12000

    this.ambientBus.connect(this.detectiveFilter)
    this.rainBus.connect(this.detectiveFilter)
    this.detectiveFilter.connect(this.master)
    this.sfxBus.connect(this.master)
    this.master.connect(this.ctx.destination)

    this.initialized = true
    await this.ctx.resume()
    void this.preloadSamples()
  }

  /** Precarga wind-howl para arranque instantáneo en Arkham */
  async preloadSamples(): Promise<void> {
    await this.ensureReady()
    if (!this.ctx || this.windHowlBuffer) return
    const buf = await loadAudioSample(this.ctx, AUDIO_PATHS.windHowl)
    if (buf) this.windHowlBuffer = buf
  }

  setMuted(m: boolean): void {
    this.muted = m
    if (this.master) this.master.gain.value = m ? 0 : 0.92
  }

  private clearLayers(layers: LayerHandle[]): void {
    layers.forEach(l => l.stop())
    layers.length = 0
  }

  private fadeGain(node: GainNode, to: number, sec: number): void {
    if (!this.ctx) return
    const t = this.ctx.currentTime
    node.gain.cancelScheduledValues(t)
    node.gain.setValueAtTime(node.gain.value, t)
    node.gain.linearRampToValueAtTime(to, sec < 0.05 ? t + 0.05 : t + sec)
  }

  private makeNoise(type: 'white' | 'pink' = 'pink', duration = 2): AudioBuffer {
    const ctx = this.ctx!
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let b0 = 0; let b1 = 0; let b2 = 0; let b3 = 0; let b4 = 0; let b5 = 0; let b6 = 0
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1
      if (type === 'white') {
        data[i] = white * 0.5
      } else {
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.969 * b2 + white * 0.153852
        b3 = 0.8665 * b3 + white * 0.3104856
        b4 = 0.55 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.016898
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
        b6 = white * 0.115926
      }
    }
    return buffer
  }

  private loopNoise(
    bus: GainNode,
    filterType: BiquadFilterNode['type'],
    freq: number,
    gain: number,
    q = 1,
  ): LayerHandle {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = this.makeNoise('pink', 4)
    src.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = filterType
    filter.frequency.value = freq
    filter.Q.value = q
    const g = ctx.createGain()
    g.gain.value = gain
    src.connect(filter)
    filter.connect(g)
    g.connect(bus)
    src.start()
    return { stop: () => { try { src.stop() } catch { /* */ } src.disconnect() } }
  }

  /** Lluvia — rain-heavy prohibido en interior Arkham (atrio+) */
  private buildRain(region: AtmosphereRegion, intensity: number): void {
    if (!this.ctx || !this.rainBus) return

    this.rainLoadGeneration++
    const loadGen = this.rainLoadGeneration

    this.clearLayers(this.rainLayers)
    if (this.rainSampleLayer) {
      this.rainSampleLayer.stop()
      this.rainSampleLayer = null
    }

    if (intensity <= 0 || region === 'arkham' || !this.shouldPlayRainHeavy()) {
      if (this.rainBus && this.ctx) {
        const t = this.ctx.currentTime
        this.rainBus.gain.cancelScheduledValues(t)
        this.rainBus.gain.setValueAtTime(0, t)
      }
      return
    }

    const bus = this.rainBus
    const layers: LayerHandle[] = []
    const i = Math.max(0.15, intensity)

    layers.push(this.loopNoise(bus, 'bandpass', 350 + i * 200, 0.14 * i, 0.5))
    layers.push(this.loopNoise(bus, 'bandpass', 700 + i * 150, 0.12 * i, 0.8))
    layers.push(this.loopNoise(bus, 'bandpass', 1400, 0.08 * i, 1.2))
    layers.push(this.loopNoise(bus, 'highpass', 2800, 0.05 * i))
    layers.push(this.loopNoise(bus, 'lowpass', 160, 0.18 * i))
    layers.push(this.loopNoise(bus, 'lowpass', 600, 0.1 * i))

    this.rainLayers = layers

    loadAudioSample(this.ctx, AUDIO_PATHS.rainHeavy).then(buf => {
      if (loadGen !== this.rainLoadGeneration) return
      if (!buf || !this.rainBus || !this.shouldPlayRainHeavy()) return
      this.rainSampleLayer = playBuffer(this.ctx!, this.rainBus, buf, 0.35 * i, true)
    })
  }

  private stopWindHowl(): void {
    if (this.windHowlLayer) {
      this.windHowlLayer.stop()
      this.windHowlLayer = null
    }
  }

  /** Corta lluvia procedural + rain-heavy al instante */
  private stopRainCompletely(): void {
    this.rainLoadGeneration++
    this.clearLayers(this.rainLayers)
    if (this.rainSampleLayer) {
      this.rainSampleLayer.stop()
      this.rainSampleLayer = null
    }
    if (this.rainBus && this.ctx) {
      const t = this.ctx.currentTime
      this.rainBus.gain.cancelScheduledValues(t)
      this.rainBus.gain.setValueAtTime(0, t)
    }
  }

  private shouldPlayRainHeavy(): boolean {
    if (!this.currentSceneId) return true
    if (isArkhamWindHowlScene(this.currentSceneId)) return false
    if (this.arkhamAudioPhase === 'interior') return false
    return true
  }

  private buildAmbient(region: AtmosphereRegion): void {
    if (!this.ctx || !this.ambientBus) return
    this.stopWindHowl()
    this.clearLayers(this.ambientLayers)

    const bus = this.ambientBus
    const layers: LayerHandle[] = []

    switch (region) {
      case 'crime-alley':
        layers.push(this.loopNoise(bus, 'bandpass', 1200, 0.025))
        this.scheduleMetalDrip(bus, layers, 0.03)
        this.scheduleDistantSirens(bus, layers, 0.018)
        this.scheduleTrafficRumble(bus, layers, 0.015)
        this.scheduleAlleyWind(bus, layers)
        break

      case 'gotham':
        this.scheduleDistantSirens(bus, layers, 0.012)
        this.scheduleTrafficRumble(bus, layers, 0.012)
        layers.push(this.loopNoise(bus, 'bandpass', 250, 0.02, 2))
        break

      case 'arkham':
        layers.push(this.loopNoise(bus, 'lowpass', 260, 0.02))
        layers.push(this.loopNoise(bus, 'bandpass', 900, 0.012, 2))
        this.scheduleMetalDrip(bus, layers, 0.012)
        this.scheduleBuildingCreak(bus, layers, 0.008)
        break

      case 'wayne':
        layers.push(this.loopNoise(bus, 'bandpass', 1800, 0.015))
        layers.push(this.loopNoise(bus, 'lowpass', 120, 0.02))
        this.scheduleGlassRain(bus, layers)
        this.scheduleBuildingCreak(bus, layers, 0.01)
        break

      case 'batcomputer':
        layers.push(this.loopNoise(bus, 'lowpass', 180, 0.04))
        layers.push(this.loopNoise(bus, 'bandpass', 400, 0.025))
        layers.push(this.loopNoise(bus, 'bandpass', 2200, 0.015))
        this.addServerHum(bus, layers)
        this.addElectricalHum(bus, layers)
        break

      case 'narrows':
        this.scheduleAggressiveWind(bus, layers)
        this.scheduleDistantSirens(bus, layers, 0.028)
        this.scheduleHelicopter(bus, layers)
        this.scheduleTrafficRumble(bus, layers, 0.02)
        this.scheduleMetalDrip(bus, layers, 0.02)
        break

      case 'archives':
        layers.push(this.loopNoise(bus, 'lowpass', 400, 0.025))
        break
    }

    this.ambientLayers = layers
  }

  /** Interior Arkham — sin gotas metálicas ni capas que suenen a lluvia */
  private buildArkhamInteriorAmbient(): void {
    if (!this.ctx || !this.ambientBus) return
    this.clearLayers(this.ambientLayers)

    const bus = this.ambientBus
    const layers: LayerHandle[] = []
    layers.push(this.loopNoise(bus, 'lowpass', 160, 0.01))
    layers.push(this.loopNoise(bus, 'bandpass', 380, 0.005, 2.5))
    this.scheduleBuildingCreak(bus, layers, 0.005)
    this.ambientLayers = layers
  }

  private addServerHum(bus: GainNode, layers: LayerHandle[]): void {
    layers.push(this.loopNoise(bus, 'bandpass', 800, 0.012, 2))
    layers.push(this.loopNoise(bus, 'lowpass', 120, 0.018))
  }

  private addElectricalHum(bus: GainNode, layers: LayerHandle[]): void {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 60
    const g = ctx.createGain()
    g.gain.value = 0.004
    osc.connect(g)
    g.connect(bus)
    osc.start()
    layers.push({ stop: () => { osc.stop() } })
  }

  /** wind-howl — interior Arkham desde atrio (60%) */
  private startArkhamWind(volume: number, sceneId: SceneId): void {
    if (!this.ambientBus || !this.ctx) return
    if (!isArkhamWindHowlScene(sceneId)) return

    const bus = this.ambientBus
    const ctx = this.ctx
    const vol = Math.min(1, Math.max(0.6, volume))

    const start = (buf: AudioBuffer) => {
      if (this.currentSceneId !== sceneId || !isArkhamWindHowlScene(sceneId)) return
      this.stopWindHowl()
      this.windHowlLayer = playBuffer(ctx, bus, buf, vol, true, 0.35)
    }

    if (this.windHowlBuffer) {
      start(this.windHowlBuffer)
      return
    }

    loadAudioSample(ctx, AUDIO_PATHS.windHowl).then(buf => {
      if (!buf) return
      this.windHowlBuffer = buf
      start(buf)
    })
  }

  private scheduleGlassRain(bus: GainNode, layers: LayerHandle[]): void {
    const ctx = this.ctx!
    let cancelled = false
    const tick = () => {
      if (cancelled || !this.ctx) return
      const buf = this.makeNoise('pink', 0.15)
      const src = ctx.createBufferSource()
      src.buffer = buf
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 2500 + Math.random() * 1500
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.012, ctx.currentTime + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2)
      src.connect(filter)
      filter.connect(g)
      g.connect(bus)
      src.start()
      setTimeout(tick, 800 + Math.random() * 2500)
    }
    tick()
    layers.push({ stop: () => { cancelled = true } })
  }

  private scheduleMetalDrip(bus: GainNode, layers: LayerHandle[], vol: number): void {
    const ctx = this.ctx!
    let cancelled = false
    const tick = () => {
      if (cancelled || !this.ctx) return
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800 + Math.random() * 600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + 0.005)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)
      osc.connect(g)
      g.connect(bus)
      osc.start()
      osc.stop(ctx.currentTime + 0.15)
      setTimeout(tick, 2000 + Math.random() * 5000)
    }
    tick()
    layers.push({ stop: () => { cancelled = true } })
  }

  private scheduleBuildingCreak(bus: GainNode, layers: LayerHandle[], vol: number): void {
    const ctx = this.ctx!
    let cancelled = false
    const tick = () => {
      if (cancelled || !this.ctx) return
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(80 + Math.random() * 40, ctx.currentTime)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, ctx.currentTime)
      g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.5)
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 2)
      osc.connect(g)
      g.connect(bus)
      osc.start()
      osc.stop(ctx.currentTime + 2.1)
      setTimeout(tick, 15000 + Math.random() * 25000)
    }
    setTimeout(tick, 5000)
    layers.push({ stop: () => { cancelled = true } })
  }

  private scheduleAlleyWind(bus: GainNode, layers: LayerHandle[]): void {
    layers.push(this.loopNoise(bus, 'bandpass', 300, 0.022, 3))
  }

  private scheduleAggressiveWind(bus: GainNode, layers: LayerHandle[]): void {
    layers.push(this.loopNoise(bus, 'lowpass', 500, 0.05))
    layers.push(this.loopNoise(bus, 'bandpass', 200, 0.032, 2))
  }

  private scheduleTrafficRumble(bus: GainNode, layers: LayerHandle[], vol: number): void {
    const ctx = this.ctx!
    let cancelled = false
    const tick = () => {
      if (cancelled || !this.ctx) return
      const buf = this.makeNoise('pink', 1.5)
      const src = ctx.createBufferSource()
      src.buffer = buf
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 200
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, ctx.currentTime)
      g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.8)
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 3)
      src.connect(filter)
      filter.connect(g)
      g.connect(bus)
      src.start()
      setTimeout(tick, 8000 + Math.random() * 15000)
    }
    setTimeout(tick, 4000)
    layers.push({ stop: () => { cancelled = true } })
  }

  private scheduleDistantSirens(bus: GainNode, layers: LayerHandle[], vol: number): void {
    const ctx = this.ctx!
    let cancelled = false
    const tick = () => {
      if (cancelled || !this.ctx) return
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      const t0 = ctx.currentTime
      osc.frequency.setValueAtTime(280, t0)
      osc.frequency.linearRampToValueAtTime(420, t0 + 1.2)
      osc.frequency.linearRampToValueAtTime(280, t0 + 2.4)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, t0)
      g.gain.linearRampToValueAtTime(vol, t0 + 0.5)
      g.gain.linearRampToValueAtTime(0, t0 + 3)
      osc.connect(g)
      g.connect(bus)
      osc.start()
      osc.stop(t0 + 3.1)
      setTimeout(tick, 18000 + Math.random() * 30000)
    }
    setTimeout(tick, 8000)
    layers.push({ stop: () => { cancelled = true } })
  }

  private scheduleHelicopter(bus: GainNode, layers: LayerHandle[]): void {
    const ctx = this.ctx!
    let cancelled = false
    const tick = () => {
      if (cancelled || !this.ctx) return
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      const t0 = ctx.currentTime
      osc.frequency.setValueAtTime(90, t0)
      osc.frequency.linearRampToValueAtTime(110, t0 + 4)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, t0)
      g.gain.linearRampToValueAtTime(0.015, t0 + 1)
      g.gain.linearRampToValueAtTime(0.015, t0 + 5)
      g.gain.linearRampToValueAtTime(0, t0 + 8)
      osc.connect(g)
      g.connect(bus)
      osc.start()
      osc.stop(t0 + 8.1)
      setTimeout(tick, 35000 + Math.random() * 45000)
    }
    setTimeout(tick, 12000)
    layers.push({ stop: () => { cancelled = true } })
  }

  private rainIntensityForRegion(region: AtmosphereRegion): number {
    const map: Record<AtmosphereRegion, number> = {
      gotham: 0.7, 'crime-alley': 0.88, arkham: 0, wayne: 0.3,
      batcomputer: 0, narrows: 0.9, archives: 0.45,
    }
    return map[region]
  }

  async syncScene(sceneId: SceneId, profile: SceneAtmosphereProfile): Promise<void> {
    await this.ensureReady()
    if (this.introPlaying) return

    const region = profile.region
    const regionChanged = region !== this.currentRegion
    const prevPhase = this.arkhamAudioPhase
    this.currentSceneId = sceneId

    /* ── Atrio y posteriores: cero lluvia, solo wind-howl ── */
    if (isArkhamWindHowlScene(sceneId)) {
      this.arkhamAudioPhase = 'interior'
      this.currentRegion = 'arkham'
      this.stopRainCompletely()

      if (regionChanged || prevPhase !== 'interior') {
        this.stopWindHowl()
        this.buildArkhamInteriorAmbient()
        this.startArkhamWind(profile.windVolume, sceneId)
      } else if (!this.windHowlLayer) {
        this.startArkhamWind(profile.windVolume, sceneId)
      }
      if (this.ambientBus) {
        this.fadeGain(
          this.ambientBus,
          profile.ambientVolume,
          prevPhase === 'interior' ? 0.08 : 0.2,
        )
      }
      return
    }

    if (regionChanged) {
      const fastArkham = region === 'arkham' || this.currentRegion === 'arkham'
      if (!fastArkham) {
        if (this.ambientBus) this.fadeGain(this.ambientBus, 0, 0.4)
        if (this.rainBus) this.fadeGain(this.rainBus, 0, 0.4)
        await new Promise(r => setTimeout(r, 420))
      }
      this.stopWindHowl()
      this.clearLayers(this.ambientLayers)
      this.clearLayers(this.rainLayers)
      if (this.rainSampleLayer) {
        this.rainSampleLayer.stop()
        this.rainSampleLayer = null
      }
      this.currentRegion = region
      if (region !== 'arkham') this.arkhamAudioPhase = null
      this.buildAmbient(region)
    }

    if (isArkhamExteriorScene(sceneId)) {
      this.arkhamAudioPhase = 'exterior'
      this.stopWindHowl()
      this.buildRain('gotham', 0.72)
      if (this.rainBus) this.fadeGain(this.rainBus, profile.rainVolume, 0.35)
      if (this.ambientBus) this.fadeGain(this.ambientBus, profile.ambientVolume, 0.35)
      return
    }

    this.arkhamAudioPhase = null
    this.stopWindHowl()
    if (regionChanged) {
      this.buildRain(region, this.rainIntensityForRegion(region))
    }
    const rv = region === 'batcomputer' ? 0 : profile.rainVolume
    if (this.rainBus) this.fadeGain(this.rainBus, rv, regionChanged ? 1.8 : 0.35)
    if (this.ambientBus) {
      this.fadeGain(this.ambientBus, profile.ambientVolume, regionChanged ? 1.8 : 0.35)
    }
  }

  stopIntroAmbience(): void {
    this.introPlaying = false
    this.currentRegion = null
    this.currentSceneId = null
    this.arkhamAudioPhase = null
    this.stopWindHowl()
    this.clearLayers(this.ambientLayers)
    this.clearLayers(this.rainLayers)
    if (this.rainSampleLayer) { this.rainSampleLayer.stop(); this.rainSampleLayer = null }
    if (this.ambientBus) this.fadeGain(this.ambientBus, 0, 1.2)
    if (this.rainBus) this.fadeGain(this.rainBus, 0, 1.2)
  }

  async playIntroAmbience(): Promise<void> {
    await this.ensureReady()
    if (!this.ctx || !this.ambientBus || !this.rainBus) return
    this.introPlaying = true
    this.currentRegion = null
    this.clearLayers(this.ambientLayers)
    this.clearLayers(this.rainLayers)

    const bus = this.ambientBus
    const layers: LayerHandle[] = []
    layers.push(this.loopNoise(bus, 'lowpass', 400, 0.035))
    layers.push(this.loopNoise(bus, 'bandpass', 250, 0.02, 2))
    this.ambientLayers = layers

    this.buildRain('gotham', 0.75)

    this.fadeGain(bus, 0.4, 2)
    this.fadeGain(this.rainBus, 0.78, 2.5)
  }

  async setDetectiveMode(on: boolean): Promise<void> {
    await this.ensureReady()
    if (!this.ctx || !this.detectiveFilter) return
    const t = this.ctx.currentTime
    this.detectiveFilter.frequency.linearRampToValueAtTime(on ? 4000 : 12000, t + 0.8)
  }

  private playOneShot(fn: (ctx: AudioContext, bus: GainNode, t: number) => void): void {
    if (!this.ctx || !this.sfxBus || this.muted) return
    fn(this.ctx, this.sfxBus, this.ctx.currentTime)
  }

  /** Murciélagos al entrar a escenarios principales */
  async playBatSwarm(): Promise<void> {
    await this.ensureReady()
    if (!this.ctx || !this.sfxBus) return

    const sample = await loadAudioSample(this.ctx, AUDIO_PATHS.batsSwarm)
    if (sample) {
      playBuffer(this.ctx, this.sfxBus, sample, 0.55, false)
      return
    }

    this.playOneShot((ctx, bus, t0) => {
      const count = 35 + Math.floor(Math.random() * 25)
      for (let i = 0; i < count; i++) {
        const delay = Math.random() * 2.2
        const t = t0 + delay
        const chirp = ctx.createOscillator()
        chirp.type = 'sine'
        chirp.frequency.setValueAtTime(3000 + Math.random() * 5000, t)
        chirp.frequency.exponentialRampToValueAtTime(1500 + Math.random() * 2000, t + 0.025)
        const cg = ctx.createGain()
        cg.gain.setValueAtTime(0, t)
        cg.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.03, t + 0.005)
        cg.gain.linearRampToValueAtTime(0, t + 0.04)
        chirp.connect(cg)
        cg.connect(bus)
        chirp.start(t)
        chirp.stop(t + 0.05)
      }
      const wing = ctx.createBufferSource()
      wing.buffer = this.makeNoise('pink', 0.5)
      const wf = ctx.createBiquadFilter()
      wf.type = 'bandpass'
      wf.frequency.value = 400
      wf.Q.value = 1
      const wg = ctx.createGain()
      wg.gain.setValueAtTime(0, t0)
      wg.gain.linearRampToValueAtTime(0.08, t0 + 0.3)
      wg.gain.linearRampToValueAtTime(0.06, t0 + 1.5)
      wg.gain.linearRampToValueAtTime(0, t0 + 2.8)
      wing.connect(wf)
      wf.connect(wg)
      wg.connect(bus)
      wing.start(t0)
      wing.stop(t0 + 3)
    })
  }

  playDetectiveActivate(): void {
    this.playOneShot((ctx, bus, t) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(100, t)
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.35)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.035, t + 0.1)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
      osc.connect(g)
      g.connect(bus)
      osc.start(t)
      osc.stop(t + 0.55)
    })
  }

  playDetectiveDeactivate(): void {
    this.playOneShot((ctx, bus, t) => {
      const osc = ctx.createOscillator()
      osc.frequency.setValueAtTime(180, t)
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.5)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.03, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55)
      osc.connect(g)
      g.connect(bus)
      osc.start(t)
      osc.stop(t + 0.6)
    })
  }

  playEvidenceFound(isFinal = false): void {
    this.playOneShot((ctx, bus, t) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(isFinal ? 48 : 65, t)
      osc.frequency.exponentialRampToValueAtTime(isFinal ? 96 : 48, t + (isFinal ? 1.5 : 0.6))
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(isFinal ? 0.1 : 0.05, t + 0.05)
      g.gain.exponentialRampToValueAtTime(0.0001, t + (isFinal ? 1.8 : 0.8))
      osc.connect(g)
      g.connect(bus)
      osc.start(t)
      osc.stop(t + (isFinal ? 1.9 : 0.9))
    })
  }

  playIntroBlip(): void { /* no-op */ }
}

export const immersionAudio = new ImmersionAudioEngine()

export function bindAudioUnlock(): () => void {
  const unlock = () => {
    immersionAudio.ensureReady()
    void immersionAudio.preloadSamples()
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
  }
  window.addEventListener('pointerdown', unlock, { once: true })
  window.addEventListener('keydown', unlock, { once: true })
  return unlock
}
