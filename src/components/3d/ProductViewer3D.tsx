import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float, ContactShadows, RoundedBox, Text, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { findColor, type PartColors, type Product } from '../../data/products'
import { playMechanicalClick } from '../../utils/sound'
import { pressHandlers } from '../../lib/press'

interface ViewerProps {
  product: Product
  /** A colour id for every part */
  colors: PartColors
  customText?: string
  autoRotate?: boolean
  /**
   * Drag to turn, wheel to zoom, press the clicker. Off on the catalog posters, where a finger on the piece must
   * still scroll the page.
   */
  interactive?: boolean
  /** Holds the piece still, without floating or turning (reduced motion) */
  still?: boolean
}

/** Part id → hex, for the materials */
type Hexes = Record<string, string>

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

// The brand text sits on all four sides of the box: [position, rotation about y]
const BOX_SIDES: [[number, number, number], number][] = [
  [[0, 0, 2.03], 0],
  [[0, 0, -2.03], Math.PI],
  [[2.03, 0, 0], Math.PI / 2],
  [[-2.03, 0, 0], -Math.PI / 2],
]

// 1. Adaptador Portamicrófono Inalámbrico de Mano 3D (Caja 4x3x4 cm | Mango: 5.6cm x Ø1.4cm | Cabeza: 2.7x2.5cm)
function MicCubeModel({ colors, customText }: { colors: Hexes; customText?: string }) {
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

        {BOX_SIDES.map(([position, turn]) => (
          <Text
            key={turn}
            position={position}
            rotation={[0, turn, 0]}
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
        ))}
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

const CLICKER_URL = '/models/clicker-sakura.glb'
const FRAME_URL = '/models/portafotos-margarita.glb'

// How far the clicker's centre sinks when pressed, in the model's units
const PRESS_DEPTH = 0.18

// Pieces converted from the Bambu Lab .3mf files (compressed with `npm run models`). Their meshes are named after
// the part ids. Compression moves each part's rest position into its node, so a press sinks the centre from there.
function GlbModel({ url, colors }: { url: string; colors: Hexes }) {
  const { scene } = useGLTF(url)
  const { model, meshes } = useMemo(() => {
    const model = scene.clone()
    const meshes: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>[] = []
    model.traverse(child => {
      if (!(child as THREE.Mesh).isMesh) return
      const mesh = child as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
      const center = mesh.name === 'center'
      mesh.material = new THREE.MeshStandardMaterial({ roughness: center ? 0.32 : 0.38, metalness: center ? 0.06 : 0.04 })
      mesh.castShadow = true
      mesh.receiveShadow = true
      meshes.push(mesh)
    })
    return { model, meshes }
  }, [scene])

  useEffect(() => {
    for (const mesh of meshes) mesh.material.color.set(colors[mesh.name] ?? '#FFFFFF')
  }, [meshes, colors])

  useEffect(() => () => meshes.forEach(mesh => mesh.material.dispose()), [meshes])

  return <primitive object={model} />
}

// 2. Clicker Flor 3D: pressing the centre sinks it and plays the switch sound once per press
function ClickerModel({ colors, interactive }: { colors: Hexes; interactive: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const [pressed, setPressed] = useState(false)
  const press = useMemo(() => pressHandlers({ onPress: playMechanicalClick, onPressedChange: setPressed }), [])

  useEffect(() => {
    const center = groupRef.current?.getObjectByName('center')
    if (!center) return
    // The resting height comes from the file, so it is read once and kept on the part itself
    center.userData.restY ??= center.position.y
    center.position.y = center.userData.restY - (pressed ? PRESS_DEPTH : 0)
  }, [pressed])

  return (
    <group ref={groupRef} position={[0, 0.45, 0]} scale={0.46} rotation={[0.75, 0, 0]} {...(interactive ? press : {})}>
      <GlbModel url={CLICKER_URL} colors={colors} />
    </group>
  )
}

// 3. Portafotos Margarita 3D
function FrameModel({ colors }: { colors: Hexes }) {
  return (
    <group position={[0, 0.45, 0]} scale={0.52} rotation={[0.2, 0, 0]}>
      <GlbModel url={FRAME_URL} colors={colors} />
    </group>
  )
}

useGLTF.preload(CLICKER_URL)
useGLTF.preload(FRAME_URL)

// 4. Llavero Tipográfico 3D
function KeychainModel({ colors }: { colors: Hexes }) {
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
        {[[-0.8, 0.3], [-0.3, 0.35], [0.3, 0.4], [0.85, 0.3]].map(([x, width]) => (
          <mesh key={x} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[width, 0.6, 0.1]} />
            <meshStandardMaterial color={lettersColor} roughness={0.25} />
          </mesh>
        ))}
      </group>

      {/* Ojal para el aro de la llave */}
      <mesh position={[-1.65, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.26, 0.08, 16, 24]} />
        <meshStandardMaterial color={loopColor} roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  )
}

