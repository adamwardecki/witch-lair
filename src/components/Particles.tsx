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

export const CustomGeometryParticles = ({
  count = 1000,
  radius = 7.5,
}: CustomGeometryParticlesProps) => {
  const points = useRef<THREE.Points>(null)
  const positions = useRef(new Float32Array(count * 3))
  const colors = useRef(new Float32Array(count * 4)) // RGB + Alpha
  const vectors = useRef<ParticleVector[]>([])

  useEffect(() => {
    for (let i = 0; i < count; i++) {
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

      // Set initial color (purple with alpha = 0)
      colors.current.set([0.67, 0.29, 1.0, 0], i * 4) // RGB (0-1) and Alpha
    }
  }, [count, radius])

  useFrame((state, delta) => {
    if (!points.current) return

    const positionsArray = points.current.geometry.attributes.position.array
    const colorsArray = points.current.geometry.attributes.color.array

    vectors.current.forEach((vector, i) => {
      vector.position.applyAxisAngle(vector.rotationAxis, vector.rotationSpeed * delta)
      positionsArray[i * 3] = vector.position.x
      positionsArray[i * 3 + 1] = vector.position.y
      positionsArray[i * 3 + 2] = vector.position.z

      // Gradually increase alpha value
      const alphaIndex = i * 4 + 3
      if (colors.current[alphaIndex] < 1) {
        colors.current[alphaIndex] += 0.01 // Adjust the speed of appearance
        colors.current[alphaIndex] = Math.min(colors.current[alphaIndex], 1) // Clamp to 1
      }

      colorsArray.set(colors.current.slice(i * 4, i * 4 + 4), i * 4)
    })

    points.current.geometry.attributes.position.needsUpdate = true
    points.current.geometry.attributes.color.needsUpdate = true
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
        <bufferAttribute
          attach='attributes-color'
          count={colors.current.length / 4}
          array={colors.current}
          itemSize={4}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaMap={particleTexture}
        transparent
        vertexColors
      />
    </points>
  )
}
