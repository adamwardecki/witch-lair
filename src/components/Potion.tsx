import { useControls } from 'leva'
import useSound from 'use-sound'

type PotionComponentProps = {
  mesh: any
  name: 'red' | 'green' | 'blue'
}

export function Potion({ mesh, name }: PotionComponentProps) {
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

  const meshMaterialProps =
    {
      red: redPotionProps,
      green: greenPotionProps,
      blue: bluePotionProps,
    }[name] || greenPotionProps

  const soundUrl = '/sounds/potion-bubbles.mp3'

  const [playPotionSounde] = useSound(soundUrl, { volume: 0.2, interrupt: true })

  const onPotionClick = () => {
    playPotionSounde()
  }

  return (
    <mesh
      geometry={mesh.geometry}
      position={mesh.position}
      onClick={() => onPotionClick()}
    >
      <meshStandardMaterial {...meshMaterialProps} />
    </mesh>
  )
}
