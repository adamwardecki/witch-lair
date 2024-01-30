import * as THREE from 'three'
import { useLayoutEffect, useRef } from 'react'
import { extend, useFrame, useLoader, MaterialNode } from '@react-three/fiber'
import vertexShader from '../shaders/fire/vertex.glsl'
import fragmentShader from '../shaders/fire/fragment.glsl'

class FireMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      defines: { ITERATIONS: '10', OCTIVES: '3' },
      uniforms: {
        fireTex: { type: 't', value: null },
        color: { type: 'c', value: null },
        time: { type: 'f', value: 0.0 },
        seed: { type: 'f', value: 0.0 },
        invModelMatrix: { type: 'm4', value: null },
        scale: { type: 'v3', value: null },
        noiseScale: { type: 'v4', value: new THREE.Vector4(1, 2, 1, 0.3) },
        magnitude: { type: 'f', value: 2.5 },
        lacunarity: { type: 'f', value: 3.0 },
        gain: { type: 'f', value: 0.6 },
      },
      vertexShader,
      fragmentShader,
    })
  }
}

// Add types to ThreeElements elements so primitives pick up on it
// Fixes: Property 'fireMaterial' does not exist on type 'JSX.IntrinsicElements'
declare module '@react-three/fiber' {
  interface ThreeElements {
    fireMaterial: MaterialNode<FireMaterial, typeof FireMaterial>
  }
}

extend({ FireMaterial })

export function Fire({
  color,
  ...props
}: {
  color?: string
  position: [number, number, number]
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null!)
  const texture = useLoader(THREE.TextureLoader, '/textures/firetex.png')
  useFrame((state) => {
    const invModelMatrix = shaderMaterialRef.current.uniforms.invModelMatrix.value
    ref.current.updateMatrixWorld()
    invModelMatrix.copy(ref.current.matrixWorld).invert()
    shaderMaterialRef.current.uniforms.time.value = state.clock.elapsedTime
    shaderMaterialRef.current.uniforms.invModelMatrix.value = invModelMatrix
    shaderMaterialRef.current.uniforms.scale.value = ref.current.scale
  })
  useLayoutEffect(() => {
    texture.magFilter = texture.minFilter = THREE.LinearFilter
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
    shaderMaterialRef.current.uniforms.fireTex.value = texture
    shaderMaterialRef.current.uniforms.color.value = color || new THREE.Color(0xeeeeee)
    shaderMaterialRef.current.uniforms.invModelMatrix.value = new THREE.Matrix4()
    shaderMaterialRef.current.uniforms.scale.value = new THREE.Vector3(1, 1, 1)
    shaderMaterialRef.current.uniforms.seed.value = Math.random() * 19.19
  }, [])

  return (
    <mesh ref={ref} {...props}>
      <boxGeometry />
      <fireMaterial
        ref={shaderMaterialRef}
        transparent
        depthWrite={false}
        depthTest={true}
      />
    </mesh>
  )
}
