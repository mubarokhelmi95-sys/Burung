import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame, useVideoConfig} from 'remotion';

const BROWN = '#8a4b2a';
const DARK_BROWN = '#5a2e18';
const CREAM = '#f1ece4';
const BARK = '#6b4a2f';
const LEAF = '#5aa545';
const LEAF_DARK = '#3f8a35';

// Mata: putih + pupil hitam + kilau. blink = 1 (terbuka) sampai 0.1 (merem)
const Eye: React.FC<{x: number; blink: number}> = ({x, blink}) => (
  <group position={[x, 0.1, 0.38]} scale={[1, blink, 1]}>
    <mesh>
      <sphereGeometry args={[0.17, 24, 24]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
    <mesh position={[0, 0, 0.11]}>
      <sphereGeometry args={[0.095, 24, 24]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
    <mesh position={[0.03, 0.04, 0.19]}>
      <sphereGeometry args={[0.028, 12, 12]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  </group>
);

// Sayap: pivot di bahu, rotasi z buat kepak
const Wing: React.FC<{side: 1 | -1; flap: number}> = ({side, flap}) => (
  <group
    position={[side * 0.62, 0.5, -0.05]}
    rotation={[0, 0, side * (-0.18 - flap)]}
  >
    <mesh position={[side * 0.08, -0.25, -0.2]} scale={[0.16, 0.62, 0.8]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial color={DARK_BROWN} />
    </mesh>
    {/* ujung bulu sayap */}
    <mesh position={[side * 0.08, -0.7, -0.55]} rotation={[0.5, 0, 0]} scale={[0.1, 0.1, 0.5]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3b1d0e" />
    </mesh>
  </group>
);

const Leg: React.FC<{x: number}> = ({x}) => (
  <group position={[x, -0.72, 0.1]}>
    <mesh>
      <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
      <meshStandardMaterial color="#d9a68a" />
    </mesh>
    {/* cakar */}
    <mesh position={[0, -0.24, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.07, 0.025, 8, 16, Math.PI * 1.5]} />
      <meshStandardMaterial color="#d9a68a" />
    </mesh>
  </group>
);

const Bird: React.FC<{t: number}> = ({t}) => {
  // napas pelan
  const breathe = 1 + Math.sin(t * Math.PI * 1.6) * 0.018;

  // toleh kepala pelan + sesekali miring
  const headY = Math.sin(t * 0.9) * 0.55 + Math.sin(t * 2.3) * 0.08;
  const headZ = Math.sin(t * 0.9 + 1) * 0.08;
  const headBob = Math.sin(t * 3.1) * 0.015;

  // kedip tiap 3 detik, 0.14 detik
  const blinkPhase = t % 3;
  const blink = blinkPhase < 0.14 ? 0.1 : 1;

  // kepak kecil tiap 4.5 detik
  const c = t % 4.5;
  const flap = c < 0.7 ? Math.sin((c / 0.7) * Math.PI * 4) * Math.sin((c / 0.7) * Math.PI) * 0.55 : 0;

  return (
    <group position={[0, 0.65, 0]}>
      {/* badan */}
      <group scale={[1, breathe, 1]}>
        <mesh position={[0, 0.3, -0.1]} scale={[0.85, 0.95, 1.05]}>
          <sphereGeometry args={[0.85, 32, 32]} />
          <meshStandardMaterial color={BROWN} />
        </mesh>
        {/* perut krem */}
        <mesh position={[0, 0.2, 0.28]} scale={[0.82, 0.95, 0.7]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
      </group>

      {/* kepala */}
      <group position={[0, 1.0 + headBob, 0.22]} rotation={[0, headY, headZ]}>
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={BROWN} />
        </mesh>
        {/* pipi krem */}
        <mesh position={[0, -0.12, 0.18]} scale={[0.9, 0.7, 0.8]}>
          <sphereGeometry args={[0.4, 24, 24]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
        <Eye x={-0.27} blink={blink} />
        <Eye x={0.27} blink={blink} />
        {/* paruh */}
        <mesh position={[0, -0.02, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.3, 16]} />
          <meshStandardMaterial color="#e0a63a" />
        </mesh>
      </group>

      {/* sayap kiri-kanan */}
      <Wing side={1} flap={flap} />
      <Wing side={-1} flap={flap} />

      {/* ekor */}
      <mesh position={[0, -0.05, -1.0]} rotation={[0.55, 0, 0]} scale={[0.35, 0.08, 0.9]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={DARK_BROWN} />
      </mesh>

      {/* kaki */}
      <Leg x={-0.25} />
      <Leg x={0.25} />
    </group>
  );
};

const Tree: React.FC = () => (
  <group>
    {/* batang */}
    <mesh position={[-3.6, 1.2, -0.3]}>
      <cylinderGeometry args={[0.55, 0.75, 6.5, 16]} />
      <meshStandardMaterial color={BARK} />
    </mesh>
    {/* dahan tempat hinggap */}
    <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.13, 0.2, 5.4, 12]} />
      <meshStandardMaterial color={BARK} />
    </mesh>
    {/* ranting kecil */}
    <mesh position={[1.4, 0.35, -0.1]} rotation={[0, 0, 0.9]}>
      <cylinderGeometry args={[0.04, 0.07, 1.1, 8]} />
      <meshStandardMaterial color={BARK} />
    </mesh>
    {/* daun */}
    {[
      [-3.6, 4.6, -0.3, 1.9, LEAF],
      [-2.2, 4.0, -0.8, 1.5, LEAF_DARK],
      [-4.9, 3.8, -0.6, 1.4, LEAF_DARK],
      [-3.0, 5.6, -0.6, 1.3, LEAF],
      [-1.4, 0.55, -0.4, 0.55, LEAF],
      [2.0, 0.9, -0.2, 0.45, LEAF],
    ].map(([x, y, z, r, color], i) => (
      <mesh key={i} position={[x as number, y as number, z as number]}>
        <sphereGeometry args={[r as number, 20, 20]} />
        <meshStandardMaterial color={color as string} />
      </mesh>
    ))}
  </group>
);

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;

  // kamera muter pelan
  const orbit = Math.sin(t * 0.35) * 0.3;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{position: [0, 1.4, 6.5], fov: 38}}
      style={{backgroundColor: '#9fd3f2'}}
    >
      <color attach="background" args={['#9fd3f2']} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} />

      <group rotation={[0, orbit, 0]}>
        <Tree />
        <Bird t={t} />
        {/* tanah */}
        <mesh position={[0, -3.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#8cc06a" />
        </mesh>
      </group>
    </ThreeCanvas>
  );
};

export default Scene;
    
