import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Geometry } from 'three-stdlib'

export function Swarm({
  count,
  dummy = new THREE.Object3D(),
}: {
  count: number
  dummy?: THREE.Object3D
}) {
  const mesh = useRef()

  const particles = useMemo(() => {
    var num = 12

    var angle = (Math.PI * 0.5) / num

    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 50 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = Math.sin(angle * i) * 25
      const yFactor = Math.cos(angle * i) * 25
      const zFactor = Math.random()
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])
  useFrame((state) => {
    if (!mesh.current) return

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) / 10
      const b = Math.sin(t) / 10
      const s = Math.sin(t)
      dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.setScalar(s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return (
    <>
      <instancedMesh
        ref={mesh}
        args={[null, null, count]}
        rotation={[Math.PI * 0.5, 0, 0]}
      >
        <dodecahedronGeometry args={[0.5, 0]} />
        <pointsMaterial color='#5786F5' size={0.015} sizeAttenuation />

        <meshStandardMaterial color='#100911' roughness={0.5} />
      </instancedMesh>
    </>
  )
}

const particleTexture = new THREE.TextureLoader().load('/textures/magicparticle.png')

export const CustomGeometryParticles = (props) => {
  const { count } = props

  // This reference gives us direct access to our points
  const points = useRef()

  // Generate our positions attributes array
  const particlesStuff = useMemo(() => {
    const radius = 7.5
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

  console.log(particlesStuff.vectors[0])
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
        size={0.12}
        color='#aa49ff'
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaMap={particleTexture}
      />
    </points>
  )
}

export const ParticleSystem = () => {
  const radius = 7.8
  const particlesDelay = 10
  const colorList = [0xff0000, 0x00ff00, 0x0000ff] // Add your color list here

  const points = useRef()

  const particlesStuff = useMemo(() => {
    const geometry = new THREE.BufferGeometry()

    const positions = []
    const sizes = []
    const colors = []

    const vectors = []
    let theta = 0
    let phi = 0

    const angle = (Math.PI * 0.5) / 24

    for (let i = 0; i < 1000; i++) {
      theta = 2 * Math.PI * Math.random()
      phi = Math.acos(2 * Math.random() - 1)

      const px = Math.sin(i * angle) * radius
      const py = Math.cos(i * angle) * radius * 0.6
      const pz = Math.cos(i)

      const vertex = new THREE.Vector3(px, py, pz)
      vertex.delay = Date.now() + particlesDelay * i
      vertex.rotationAxis = new THREE.Vector3(0, Math.random() * 2 - 1, 0)
      vertex.rotationAxis.normalize()
      vertex.rotationSpeed = Math.abs(Math.random() - 0.5) * 0.15
      vectors.push(vertex)

      positions.push(vertex.x, vertex.y, vertex.z)
      sizes.push(Math.random() * 0.1)
      const hex = colorList[Math.round(Math.random() * (colorList.length - 1))]
      const rgb = new THREE.Color(hex)
      colors.push(rgb.r, rgb.g, rgb.b)
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
    )
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

    return { geometry, vectors }
  }, [])

  useFrame(() => {
    // loop over vectors and animate around sphere
    const positionsArray = particlesStuff.geometry.attributes.position.array
    for (let i = 0; i < particlesStuff.vectors.length; i++) {
      const vector = particlesStuff.vectors[i]
      vector.applyAxisAngle(vector.rotationAxis, vector.rotationSpeed)

      positionsArray[i * 3] = vector.x
      positionsArray[i * 3 + 1] = vector.y
      positionsArray[i * 3 + 2] = vector.z
    }

    particlesStuff.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points} geometry={particlesStuff.geometry} position={[0, 2.1, 0]}>
      <bufferGeometry attach='geometry' />
      <pointsMaterial size={0.12} color='#5786F5' sizeAttenuation depthWrite={false} />
    </points>
  )
}
