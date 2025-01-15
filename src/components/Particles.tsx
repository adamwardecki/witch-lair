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

  // This reference gives us direct access to our points
  const points = useRef()

  // Generate our positions attributes array
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

      const vertex = new THREE.Vector3(px, py, pz)
      vertex.delay = Date.now() + particlesDelay
      vertex.rotationAxis = new THREE.Vector3(
        Math.random() / 20,
        Math.random() * 2 - 1,
        0
      )

      vertex.rotationAxis.normalize()
      vertex.rotationSpeed = Math.abs(Math.random() - 0.5)

      vectors.push(vertex)
      positions.set([vertex.x, vertex.y, vertex.z], i * 3)
      alphas[i] = Math.random()
    }

    return { positions, vectors, alphas }
  }, [count])

  useFrame((state, delta) => {
    const positionsArray = points.current.geometry.attributes.position.array

    for (let i = 0; i < particlesStuff.vectors.length; i++) {
      const vector = particlesStuff.vectors[i]
      vector.applyAxisAngle(vector.rotationAxis, vector.rotationSpeed * delta)

      positionsArray[i * 3] = vector.x
      positionsArray[i * 3 + 1] = vector.y
      positionsArray[i * 3 + 2] = vector.z
    }

    points.current.geometry.attributes.position.needsUpdate = true
    points.current.geometry.attributes.alpha.needsUpdate = true
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
