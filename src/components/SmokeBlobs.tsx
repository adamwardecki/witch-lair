import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

function generateBlobs(blobsNumber: number) {
  const blobs = []

  const geometry = <sphereGeometry args={[0.3, 24, 24]} />
  const material = <meshBasicMaterial color={0xcecece} />

  for (let i = 0; i < blobsNumber; i++) {
    const posY = -1.95 + Math.random() * 2.5
    const posX = Math.random()
    const posZ = Math.random()

    blobs.push(
      <mesh
        key={`${i}-${Math.random()}`}
        visible={i !== 0}
        scale={[1, 1, 1]}
        position={[posX, posY, posZ]}
      >
        {geometry}
        {material}
      </mesh>
    )
  }

  return blobs
}

export function SmokeBlobs({ amount }: { amount: number }) {
  const blobContainerRef = useRef<THREE.Mesh>(null!)
  const params = {
    blobColor: 0x00ffff,
    blobNumber: amount,
    blobInitialPosMultiplier: 10,
    lerpFactor: 0.04,
    maxHeight: 1.45,
  }

  const initialBlobs = generateBlobs(params.blobNumber)
  const [blobsArray, setBlobsArray] = useState(() => initialBlobs)

  useEffect(() => {
    if (params.blobNumber === 100) {
      for (let i = 0; i < params.blobNumber; i++) {
        setTimeout(() => {
          const [blob] = generateBlobs(1)

          setBlobsArray((blobs) => [...blobs, blob])
        }, i * 20)
      }
    } else {
      setBlobsArray(initialBlobs)
    }
  }, [params.blobNumber])

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime()
    const first_obj = blobContainerRef.current.children[0]

    first_obj.position.set(
      Math.cos(elapsedTime),
      Math.sin(elapsedTime),
      Math.sin(elapsedTime)
    )

    blobContainerRef.current.children.forEach((object, i) => {
      if (i === 0) return
      const object_left = blobContainerRef.current.children[i - 1]

      const previousPositionY = object.position.y
      object.position.lerp(
        new THREE.Vector3(
          Math.cos(object_left.position.x * 2),
          Math.sin(object_left.position.y * 2),
          Math.cos(object_left.position.z * 4)
        ),
        params.lerpFactor
      )

      const scale = clamp(object.scale.x * 0.99, 0.07, 0.2)
      if (previousPositionY < object.position.y && object.position.y < params.maxHeight) {
        object.visible = true
        object.scale.set(scale, scale, scale)
      } else {
        object.visible = false
        const enlarge = clamp(object.scale.x * 1.01, 0.07, 0.2)
        object.scale.set(enlarge, enlarge, enlarge)
      }
    })
  })

  return (
    <object3D ref={blobContainerRef} position={[2.35, 1.95, -2.35]} scale={0.5}>
      {blobsArray}
    </object3D>
  )
}
