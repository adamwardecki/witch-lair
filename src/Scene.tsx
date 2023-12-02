import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'
import * as THREE from 'three'

function Scene() {
  const { performance } = useControls('Monitoring', {
    performance: false,
  })

  const { nodes } = useGLTF('./models/witch-2.glb')

  const bakedTexture = useTexture('./models/witch-baked-6.jpg')
  bakedTexture.colorSpace = THREE.SRGBColorSpace

  bakedTexture.flipY = false

  return (
    <>
      {performance && <Perf position='top-left' />}

      <OrbitControls makeDefault />
      <color attach='background' args={['#171720']} />

      <mesh geometry={nodes['baked-4'].geometry}>
        <meshBasicMaterial map={bakedTexture} />
      </mesh>
    </>
  )
}

export { Scene }
