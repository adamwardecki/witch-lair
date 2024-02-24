import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Leva } from 'leva'
import React, { useRef, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { Scene } from './Scene'
import { ProgressBar } from './components/Loader'
import './styles/main.css'
import { useControls } from 'leva'

function Main() {
  const { fov, near, far, position } = useControls('Camera', {
    fov: 55,
    near: 0.1,
    far: 200,
    position: [7.5, 7, -8],
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
        <Environment {...envProps} files='./textures/adams-place-bridge-1k.hdr' />

        <Suspense fallback={<ProgressBar />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)
