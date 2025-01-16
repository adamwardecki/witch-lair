import { useControls } from 'leva'
import {
  BufferGeometry,
  Material,
  Mesh,
  NormalBufferAttributes,
  Object3DEventMap,
} from 'three'

interface RubyProps {
  name: string
  ruby: Mesh<
    BufferGeometry<NormalBufferAttributes>,
    Material | Material[],
    Object3DEventMap
  >
}

export function Ruby(props: RubyProps) {
  const materialProps = useControls(props.name, {
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
