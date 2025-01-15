import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

function Blobs(blobsNumber: number, blobInitialPosMultiplier: number) {
  const blobs = []

  const geometry = <sphereGeometry args={[0.3, 24, 24]} />
  const material = <meshBasicMaterial color={0xcecece} />

  for (let i = 0; i < blobsNumber; i++) {
    const posX =
      -Math.random() * blobInitialPosMultiplier + Math.random() * blobInitialPosMultiplier
    const posZ =
      -Math.random() * blobInitialPosMultiplier + Math.random() * blobInitialPosMultiplier
    const posY =
      -Math.random() * blobInitialPosMultiplier + Math.random() * blobInitialPosMultiplier

    const scale = clamp(Math.abs(Math.random() - 0.5), 0.09, 0.2)

    blobs.push(
      <mesh
        key={`${i}-${scale}`}
        visible={i !== 0}
        scale={[scale, scale, scale]}
        position={[posX, posY, posZ]}
      >
        {geometry}
        {material}
      </mesh>
    )
  }

  return blobs
}

export function SmokeBlobs() {
  const blobContainerRef = useRef<THREE.Mesh>(null!)
  const params = {
    // general scene params
    blobColor: 0x00ffff,
    blobNumber: 20,
    blobInitialPosMultiplier: 10,
    lerpFactor: 0.04, // this param controls the speed of which the blobs move, also affects the eventual moving patterns of the blobs
  }

  useFrame((state, delta) => {
    const elapsedTime = state.clock.getElapsedTime()

    let first_obj = blobContainerRef.current.children[0]

    let offset = {
      x: 0,
      y: 0,
      z: 0,
    }
    // the first blob has a regular circular path (x y positions are calculated using the parametric function for a circle)
    first_obj.position.set(
      offset.x + Math.cos(elapsedTime),
      offset.y + Math.sin(elapsedTime),
      offset.z + Math.sin(elapsedTime)
    )

    for (let i = 0, l = blobContainerRef.current.children.length; i < l; i++) {
      var object = blobContainerRef.current.children[i]
      var object_left = blobContainerRef.current.children[i - 1]
      if (i >= 1) {
        // position of each blob is calculated by the cos/sin function of its previous blob's slightly scaled up position
        // such that each blob is has x, y and z coordinates inside -1 and 1, while a pseudo-randomness of positions is achieved
        // here I'm using the built-in lerp function with a small enough interpolation factor which is just right to help produce the pseudo-randomness

        const previousPositionY = object.position.y
        object.position.lerp(
          new THREE.Vector3(
            offset.x + Math.cos(object_left.position.x * 2),
            offset.y + Math.sin(object_left.position.y * 2),
            offset.z + Math.cos(object_left.position.z * 4)
          ),
          params.lerpFactor
        )

        const scale = clamp(object.scale.x * 0.99, 0.07, 0.2)
        if (previousPositionY < object.position.y) {
          object.visible = true
          object.scale.set(scale, scale, scale)
        } else {
          object.visible = false
          const enlarge = clamp(object.scale.x * 1.01, 0.07, 0.2)
          // This could be set just once when with random values once the position reaches mininumum
          object.scale.set(enlarge, enlarge, enlarge)
        }
      }
    }
  })

  const blobs = Blobs(params.blobNumber, params.blobInitialPosMultiplier)
  return (
    <object3D ref={blobContainerRef} position={[2.35, 1.95, -2.35]} scale={0.5}>
      {blobs}
    </object3D>
  )
}
