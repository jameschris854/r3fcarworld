import { PointMaterial,Points } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

const DustParticles = () => {
    const particlesRef = useRef<Points>(null);
    const particleCount = 2000; // Adjusted particle count
  
    // Generate random particles
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
    }
  
    useFrame(() => {
      if (particlesRef.current) {
        // Example animation: slight vertical movement
        particlesRef.current.rotation.y += 0.001; // Rotate particles for dynamic effect
      }
    });
  
    return (
      <Points ref={particlesRef} positions={positions} stride={3} receiveShadow>
        <PointMaterial
          transparent
          color="#0f0f0f" // Color of the dust
          size={0.1} // Increased size of particles
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    );
  };

  export default DustParticles;