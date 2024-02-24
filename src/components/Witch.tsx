import * as THREE from 'three'
import { useGLTF, useTexture } from '@react-three/drei'
import useSound from 'use-sound'
import { GLTF } from 'three-stdlib'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

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

  const [isLaughingInEvil, setIsLaughingInEvil] = useState(false)
  const [playEvilLaugh] = useSound(soundUrl, {
    volume: 0.2,
    interrupt: true,
    onend: () => setIsLaughingInEvil(false),
  })

  const witchPositionY = witch['character_witch002'].position.y
  const witchRef = useRef<THREE.Mesh>(null!)

  const [state] = useState(() => ({
    positionY: witchPositionY,
    velocityY: 0.0,
    gravity: 0.5,
    onGround: false,
  }))

  const startJump = () =>
    state.onGround && ((state.velocityY = -2.5), (state.onGround = false))
  const endJump = () => state.velocityY < -4.0 && (state.velocityY = -4.0)

  useFrame(() => {
    // https://gamedev.stackexchange.com/questions/29617/how-to-make-a-character-jump
    state.velocityY += state.gravity
    state.positionY -= state.velocityY
    if (state.positionY < witchPositionY) {
      state.positionY = witchPositionY
      state.velocityY = 0.0
      state.onGround = true
    }
    witchRef.current.position.y = witchPositionY + state.positionY / 300
  })

  const onWitchClick = () => {
    setIsLaughingInEvil(() => true)
    playEvilLaugh()

    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        startJump()
        endJump()
      }, i * 200)
    }
  }

  return (
    <>
      <mesh
        ref={witchRef}
        geometry={witch['character_witch002'].geometry}
        position-x={witch['character_witch002'].position.x}
        position-z={witch['character_witch002'].position.z}
        position-y={state.positionY}
        onClick={() => onWitchClick()}
      >
        <meshBasicMaterial map={witchTexture} />
      </mesh>
    </>
  )
}
