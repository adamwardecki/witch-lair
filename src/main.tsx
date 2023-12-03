import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Leva } from 'leva'
import React, { useRef, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Scene } from './Scene'
import './styles/main.css'
import { useControls } from 'leva'

const Camera = (props) => {
  const ref = useRef()
  const set = useThree((state) => state.set)
  useEffect(() => void set({ camera: ref.current }), [])
  useFrame(() => ref.current.updateMatrixWorld())
  return <perspectiveCamera ref={ref} {...props} />
}

function Main() {
  const { fov, near, far, position } = useControls('Camera', {
    fov: 55,
    near: 0.1,
    far: 200,
    position: [8, 9, -12],
  })

  const envProps = useControls({ background: false })

  return (
    <div className='main'>
      <Leva
        collapsed={false}
        oneLineLabels={false}
        flat={true}
        theme={{
          sizes: {
            titleBarHeight: '28px',
          },
          fontSizes: {
            root: '10px',
          },
        }}
      />
      <Canvas
        flat
        dpr={[1, 2]}
        gl={{
          antialias: true,
        }}
        camera={{
          fov,
          near,
          far,
          position,
        }}
      >
        <ambientLight intensity={10} />

        <Environment {...envProps} files='./models/adams-place-bridge-1k.hdr' />

        {/* 
          The camera component is creating a non-perspective camera by default
          It changes only after manipulating the camera controls in leva
        */}
        {/* <Camera fov={fov} near={near} far={far} position={position} /> */}
        <Scene />
      </Canvas>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)
