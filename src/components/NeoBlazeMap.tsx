import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React, { useEffect } from "react";
import { CanvasTexture } from "three";
useGLTF.preload('/neoblaze2.glb');
const GradientBackground = () => {
    const { gl, scene } = useThree();
  
    useEffect(() => {
      // Create a canvas for the gradient
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d');
  
      // Create a vertical gradient
      const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgb(0, 127, 127)');  // Bottom color
      gradient.addColorStop(1, 'rgb(251, 205, 106)'); // Top color
  
      // Apply gradient to canvas
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      // Create a texture from the canvas and set it as the scene background
      const texture = new CanvasTexture(canvas);
      scene.background = texture;
    }, [scene]);
  
    return null;
  };
const Map = () => {
    const neoblaze2 = useGLTF('/neoblaze2.glb');
    return <>
        <GradientBackground />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow color={"#FFEFD5"} />
            <group position={[0,-10,0]}>
                <RigidBody colliders="trimesh" type="fixed" scale={0.5}>
            <primitive object={neoblaze2.scene} scale={0.5} />
        </RigidBody>
        </group>
    </>
  }


  export default Map;