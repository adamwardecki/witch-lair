import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function MainModel(props) {
  const { mesh } = props

  const bakedTexture = useTexture('./models/witch-baked-8.jpg')

  bakedTexture.colorSpace = THREE.SRGBColorSpace
  bakedTexture.flipY = false
  return (
    <mesh geometry={mesh.geometry} position={mesh.position}>
      <meshBasicMaterial map={bakedTexture} />
    </mesh>
  )
}
