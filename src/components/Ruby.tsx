import { useControls } from 'leva'

export function Ruby(props) {
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