// Floats and bobs gently. On the posters (no camera controls) it also sways from side to side, never so far that a
// flat piece like the flower shows its edge.
function Motion({ still, sway, children }: { still: boolean; sway: boolean; children: ReactNode }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(state => {
    const group = groupRef.current
    if (!group || still) return
    group.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.06
    if (sway) group.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.5
  })

  if (still) return <group>{children}</group>
  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
        {children}
      </Float>
    </group>
  )
}

const CAMERA: [number, number, number] = [0, 0.82, 4.3]
const TARGET: [number, number, number] = [0, 0.45, 0]
const FOV = 42
// Width, in scene units, that must stay in frame: the flower, the widest piece, with a margin
const FRAME_WIDTH = 3.6

// Pulls the camera back on a narrow stage (a tall one on a wide screen) so wide pieces keep their edges in frame
function Framing() {
  const camera = useThree(state => state.camera)
  const aspect = useThree(state => state.size.width / state.size.height)
  useEffect(() => {
    const fits = FRAME_WIDTH / (2 * Math.tan(((FOV / 2) * Math.PI) / 180) * aspect)
    const base = new THREE.Vector3(...CAMERA).sub(new THREE.Vector3(...TARGET))
    camera.position.copy(base.setLength(Math.max(base.length(), fits)).add(new THREE.Vector3(...TARGET)))
  }, [camera, aspect])
  return null
}

export function ProductViewer3D({ product, colors, customText, autoRotate = true, interactive = true, still = false }: ViewerProps) {
  const hexes = useMemo(
    () => Object.fromEntries(product.parts.map(part => [part.id, findColor(colors[part.id])?.hex ?? '#FFFFFF'])),
    [product, colors],
  )

  return (
    // data-lenis-prevent hands the wheel to the camera zoom instead of the smooth page scroll
    <div
      className={`w-full h-full relative select-none ${interactive ? '' : 'pointer-events-none'}`}
      {...(interactive ? { 'data-lenis-prevent': true } : {})}
    >
      <Canvas shadows camera={{ position: CAMERA, fov: FOV }} gl={{ antialias: true, alpha: true }}>
        <Framing />
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

          <Motion still={still} sway={!interactive && autoRotate}>
            {product.modelType === 'mic-cube' && <MicCubeModel colors={hexes} customText={customText} />}
            {product.modelType === 'clicker' && <ClickerModel colors={hexes} interactive={interactive} />}
            {product.modelType === 'frame' && <FrameModel colors={hexes} />}
            {product.modelType === 'keychain' && <KeychainModel colors={hexes} />}
          </Motion>

          {/* Sombra de contacto suave en el suelo */}
          <ContactShadows position={[0, -1.25, 0]} opacity={0.45} scale={7} blur={2.2} far={3} />

          {/* Controles de cámara táctiles y de ratón centrados en el modelo */}
          {interactive && (
            <OrbitControls
              enablePan={false}
              autoRotate={autoRotate && !still}
              autoRotateSpeed={1.8}
              target={TARGET}
              minDistance={2.5}
              maxDistance={8}
              maxPolarAngle={Math.PI / 1.7}
              minPolarAngle={Math.PI / 4}
            />
          )}
      </Canvas>
    </div>
  )
}
