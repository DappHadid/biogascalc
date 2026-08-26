import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";

/* ── Gradient sky dome (simple, predictable colors) ───────────*/
function SkyDome() {
  const material = useMemo(() => {
    const uniforms = {
      topColor: { value: new THREE.Color("#6fb1e8") },
      bottomColor: { value: new THREE.Color("#dfeff5") },
      offset: { value: 20 },
      exponent: { value: 0.7 },
    };
    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide,
    });
  }, []);

  return (
    <mesh material={material}>
      <sphereGeometry args={[400, 32, 15]} />
    </mesh>
  );
}
import {
  hemisphereProfile,
  semiEllipsoidProfile,
  buildLathe,
} from "../../utils/geometry";


/* ── Dome mesh (circular) — solid concrete shell ───────────────*/
function DomeMesh({ radius, domeHeight }) {
  const geometry = useMemo(() => {
    const profile = Math.abs(domeHeight - radius) < 1e-6
      ? hemisphereProfile(radius)
      : semiEllipsoidProfile(radius, domeHeight);
    return buildLathe(profile, 80);
  }, [radius, domeHeight]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color="#9a9691"
        side={THREE.DoubleSide}
        roughness={0.92}
        metalness={0.02}
      />
    </mesh>
  );
}

/* ── Rectangle dome mesh: box walls + half-cylinder roof ──────*/
function RectangleDomeMesh({ length, width, wallHeight }) {
  const roofRadius = width / 2;

  const wallGeo = useMemo(() => {
    if (wallHeight <= 0) return null;
    const g = new THREE.BoxGeometry(length, wallHeight, width);
    g.translate(0, wallHeight / 2, 0);
    return g;
  }, [length, width, wallHeight]);

  const roofGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(roofRadius, roofRadius, length, 48, 1, false, 0, Math.PI);
    g.rotateZ(Math.PI / 2);
    g.rotateY(Math.PI / 2);
    g.translate(0, wallHeight, 0);
    return g;
  }, [length, roofRadius, wallHeight]);

  return (
    <group>
      {wallGeo && (
        <mesh geometry={wallGeo} castShadow receiveShadow>
          <meshStandardMaterial color="#9a9691" side={THREE.DoubleSide} roughness={0.92} metalness={0.02} />
        </mesh>
      )}
      <mesh geometry={roofGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#a29e98" side={THREE.DoubleSide} roughness={0.92} metalness={0.02} />
      </mesh>
    </group>
  );
}



/* ── Base ring (concrete footing at dome base) ────────────────*/
function BaseRing({ radius }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
      <ringGeometry args={[radius - 0.05, radius + 0.15, 80]} />
      <meshStandardMaterial color="#8a8680" roughness={0.95} />
    </mesh>
  );
}

/* ── Human scale reference (simple blocky humanoid) ─────────────*/
function PersonScale({ x = 0, z = 0, height = 2 }) {
  // Proportions based on total height
  const headR = height * 0.065;
  const torsoW = height * 0.22;
  const torsoH = height * 0.35;
  const torsoD = height * 0.12;
  const legW = height * 0.08;
  const legH = height - (headR * 2) - torsoH;
  const legD = height * 0.1;
  const armW = height * 0.06;
  const armH = height * 0.38;
  const armD = height * 0.08;

  const headY = height - headR;
  const torsoY = legH + torsoH / 2;
  const legY = legH / 2;
  const armY = legH + torsoH - armH / 2 - (height * 0.02);

  const mat = <meshStandardMaterial color="#33414d" roughness={0.8} />;

  return (
    <group position={[x, 0, z]}>
      {/* Head */}
      <mesh position={[0, headY, 0]} castShadow>
        <sphereGeometry args={[headR, 16, 16]} />
        {mat}
      </mesh>
      {/* Torso */}
      <mesh position={[0, torsoY, 0]} castShadow>
        <boxGeometry args={[torsoW, torsoH, torsoD]} />
        {mat}
      </mesh>
      {/* Left Arm */}
      <mesh position={[-torsoW/2 - armW/2 - 0.02, armY, 0]} castShadow>
        <boxGeometry args={[armW, armH, armD]} />
        {mat}
      </mesh>
      {/* Right Arm */}
      <mesh position={[torsoW/2 + armW/2 + 0.02, armY, 0]} castShadow>
        <boxGeometry args={[armW, armH, armD]} />
        {mat}
      </mesh>
      {/* Left Leg */}
      <mesh position={[-torsoW/4, legY, 0]} castShadow>
        <boxGeometry args={[legW, legH, legD]} />
        {mat}
      </mesh>
      {/* Right Leg */}
      <mesh position={[torsoW/4, legY, 0]} castShadow>
        <boxGeometry args={[legW, legH, legD]} />
        {mat}
      </mesh>
      
      {/* ground marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[torsoW * 1.2, 24]} />
        <meshBasicMaterial color="#001e2b" transparent opacity={0.2} />
      </mesh>
      
      {/* height label */}
      <Html position={[0, height + 0.25, 0]} center distanceFactor={10} occlude={false}>
        <div
          style={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 9999,
            backgroundColor: "rgba(0,30,43,0.7)",
            color: "#ffffff",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {height} m
        </div>
      </Html>
    </group>
  );
}

/* ── Ground (grass/earth field) ───────────────────────────────*/
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[60, 64]} />
      <meshStandardMaterial color="#5b8a4a" roughness={1} />
    </mesh>
  );
}

