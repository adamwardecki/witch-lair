import * as THREE from 'three'
import { useGLTF, useTexture } from '@react-three/drei'
import useSound from 'use-sound'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    character_witch002: THREE.Mesh
  }
}

export function Witch() {
  const { nodes: witch } = useGLTF('./models/witch.glb') as GLTFResult
  const witchTexture = useTexture('./textures/witch.jpg')
  witchTexture.colorSpace = THREE.SRGBColorSpace
  witchTexture.flipY = false

  const soundUrl = '/sounds/evil-witch-laugh-140135.mp3'

  const [playEvilLaugh] = useSound(soundUrl, { volume: 0.2, interrupt: true })

  const onWitchClick = () => {
    playEvilLaugh()
  }

  return (
    <>
      <mesh
        geometry={witch['character_witch002'].geometry}
        position={witch['character_witch002'].position}
        onClick={() => onWitchClick()}
      >
        <meshBasicMaterial map={witchTexture} />
      </mesh>
    </>
  )
}
