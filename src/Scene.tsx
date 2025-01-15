import * as THREE from 'three'
import { useEffect, useState } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { Fire } from './components/Fire'
import { CustomGeometryParticles } from './components/Particles'
import { Witch } from './components/Witch'
import { useSound } from 'use-sound'
import { Ruby } from './components/Ruby'
import { Potion } from './components/Potion'
import { CrystalBall } from './components/CrystalBall'
import { MainModel } from './components/MainModel'
import { GLTF } from 'three-stdlib'
import { SmokeBlobs } from './components/SmokeBlobs'
import { Cauldron } from './components/Cauldron'

type GLTFResultScene = GLTF & {
  nodes: {
    'baked-4': THREE.Mesh
    CrystalBall: THREE.Mesh
    Potion_Red003: THREE.Mesh
    Potion_Green001: THREE.Mesh
    Potion_Red004: THREE.Mesh
    Ruby003: THREE.Mesh
  }
}

type Position = [number, number, number]
export const firePosition: Position = [2.25, 0.6, 3.3]
export const cauldronPosition: Position = [2.5, 0.95, -2.35]
function Scene() {
  const { performance } = useControls('Monitoring', {
    performance: false,
  })

  useEffect(() => {
    playFireplaceSounds()

    return () => {
      stopFireplaceSounds()
    }
  })

  const [playFireplaceSounds, { stop: stopFireplaceSounds }] = useSound(
    'sounds/fireplace-fx-56636.mp3',
    {
      volume: 0.08,
      loop: true,
    }
  )

  const [playMagicSound, { stop: stopMagicSound }] = useSound(
    'sounds/shimmering-object-79354.mp3',
    {
      volume: 0.8,
      interrupt: true,
    }
  )

  const [playBoilingSpaghettiSound, { stop: stopBoilingSpaghettiSound }] = useSound(
    'sounds/boiling-spaghetti.mp3',
    {
      volume: 0.8,
      interrupt: true,
    }
  )

  const [smokeBlobsAmount, setSmokeBlobsAmount] = useState(20)
  const onCauldronClicked = () => {
    setSmokeBlobsAmount(100)
    playBoilingSpaghettiSound()

    setTimeout(() => {
      setSmokeBlobsAmount(20)
      stopBoilingSpaghettiSound()
    }, 5000)
  }

  const { nodes } = useGLTF('./models/scene.glb') as GLTFResultScene

  const { intensity } = useControls('crystall ball glow', {
    intensity: { value: 0.4, min: 0, max: 1.5, step: 0.01 },
    radius: { value: 0, min: 0, max: 1, step: 0.01 },
  })

  const [isCrystalBallActive, setDataCrystalBallIsActive] = useState(false)

  const setIsCrystalBallActive = () => {
    setDataCrystalBallIsActive(!isCrystalBallActive)

    isCrystalBallActive ? stopMagicSound() : playMagicSound()
  }

  return (
    <group>
      {performance && <Perf position='top-left' />}

      <OrbitControls makeDefault />
      <color attach='background' args={['#171720']} />

      <MainModel mesh={nodes['baked-4']} />

      <CrystalBall
        intensity={intensity}
        setIsCrystalBallActive={setIsCrystalBallActive}
        isCrystalBallActive={isCrystalBallActive}
        crystalBallMesh={nodes.CrystalBall}
      />

      {isCrystalBallActive && <CustomGeometryParticles count={1000} />}

      <Fire position={firePosition} color={'#f98bff'}></Fire>

      <Witch />

      <SmokeBlobs amount={smokeBlobsAmount} />

      <Cauldron position={cauldronPosition} onClick={() => onCauldronClicked()} />

      <Potion name='red' mesh={nodes.Potion_Red003} />
      <Potion name='green' mesh={nodes.Potion_Green001} />
      <Potion name='blue' mesh={nodes.Potion_Red004} />

      <Ruby name='ruby' ruby={nodes.Ruby003} />
    </group>
  )
}

export { Scene }
