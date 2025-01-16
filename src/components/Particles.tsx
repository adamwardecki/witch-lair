import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const particleTexture = new THREE.TextureLoader().load(
  '/textures/magicparticle.png',
  () => console.log('Texture loaded successfully'),
  undefined,
  () => console.error('Error loading texture')
)

type CustomGeometryParticlesProps = {
  count?: number
  radius?: number
}

type ParticleVector = {
  position: THREE.Vector3
  rotationAxis: THREE.Vector3
  rotationSpeed: number
}

type Timeout = ReturnType<typeof setTimeout>

export const CustomGeometryParticles = ({
  count = 1000,
  radius = 7.5,
}: CustomGeometryParticlesProps) => {
  const points = useRef<THREE.Points>(null)
  const positions = useRef(new Float32Array(count * 3))
  const vectors = useRef<ParticleVector[]>([])

  useEffect(() => {
    let timeoutIds: Timeout[] = []

    for (let i = 0; i < count; i++) {
      timeoutIds.push(
        setTimeout(() => {
          const theta = 2 * Math.PI * Math.random()
          const phi = Math.acos(2 * Math.random() - 1)

          const px = radius * Math.cos(theta) * Math.sin(phi)
          const py = radius * Math.sin(theta) * Math.sin(phi) * 0.6
          const pz = radius * Math.cos(phi)

          const rotationAxis = new THREE.Vector3(
            Math.random() / 20,
            Math.random() * 2 - 1,
            0
          ).normalize()
          const rotationSpeed = Math.abs(Math.random() - 0.5)

          vectors.current.push({
            position: new THREE.Vector3(px, py, pz),
            rotationAxis,
            rotationSpeed,
          })

          positions.current.set([px, py, pz], i * 3)
          if (points.current) {
            points.current.geometry.attributes.position.needsUpdate = true
          }
        }, i) // Delay per particle
      )
    }

    return () => {
      timeoutIds.forEach(clearTimeout)
    }
  }, [count, radius])

  useFrame((state, delta) => {
    if (!points.current) return

    const positionsArray = points.current.geometry.attributes.position.array
    vectors.current.forEach((vector, i) => {
      vector.position.applyAxisAngle(vector.rotationAxis, vector.rotationSpeed * delta)
      positionsArray[i * 3] = vector.position.x
      positionsArray[i * 3 + 1] = vector.position.y
      positionsArray[i * 3 + 2] = vector.position.z
    })

    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points} position={[0, 2.1, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={positions.current.length / 3}
          array={positions.current}
          itemSize={3}
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
