import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, ContactShadows, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Product } from '../../data/products'

interface ViewerProps {
  product: Product
  partColors: Record<string, string> // partId -> hex color
  autoRotate?: boolean
}

// 1. Cubo Portamicrófono 3D
function MicCubeModel({ colors }: { colors: Record<string, string> }) {
  const bodyColor = colors['body'] || '#1C1C1E'
  const facesColor = colors['faces'] || '#DE5B2B'
  const topRingColor = colors['topRing'] || '#EEBA29'

  return (
    <group position={[0, 0, 0]}>
      {/* Cuerpo principal redondeado */}
      <RoundedBox args={[2.2, 2.0, 2.2]} radius={0.15} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={bodyColor} roughness={0.35} metalness={0.05} />
      </RoundedBox>

      {/* 4 Placas / Caras para logos o colores laterales */}
      {/* Frontal */}
      <mesh position={[0, 0, 1.12]} castShadow receiveShadow>
        <planeGeometry args={[1.7, 1.5]} />
        <meshStandardMaterial color={facesColor} roughness={0.3} />
      </mesh>
      {/* Trasera */}
      <mesh position={[0, 0, -1.12]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[1.7, 1.5]} />
        <meshStandardMaterial color={facesColor} roughness={0.3} />
      </mesh>
      {/* Derecha */}
      <mesh position={[1.12, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <planeGeometry args={[1.7, 1.5]} />
        <meshStandardMaterial color={facesColor} roughness={0.3} />
      </mesh>
      {/* Izquierda */}
      <mesh position={[-1.12, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <planeGeometry args={[1.7, 1.5]} />
        <meshStandardMaterial color={facesColor} roughness={0.3} />
      </mesh>

      {/* Anillo de inserción superior */}
      <mesh position={[0, 1.05, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.75, 0.08, 16, 32]} />
        <meshStandardMaterial color={topRingColor} roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Orificio interior del micrófono (espuma oscura) */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 1.6, 32]} />
        <meshStandardMaterial color="#0A0A0C" roughness={0.9} />
      </mesh>
    </group>
  )
}

// 2. Clicker Fidget 3D
function ClickerModel({ colors }: { colors: Record<string, string> }) {
  const housingColor = colors['housing'] || '#9FAEE9'
  const buttonColor = colors['button'] || '#DE5B2B'
  const keyringColor = colors['keyring'] || '#1C1C1E'

  return (
    <group position={[0, -0.2, 0]}>
      {/* Carcasa exterior ergonómica */}
      <RoundedBox args={[1.8, 1.4, 1.8]} radius={0.25} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={housingColor} roughness={0.4} metalness={0.05} />
      </RoundedBox>

      {/* Botón táctil superior con bisel */}
      <group position={[0, 0.85, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.65, 0.75, 0.45, 32]} />
          <meshStandardMaterial color={buttonColor} roughness={0.25} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.23, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
          <meshStandardMaterial color={buttonColor} roughness={0.15} />
        </mesh>
      </group>

      {/* Ojal lateral para llavero */}
      <mesh position={[1.05, -0.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.25, 0.07, 16, 24]} />
        <meshStandardMaterial color={keyringColor} roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  )
}

// 3. Portarretratos Minimalista 3D
function FrameModel({ colors }: { colors: Record<string, string> }) {
  const outerFrameColor = colors['outerFrame'] || '#F6F3EF'
  const innerBorderColor = colors['innerBorder'] || '#DE5B2B'
  const standColor = colors['stand'] || '#1C1C1E'

  return (
    <group position={[0, 0.1, 0]} rotation={[0.15, 0, 0]}>
      {/* Marco exterior */}
      <RoundedBox args={[2.2, 2.7, 0.25]} radius={0.08} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={outerFrameColor} roughness={0.35} metalness={0.05} />
      </RoundedBox>

      {/* Borde interior decorativo de contraste */}
      <mesh position={[0, 0, 0.14]} castShadow>
        <boxGeometry args={[1.7, 2.2, 0.05]} />
        <meshStandardMaterial color={innerBorderColor} roughness={0.3} />
      </mesh>

      {/* Área de la foto */}
      <mesh position={[0, 0, 0.17]}>
        <planeGeometry args={[1.5, 2.0]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
      </mesh>

      {/* Pata de soporte posterior */}
      <mesh position={[0, -0.6, -0.55]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 1.6, 0.1]} />
        <meshStandardMaterial color={standColor} roughness={0.5} />
      </mesh>
    </group>
  )
}

// 4. Llavero Tipográfico 3D
function KeychainModel({ colors }: { colors: Record<string, string> }) {
  const baseColor = colors['basePlate'] || '#1C1C1E'
  const lettersColor = colors['raisedLetters'] || '#EEBA29'
  const loopColor = colors['ringLoop'] || '#DE5B2B'

  return (
    <group position={[0, 0, 0]}>
      {/* Base alargada con bordes curvos */}
      <RoundedBox args={[3.0, 1.1, 0.25]} radius={0.2} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={baseColor} roughness={0.4} metalness={0.05} />
      </RoundedBox>

      {/* Relieve superior representativo (barras geométricas / tipografía) */}
      <group position={[-0.1, 0, 0.16]}>
        <mesh position={[-0.8, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.6, 0.1]} />
          <meshStandardMaterial color={lettersColor} roughness={0.25} />
        </mesh>
        <mesh position={[-0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.35, 0.6, 0.1]} />
          <meshStandardMaterial color={lettersColor} roughness={0.25} />
        </mesh>
        <mesh position={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.6, 0.1]} />
          <meshStandardMaterial color={lettersColor} roughness={0.25} />
        </mesh>
        <mesh position={[0.85, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.6, 0.1]} />
          <meshStandardMaterial color={lettersColor} roughness={0.25} />
        </mesh>
      </group>

      {/* Ojal para el aro de la llave */}
      <mesh position={[-1.65, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.26, 0.08, 16, 24]} />
        <meshStandardMaterial color={loopColor} roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  )
}

function FloatingModel({
  product,
  partColors,
}: {
  product: Product
  partColors: Record<string, string>
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Leve oscilación suave para dar dinamismo visual
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.06
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
        {product.modelType === 'mic-cube' && <MicCubeModel colors={partColors} />}
        {product.modelType === 'clicker' && <ClickerModel colors={partColors} />}
        {product.modelType === 'frame' && <FrameModel colors={partColors} />}
        {product.modelType === 'keychain' && <KeychainModel colors={partColors} />}
      </Float>
    </group>
  )
}

export function ProductViewer3D({ product, partColors, autoRotate = true }: ViewerProps) {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        camera={{ position: [0, 1.8, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Iluminación de estudio para apreciar los acabados de filamento */}
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[4, 7, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-4, 3, -3]} intensity={0.7} color="#9FAEE9" />
        <directionalLight position={[0, -2, 2]} intensity={0.4} color="#F6F3EF" />

        <FloatingModel product={product} partColors={partColors} />

        {/* Sombra de contacto suave en el suelo */}
        <ContactShadows
          position={[0, -1.25, 0]}
          opacity={0.45}
          scale={7}
          blur={2.2}
          far={3}
        />

        {/* Controles de cámara táctiles y de ratón */}
        <OrbitControls
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={1.8}
          minDistance={2.8}
          maxDistance={6.5}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>

      {/* Indicador sutil de interacción */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[11px] text-white/90 font-medium pointer-events-none flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#DE5B2B] animate-pulse"></span>
        Arrastra para rotar en 3D
      </div>
    </div>
  )
}
