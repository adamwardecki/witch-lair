import * as THREE from 'three'
import { forwardRef, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated, config } from '@react-spring/three'
import { useControls } from 'leva'

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

type CrystalBallProps = {
  intensity: number
  setIsCrystalBallActive: () => void
  isCrystalBallActive: boolean
  crystalBallMesh: THREE.Mesh
}

export function CrystalBall(props: CrystalBallProps) {
  const { setIsCrystalBallActive, isCrystalBallActive, crystalBallMesh } = props

  const { intensity, radius } = useControls('crystall ball glow', {
    intensity: { value: 0.4, min: 0, max: 1.5, step: 0.01 },
    radius: { value: 0, min: 0, max: 1, step: 0.01 },
  })

  const crystalBallShape = useRef<THREE.Mesh>()

  const { scale } = useSpring({
    scale: isCrystalBallActive ? 100 : 1,
    config: config.molasses,
  })

  useFrame((state, delta) => {
    if (isCrystalBallActive) {
      crystalBallShape.current.rotation.x += delta
    }
  })

  return (
    <>
      <Shape
        ref={crystalBallShape}
        color='#c628ff'
        position={crystalBallMesh.position}
        crystalBallGlowIntensity={scale}
      >
        <dodecahedronGeometry args={[0.1, 0]} />
      </Shape>

      <mesh position={crystalBallMesh.position} onClick={() => setIsCrystalBallActive()}>
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
    </>
  )
}
