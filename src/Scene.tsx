import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'
import * as THREE from 'three'

function Ruby(props) {
  const materialProps = useControls('ruby', {
    roughness: { value: 0.1, min: 0, max: 1, step: 0.1 },
    metalness: { value: 0.9, min: 0, max: 1, step: 0.1 },
    envMapIntensity: { value: 7, min: 0, max: 100, step: 1 },
    color: '#830000',
    flatShading: true,
    transparent: true,
    opacity: { value: 0.8, min: 0, max: 1, step: 0.1 },
  })
  return (
    <mesh {...props.ruby}>
      <meshStandardMaterial {...materialProps} />
    </mesh>
  )
}

function Scene() {
  const { performance } = useControls('Monitoring', {
    performance: false,
  })

  const { nodes } = useGLTF('./models/witch-2.glb')

  const greenPotionProps = useControls('green potion', {
    color: '#0c6200',
    roughness: { value: 0.1, min: 0, max: 1, step: 0.1 },
    metalness: { value: 1, min: 0, max: 1, step: 0.1 },
    flatShading: true,
    transparent: true,
    opacity: { value: 0.9, min: 0, max: 1, step: 0.1 },
  })

  const redPotionProps = useControls('red potion', {
    color: '#6c0000',
    roughness: { value: 0.1, min: 0, max: 1, step: 0.1 },
    metalness: { value: 1, min: 0, max: 1, step: 0.1 },
    envMapIntensity: { value: 15, min: 0, max: 100, step: 1 },
    flatShading: true,
    transparent: true,
    opacity: { value: 0.8, min: 0, max: 1, step: 0.1 },
  })

  const bluePotionProps = useControls('blue potion', {
    color: '#0000ff',
    roughness: { value: 0.1, min: 0, max: 1, step: 0.1 },
    metalness: { value: 1, min: 0, max: 1, step: 0.1 },
    flatShading: true,
  })

  const bakedTexture = useTexture('./models/witch-baked-6.jpg')
  bakedTexture.colorSpace = THREE.SRGBColorSpace

  bakedTexture.flipY = false

  return (
    <>
      {performance && <Perf position='top-left' />}

      <OrbitControls makeDefault />
      <color attach='background' args={['#171720']} />

      <mesh geometry={nodes['baked-4'].geometry} position={nodes['baked-4'].position}>
        <meshBasicMaterial map={bakedTexture} />
      </mesh>

      <mesh geometry={nodes.CrystalBall.geometry} position={nodes.CrystalBall.position}>
        <meshBasicMaterial color='#fff' />
      </mesh>

      <mesh
        geometry={nodes.Potion_Green001.geometry}
        position={nodes.Potion_Green001.position}
      >
        <meshStandardMaterial {...greenPotionProps} />
      </mesh>

      <mesh
        geometry={nodes.Potion_Red003.geometry}
        position={nodes.Potion_Red003.position}
      >
        <meshStandardMaterial {...redPotionProps} />
      </mesh>

      <mesh
        geometry={nodes.Potion_Red004.geometry}
        position={nodes.Potion_Red004.position}
      >
        <meshStandardMaterial {...bluePotionProps} />
      </mesh>

      <Ruby ruby={nodes.Ruby003} />
    </>
  )
}

export { Scene }
