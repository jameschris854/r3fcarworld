import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Water } from 'three-stdlib';
import { Mesh, PlaneGeometry, RepeatWrapping, TextureLoader, Vector3 } from 'three';

function WaterSurface() {
  const waterRef = useRef<Mesh>(null);
  
  // Load the water normals texture
  const waterNormals = useLoader(TextureLoader, '/waternormals.jpg');
  useMemo(() => {
    // waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;
  }, [waterNormals]);

  // Create the water material once using useMemo
  const waterMaterial = useMemo(() => {
    return new Water(
      new PlaneGeometry(1000, 1000), // Plane geometry for the water
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormals,
        sunDirection: new Vector3(),
        sunColor: 0xffffff,
        waterColor: '0x001e0f',
        distortionScale: 3.7,
        fog: false,
      }
    );
  }, [waterNormals]);

  // Animate the water's "time" uniform
  useFrame((state, delta) => {
    // if (waterRef.current?.material?.uniforms) {
    //   waterRef.current.material.uniforms['time'].value += delta;
    // }
  });

  return (
    <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <primitive object={waterMaterial} attach="material" />
    </mesh>
  );
}

export default WaterSurface;