/* ── Animated subtle rotation helper ────────────────────────*/
function AutoRotate({ enabled }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current && enabled) {
      ref.current.rotation.y += delta * 0.08;
    }
  });
  return <group ref={ref} />;
}

/* ── Scene (inside Canvas) ───────────────────────────────────*/
const PERSON_HEIGHT = 2;
const PERSON_GAP = 0.6;
const PERSON_RADIUS = 0.35; // rough half-width of the human figure's bounding box

function Scene({ calc, params }) {
  const isRectangle = calc.shape === "rectangle";
  const showPerson = params.showPerson !== false;

  const totalHeight = isRectangle
    ? calc.wallHeight + calc.roofRadius
    : calc.domeHeight;
  const domeFootprint = isRectangle
    ? Math.max(calc.length, calc.width) / 2
    : calc.radius;

  // Person sits just outside the dome footprint on one axis;
  // include its position + bounding radius so it's never clipped by the camera.
  const personOffset = isRectangle
    ? calc.width / 2 + PERSON_GAP
    : calc.radius + PERSON_GAP;
  const personReach = personOffset + PERSON_RADIUS;

  // Combined bounding footprint/height (dome + person), centered on the origin.
  const footprint = Math.max(domeFootprint, showPerson ? personReach : 0);
  const sceneHeight = Math.max(totalHeight, showPerson ? PERSON_HEIGHT : 0);

  const camDistance = Math.max(footprint, sceneHeight) * 3.2;
  const shadowExtent = Math.max(footprint * 2, 6);

  // Orbit around the midpoint between the dome's center and the person,
  // so the pair rotates together instead of the person swinging around alone.
  const orbitTargetX = showPerson && !isRectangle ? personOffset / 2 : 0;
  const orbitTargetZ = showPerson && isRectangle ? personOffset / 2 : 0;

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[camDistance, camDistance * 0.6, camDistance]}
        fov={40}
      />

      <SkyDome />

      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#bfd9ff", "#5b8a4a", 0.5]} />
      <directionalLight
        position={[footprint * 2.2, footprint * 2.8, footprint * 1.4]}
        intensity={1.6}
        color="#fff4dd"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-shadowExtent}
        shadow-camera-right={shadowExtent}
        shadow-camera-top={shadowExtent}
        shadow-camera-bottom={-shadowExtent}
        shadow-camera-near={0.5}
        shadow-camera-far={footprint * 8}
        shadow-bias={-0.0015}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-footprint, footprint * 0.7, -footprint]} intensity={0.25} color="#c3d9ff" />

      <Ground />

      <group>
        {isRectangle ? (
          <>
            <RectangleDomeMesh length={calc.length} width={calc.width} wallHeight={calc.wallHeight} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
              <planeGeometry args={[calc.length + 0.1, calc.width + 0.1]} />
              <meshBasicMaterial color="#001e2b" transparent opacity={0.15} />
            </mesh>
            {showPerson && <PersonScale x={0} z={personOffset} height={PERSON_HEIGHT} />}
          </>
        ) : (
          <>
            <DomeMesh     radius={calc.radius} domeHeight={calc.domeHeight} />
            <BaseRing     radius={calc.radius} />
            {showPerson && <PersonScale x={personOffset} z={0} height={PERSON_HEIGHT} />}
          </>
        )}
      </group>

      <Grid
        position={[0, 0.005, 0]}
        args={[30, 30]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#3f5c33"
        sectionSize={5}
        sectionThickness={0.8}
        sectionColor="#2f4527"
        fadeDistance={35}
        fadeStrength={1.5}
        infiniteGrid
      />

      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        minDistance={1}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2 + 0.1}
        target={[orbitTargetX, totalHeight / 2, orbitTargetZ]}
      />
    </>
  );
}

/* ── Main export ─────────────────────────────────────────────*/
export default function DomeVisualizer({ calc, params }) {
  const containerRef = useRef(null);

  // Fallback cleanup in case component unmounts while hovered
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleMouseEnter = () => {
    document.body.style.overflow = "hidden";
  };

  const handleMouseLeave = () => {
    document.body.style.overflow = "auto";
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 420,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #e1e5e8",
        backgroundColor: "#f9fbfa",
        position: "relative",
        touchAction: "none",
      }}
    >
      <Canvas shadows gl={{ antialias: true, alpha: false }} style={{ background: "#f0f4f2" }}>
        <Scene calc={calc} params={params} />
      </Canvas>

      {/* Controls hint */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          display: "flex",
          gap: 6,
          pointerEvents: "none",
        }}
      >
        {["Drag: Putar", "Scroll: Zoom", "Shift+Drag: Pan"].map((t) => (
          <span
            key={t}
            style={{
              fontSize: "0.6875rem",
              padding: "3px 8px",
              borderRadius: 9999,
              backgroundColor: "rgba(0,30,43,0.55)",
              color: "#ffffff",
              backdropFilter: "blur(4px)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
