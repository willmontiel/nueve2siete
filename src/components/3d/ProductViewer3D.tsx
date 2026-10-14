import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, ContactShadows, RoundedBox, Text, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { Product } from '../../data/products'
import { playMechanicalClick } from '../../utils/sound'
import { pressHandlers } from '../../lib/press'

interface ViewerProps {
  product: Product
  partColors: Record<string, string> // partId -> hex color
  customText?: string
  autoRotate?: boolean
}

// Cálculo de color de contraste óptimo para legibilidad de marca sobre la caja
function getContrastColor(hexColor?: string): string {
  if (!hexColor) return '#FFFFFF'
  const hex = hexColor.replace('#', '')
  if (hex.length !== 6) return '#FFFFFF'
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#121117' : '#FFFFFF'
}

// 1. Adaptador Portamicrófono Inalámbrico de Mano 3D (Caja 4x3x4 cm | Mango: 5.6cm x Ø1.4cm | Cabeza: 2.7x2.5cm)
function MicCubeModel({ colors, customText }: { colors: Record<string, string>; customText?: string }) {
  const handleColor = colors['handle'] || '#F6F3EF'
  const boxColor = colors['box'] || '#8576EA'
  const headColor = colors['head'] || '#F6F3EF'
  const brandText = customText?.trim() || 'Tu Marca'
  const textColor = getContrastColor(boxColor)

  return (
    <group position={[0, 0.85, 0]} scale={0.24}>
      {/* 1. Mango ergonómico inferior (Alto 5.6 cm, Diámetro 1.4 cm -> Radio 0.7 cm) */}
      <group position={[0, -4.3, 0]}>
        {/* Tubo cilíndrico del mango */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.68, 5.6, 36]} />
          <meshStandardMaterial color={handleColor} roughness={0.34} metalness={0.04} />
        </mesh>

        {/* Tapa / Base inferior biselada */}
        <mesh position={[0, -2.72, 0]} castShadow>
          <cylinderGeometry args={[0.68, 0.58, 0.16, 36]} />
          <meshStandardMaterial color={handleColor} roughness={0.38} metalness={0.04} />
        </mesh>

        {/* Anillo de transición en la unión superior con la caja */}
        <mesh position={[0, 2.72, 0]} castShadow>
          <cylinderGeometry args={[0.82, 0.7, 0.16, 36]} />
          <meshStandardMaterial color={handleColor} roughness={0.32} metalness={0.04} />
        </mesh>
      </group>

      {/* 2. Caja de Marca (Proporción exacta: 4cm ancho x 3cm alto x 4cm profundidad) */}
      <group position={[0, 0, 0]}>
        <RoundedBox args={[4.0, 3.0, 4.0]} radius={0.25} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color={boxColor} roughness={0.32} metalness={0.06} />
        </RoundedBox>

        {/* Texto de Marca en 3D - Cara Frontal */}
        <Text
          position={[0, 0, 2.03]}
          fontSize={0.52}
          maxWidth={3.6}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color={textColor}
          fontWeight="bold"
          letterSpacing={0.02}
        >
          {brandText}
        </Text>

        {/* Cara Trasera */}
        <Text
          position={[0, 0, -2.03]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.52}
          maxWidth={3.6}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color={textColor}
          fontWeight="bold"
          letterSpacing={0.02}
        >
          {brandText}
        </Text>

        {/* Cara Derecha */}
        <Text
          position={[2.03, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.52}
          maxWidth={3.6}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color={textColor}
          fontWeight="bold"
          letterSpacing={0.02}
        >
          {brandText}
        </Text>

        {/* Cara Izquierda */}
        <Text
          position={[-2.03, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.52}
          maxWidth={3.6}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color={textColor}
          fontWeight="bold"
          letterSpacing={0.02}
        >
          {brandText}
        </Text>
      </group>

      {/* 3. Cabeza esférica (Dimensiones exactas: Ancho 2.7 cm x Alto 2.5 cm) */}
      <group position={[0, 0, 0]}>
        {/* Cuello / Conector sobre la caja */}
        <mesh position={[0, 1.61, 0]} castShadow>
          <cylinderGeometry args={[0.75, 0.85, 0.22, 36]} />
          <meshStandardMaterial color={headColor} roughness={0.35} metalness={0.05} />
        </mesh>

        {/* Cápsula de micrófono (Ancho 2.7 cm, Alto 2.5 cm -> Escala [1.35, 1.25, 1.35]) */}
        <mesh position={[0, 2.97, 0]} scale={[1.35, 1.25, 1.35]} castShadow receiveShadow>
          <sphereGeometry args={[1, 36, 36]} />
          <meshStandardMaterial color={headColor} roughness={0.48} metalness={0.08} />
        </mesh>

        {/* Anillo ecuatorial divisorio */}
        <mesh position={[0, 2.97, 0]}>
          <torusGeometry args={[1.36, 0.035, 16, 48]} />
          <meshStandardMaterial color={headColor} roughness={0.25} metalness={0.2} />
        </mesh>
      </group>
    </group>
  )
}

// 2. Clicker Flor 3D (Cargado directamente desde el modelo 3MF)
function ClickerModel({ colors }: { colors: Record<string, string> }) {
  const { scene } = useGLTF('/models/clicker-sakura.glb')
  const clonedScene = useMemo(() => scene.clone(), [scene])
  const [isPressed, setIsPressed] = useState(false)

  const baseColor = colors['base'] || '#F8BBD0'
  const centerColor = colors['center'] || '#EEBA29'

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        if (mesh.name === 'base') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.38,
            metalness: 0.04,
            transparent: false,
            opacity: 1.0,
            depthWrite: true,
            side: THREE.FrontSide,
          })
          mesh.castShadow = true
          mesh.receiveShadow = true
        } else if (mesh.name === 'center') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: centerColor,
            roughness: 0.32,
            metalness: 0.06,
            transparent: false,
            opacity: 1.0,
            depthWrite: true,
            side: THREE.FrontSide,
          })
          mesh.castShadow = true
          mesh.receiveShadow = true
        }
      }
    })
  }, [clonedScene, baseColor, centerColor])

  // Presión táctil interactiva sobre el centro al hacer clic (simula switch mecánico)
  useEffect(() => {
    const centerMesh = clonedScene.getObjectByName('center')
    if (centerMesh) {
      centerMesh.position.y = isPressed ? -0.18 : 0
    }
  }, [clonedScene, isPressed])

  const press = useMemo(() => pressHandlers({ onPress: playMechanicalClick, onPressedChange: setIsPressed }), [])

  return (
    <group
      position={[0, 0.45, 0]}
      scale={0.46}
      rotation={[0.75, 0, 0]}
      {...press}
    >
      <primitive object={clonedScene} />
    </group>
  )
}

