import * as THREE from 'three'
import { useState, forwardRef, useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { useSpring, animated, config } from '@react-spring/three'

import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { ToneMappingMode } from 'postprocessing'
import { UnrealBloomPass } from 'three-stdlib'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { Fire } from './components/Fire'
import { CustomGeometryParticles } from './components/Particles'
import { Witch } from './components/Witch'
import { useSound } from 'use-sound'
import { Ruby } from './components/Ruby'
import { Potion } from './components/Potion'
import { CrystalBall } from './components/CrystalBall'
import { MainModel } from './components/MainModel'

extend({ UnrealBloomPass, OutputPass })

function Scene() {
  const { performance } = useControls('Monitoring', {
    performance: false,
  })

  const [playFireplaceSounds] = useSound('sounds/fireplace-fx-56636.mp3', {
    volume: 0.08,
    loop: true,
  })

  playFireplaceSounds()

  const [playMagicSound, { stop: stopMagicSound }] = useSound(
    'sounds/shimmering-object-79354.mp3',
    {
      volume: 0.6,
      interrupt: true,
    }
  )

  // @TODO: move the texture/model loading out of the Scene if possible
  const { nodes } = useGLTF('./models/witch-2.glb')

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
    <group position-z={-0.6}>
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

      {/* @TODO: I should avoid re-mounting the particles. visible prop is better  */}
      {isCrystalBallActive && (
        <>
          <EffectComposer disableNormalPass>
            <Bloom
              mipmapBlur
              luminanceThreshold={1}
              levels={8}
              intensity={intensity * 4}
            />
            <ToneMapping
              blendFunction={THREE.AdditiveBlending}
              mode={ToneMappingMode.ACES_FILMIC}
            />
          </EffectComposer>

          <CustomGeometryParticles count={1000} />
        </>
      )}

      <Fire position={[2.25, 0.6, 3.3]} color={'#f98bff'}></Fire>

      <Witch />

      <Potion name='red' mesh={nodes.Potion_Red003} />
      <Potion name='green' mesh={nodes.Potion_Green001} />
      <Potion name='blue' mesh={nodes.Potion_Red004} />

      <Ruby name='ruby' ruby={nodes.Ruby003} />
    </group>
  )
}

export { Scene }
