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

extend({ UnrealBloomPass, OutputPass })

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

const Shape = forwardRef(function Shape(
  { children, color, crystalBallGlowIntensity, ...props },
  ref
) {
  return (
    <mesh {...props} ref={ref}>
      {children}
      {/* Now, in order to get selective bloom we simply crank colors out of
        their natural spectrum. Where colors are normally defined between 0 - 1 we push them
        way out of range, into a higher defintion (HDR). What previously was [1, 1, 1] now could
        for instance be [10, 10, 10]. This requires that toneMapping is off, or it clamps to 1 */}
      <animated.meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={crystalBallGlowIntensity}
        toneMapped={false}
      />
    </mesh>
  )
})

function Scene() {
  const { performance } = useControls('Monitoring', {
    performance: false,
  })

  const [playFireplaceSounds] = useSound('sounds/fireplace-fx-56636.mp3', {
    volume: 0.08,
    loop: true,
  })

  playFireplaceSounds()

  const soundUrl = 'sounds/shimmering-object-79354.mp3'

  const [playMagicSound, { stop: stopMagicSound }] = useSound(soundUrl, {
    volume: 0.6,
    interrupt: true,
  })

  // @TODO: move the texture/model loading out of the Scene if possible
  const { nodes } = useGLTF('./models/witch-2.glb')

  const bakedTexture = useTexture('./models/witch-baked-8.jpg')

  bakedTexture.colorSpace = THREE.SRGBColorSpace
  bakedTexture.flipY = false

  const { intensity, radius } = useControls('crystall ball glow', {
    intensity: { value: 0.4, min: 0, max: 1.5, step: 0.01 },
    radius: { value: 0, min: 0, max: 1, step: 0.01 },
  })

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
    color: '#3000cc',
    roughness: { value: 0.1, min: 0, max: 1, step: 0.1 },
    metalness: { value: 1, min: 0, max: 1, step: 0.1 },
    flatShading: true,
    transparent: true,
    opacity: { value: 0.9, min: 0, max: 1, step: 0.1 },
  })

  const [isCrystalBallActive, setDataCrystalBallIsActive] = useState(false)

  const setIsCrystalBallActive = () => {
    setDataCrystalBallIsActive(!isCrystalBallActive)

    isCrystalBallActive ? stopMagicSound() : playMagicSound()
  }

  const { scale } = useSpring({
    scale: isCrystalBallActive ? 100 : 1,
    config: config.molasses,
  })

  const crystalBallShape = useRef()
  useFrame((state, delta) => {
    if (isCrystalBallActive) {
      crystalBallShape.current.rotation.x += delta
    }
  })

  return (
    <group position-z={-0.6}>
      {performance && <Perf position='top-left' />}

      <OrbitControls makeDefault />
      <color attach='background' args={['#171720']} />

      <mesh geometry={nodes['baked-4'].geometry} position={nodes['baked-4'].position}>
        <meshBasicMaterial map={bakedTexture} />
      </mesh>

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

      <Shape
        ref={crystalBallShape}
        color='#c628ff'
        position={nodes.CrystalBall.position}
        crystalBallGlowIntensity={scale}
      >
        <dodecahedronGeometry args={[0.1, 0]} />
      </Shape>

      <mesh
        position={nodes.CrystalBall.position}
        onClick={() => setIsCrystalBallActive()}
      >
        <sphereGeometry args={[0.22, 128, 128]} />

        <meshStandardMaterial
          color='#c628ff'
          roughness={0.1}
          metalness={1}
          envMapIntensity={15}
          flatShading
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
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
    </group>
  )
}

export { Scene }
