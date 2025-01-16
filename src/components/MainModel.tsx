import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

type MainModelProps = {
  mesh: THREE.Mesh
}
export function MainModel(props: MainModelProps) {
  const { mesh } = props

  const bakedTexture = useTexture('./textures/main-model.jpg')

  bakedTexture.colorSpace = THREE.SRGBColorSpace
  bakedTexture.flipY = false

  const { nodes: wall } = useGLTF('./models/wall.glb') as any
  const wallTexture = useTexture('./textures/wall.jpg')
  wallTexture.colorSpace = THREE.SRGBColorSpace
  wallTexture.flipY = false

  return (
    <>
      <mesh geometry={mesh.geometry} position={mesh.position}>
        <meshBasicMaterial map={bakedTexture} />
      </mesh>
      <mesh
        geometry={wall['Plane002'].geometry}
        position={wall['Plane002'].position}
        rotation={[3.14, 3.14, 1.57]}
        scale={[2.553, 2.3, 3.93]}
      >
        <meshBasicMaterial map={wallTexture} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}
