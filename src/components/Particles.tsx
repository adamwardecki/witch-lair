import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const particleTexture = new THREE.TextureLoader().load('/textures/magicparticle.png')

type CustomGeometryParticlesProps = {
  count?: number
  radius?: number
}
export const CustomGeometryParticles = (props: CustomGeometryParticlesProps) => {
  const { count = 1000, radius = 7.5 } = props

  // This reference gives direct access to points
  const points = useRef<THREE.Points>(null)

  // Generate positions attributes array
  const particlesStuff = useMemo(() => {
    const particlesDelay = 1000
    const positions = new Float32Array(count * 3)
    const alphas = new Float32Array(count)
    const vectors = []

    let theta = 0
    let phi = 0

    for (let i = 0; i < count; i++) {
      theta = 2 * Math.PI * Math.random()
      phi = Math.acos(2 * Math.random() - 1)

      const px = radius * Math.cos(theta) * Math.sin(phi)
      const py = radius * Math.sin(theta) * Math.sin(phi) * 0.6 // flatten the sphere
      const pz = radius * Math.cos(phi)

      const vertex = {
        position: new THREE.Vector3(px, py, pz),
        delay: Date.now() + particlesDelay,
        rotationAxis: new THREE.Vector3(
          Math.random() / 20,
          Math.random() * 2 - 1,
          0
        ).normalize(),
        rotationSpeed: Math.abs(Math.random() - 0.5),
      }

      vectors.push(vertex)
      positions.set([vertex.position.x, vertex.position.y, vertex.position.z], i * 3)
      alphas[i] = Math.random()
    }

    return { positions, vectors, alphas }
  }, [count])

  useFrame((state, delta) => {
    if (!points.current) return
    const positionsArray = points.current.geometry.attributes.position.array

    for (let i = 0; i < particlesStuff.vectors.length; i++) {
      const vector = particlesStuff.vectors[i]
      vector.position.applyAxisAngle(vector.rotationAxis, vector.rotationSpeed * delta)

      positionsArray[i * 3] = vector.position.x
      positionsArray[i * 3 + 1] = vector.position.y
      positionsArray[i * 3 + 2] = vector.position.z
    }

    points.current.geometry.attributes.alpha.needsUpdate = true
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points} position={[0, 2.1, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={particlesStuff.positions.length / 3}
          array={particlesStuff.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach='attributes-alpha'
          count={particlesStuff.alphas.length}
          array={particlesStuff.alphas}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color='#aa49ff'
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaMap={particleTexture}
      />
    </points>
  )
}
