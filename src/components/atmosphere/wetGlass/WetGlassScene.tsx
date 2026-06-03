import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { WetGlassSimulation } from './wetGlassSimulation'
import { WetGlassMapGenerator } from './wetGlassMaps'
import { createWetGlassMaterial } from './wetGlassShader'

interface Props {
  intensity: number
  windAngle: number
  backgroundUrl?: string
}

export default function WetGlassScene({ intensity, windAngle, backgroundUrl }: Props) {
  const maps = useMemo(() => new WetGlassMapGenerator(), [])
  const sim = useMemo(() => new WetGlassSimulation(), [])
  const mat = useMemo(
    () =>
      createWetGlassMaterial({
        normal: maps.normalTex,
        flow: maps.flowTex,
        distortion: maps.distortTex,
      }),
    [maps],
  )
  const bgRef = useRef<THREE.Texture | null>(null)
  const lastIntensity = useRef(-1)
  const { size } = useThree()

  useEffect(() => {
    return () => {
      bgRef.current?.dispose()
      bgRef.current = null
      maps.dispose()
      mat.dispose()
    }
  }, [maps, mat])

  useEffect(() => {
    if (!backgroundUrl) return
    const loader = new THREE.TextureLoader()
    loader.load(backgroundUrl, tex => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      bgRef.current?.dispose()
      bgRef.current = tex
      mat.uniforms.uBackground.value = tex
    })
  }, [backgroundUrl, mat])

  useEffect(() => {
    if (Math.abs(lastIntensity.current - intensity) > 0.05) {
      sim.reset(intensity)
      lastIntensity.current = intensity
    }
  }, [intensity, sim])

  useFrame(({ clock }) => {
    if (intensity <= 0 || !backgroundUrl) return

    sim.tick(intensity, windAngle)
    maps.rebuild(sim.drops, sim.trails, intensity, clock.getElapsedTime())
    maps.upload()

    mat.uniforms.uIntensity.value = intensity
    mat.uniforms.uResolution.value.set(size.width, size.height)
  })

  if (intensity <= 0 || !backgroundUrl) return null

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}
