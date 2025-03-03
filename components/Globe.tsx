// components/Globe.tsx
"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const RotatingGlobe: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  // Rotate the globe on each frame
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });
  return (
    <mesh ref={meshRef}>
<<<<<<< Updated upstream
      {/* Sphere geometry to represent the globe */}
      <sphereGeometry args={[1, 32, 32]} />
      {/* Material can be a texture for Earth; using wireframe for a futuristic look */}
=======
      <sphereGeometry args={[1, 32, 32]} />
>>>>>>> Stashed changes
      <meshStandardMaterial color="#0cf" wireframe />
    </mesh>
  );
};

const Globe: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 3] }} style={{ width: "100%", height: "100%" }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <RotatingGlobe />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
};

export default Globe;
