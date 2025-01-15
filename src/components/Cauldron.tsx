type CauldronProps = {
  position: [number, number, number]
  onClick: () => void
}

export const Cauldron = ({ position, onClick }: CauldronProps) => {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[0.8, 24, 24]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  )
}
