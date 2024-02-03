import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function MainModel(props) {
  const { mesh } = props

  const bakedTexture = useTexture('./textures/main-model.jpg')

  bakedTexture.colorSpace = THREE.SRGBColorSpace
  bakedTexture.flipY = false

  const { nodes: wall } = useGLTF('./models/wall.glb')
  const wallTexture = useTexture('./textures/wall.jpg')
  wallTexture.colorSpace = THREE.SRGBColorSpace
  wallTexture.flipY = false

  console.log('wall', wall)
  return (
    <>
      <mesh geometry={mesh.geometry} position={mesh.position}>
        <meshBasicMaterial map={bakedTexture} />
      </mesh>
      <mesh
        geometry={wall['Plane002'].geometry}
        position={wall['Plane002'].position}
        rotation={[0, 0, 1.57]}
        scale={[2.57, 3, 3.95]}
      >
        <meshBasicMaterial map={wallTexture} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}