// Pre-cargar modelo GLB
useGLTF.preload('/models/clicker-sakura.glb')

// 3. Portafotos Margarita 3D (Cargado directamente desde el modelo 3MF)
function FrameModel({ colors }: { colors: Record<string, string> }) {
  const { scene } = useGLTF('/models/portafotos-margarita.glb')
  const clonedScene = useMemo(() => scene.clone(), [scene])

  const baseColor = colors['base'] || '#FFFFFF'
  const centerColor = colors['center'] || '#EEBA29'

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        if (mesh.name === 'base') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.38,
            metalness: 0.04,
            transparent: false,
            opacity: 1.0,
            depthWrite: true,
            side: THREE.FrontSide,
          })
          mesh.castShadow = true
          mesh.receiveShadow = true
        } else if (mesh.name === 'center') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: centerColor,
            roughness: 0.32,
            metalness: 0.06,
            transparent: false,
            opacity: 1.0,
            depthWrite: true,
            side: THREE.FrontSide,
          })
          mesh.castShadow = true
          mesh.receiveShadow = true
        }
      }
    })
  }, [clonedScene, baseColor, centerColor])

  return (
    <group position={[0, 0.45, 0]} scale={0.52} rotation={[0.2, 0, 0]}>
      <primitive object={clonedScene} />
    </group>
  )
}

useGLTF.preload('/models/portafotos-margarita.glb')

// 4. Llavero Tipográfico 3D
function KeychainModel({ colors }: { colors: Record<string, string> }) {
  const baseColor = colors['basePlate'] || '#1C1C1E'
  const lettersColor = colors['raisedLetters'] || '#EEBA29'
  const loopColor = colors['ringLoop'] || '#DE5B2B'

  return (
    <group position={[0, 0.45, 0]}>
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
  customText,
}: {
  product: Product
  partColors: Record<string, string>
  customText?: string
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
        {product.modelType === 'mic-cube' && <MicCubeModel colors={partColors} customText={customText} />}
        {(product.modelType === 'clicker' || product.modelType === 'clicker-sakura') && (
          <ClickerModel colors={partColors} />
        )}
        {product.modelType === 'frame' && <FrameModel colors={partColors} />}
        {product.modelType === 'keychain' && <KeychainModel colors={partColors} />}
      </Float>
    </group>
  )
}

export function ProductViewer3D({ product, partColors, customText, autoRotate = true }: ViewerProps) {
  return (
    // data-lenis-prevent hands the wheel to the camera zoom instead of the smooth page scroll
    <div className="w-full h-full relative select-none" data-lenis-prevent>
      <Canvas
        shadows
        camera={{ position: [0, 0.82, 4.3], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Iluminación de estudio para apreciar los acabados de color y textura */}
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

        <FloatingModel product={product} partColors={partColors} customText={customText} />

        {/* Sombra de contacto suave en el suelo */}
        <ContactShadows
          position={[0, -1.25, 0]}
          opacity={0.45}
          scale={7}
          blur={2.2}
          far={3}
        />

        {/* Controles de cámara táctiles y de ratón centrados en el modelo */}
        <OrbitControls
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={1.8}
          target={[0, 0.45, 0]}
          minDistance={2.5}
          maxDistance={6.5}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>

      {/* Indicador sutil de interacción */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-black/40 backdrop-blur-md rounded-full text-[10px] text-white/90 font-medium pointer-events-none flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse"></span>
        Arrastra para rotar 360°
      </div>
    </div>
  )
}
