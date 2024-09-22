import { useGLTF, Helper, Float, OrbitControls, shaderMaterial, MeshReflectorMaterial } from "@react-three/drei";
import { invalidate, useFrame, useThree } from "@react-three/fiber";
import React, {  useRef } from "react";
import { Mesh, TextureLoader, DirectionalLightHelper, Color, Vector3, Vector2 } from "three";
import Lamps from "./Lamps";
import TrafficCone from "./TrafficCone";
import { RigidBody } from "@react-three/rapier";
import { useControls as useLeva } from 'leva'
import { LEVA_KEY } from "../constants";
import commonStore from "../stores/commonStore";
import { Bloom, BrightnessContrast, DepthOfField, EffectComposer, HueSaturation, SSAO, Vignette } from "@react-three/postprocessing";
import DustParticles from "./DustParticles";
useGLTF.preload('/boxworld.glb');
useGLTF.preload('/Water_001_DISP.glb');
useGLTF.preload('/Water_001_NORM.glb');
useGLTF.preload('/lowpolylamp.glb')

const GameMap = () => {
  const { nodes, materials } = useGLTF('/boxworld.glb');
  const { camera: getCam, changeCamera } = commonStore();
  const { camera } = useThree()
  const groundRef = useRef<Mesh>(null)

  const waterRef = useRef<Mesh>(null)
  let mapHover = false;



  useFrame(({ clock }) => {
    const rippleOrigin = new Vector2(0, 0); // Origin of the ripple (stone throw point)
    const rippleSpeed = 2.0; // Speed of the ripple wave
    const waveHeight = 1; // Height of the ripple wave
    const waveFrequency = 1; // Frequency of the wave
    if (waterRef.current) {
      // Update the offset to create a wave effect
      const time = clock.getElapsedTime();
      waterRef.current.geometry.attributes.position.needsUpdate = true; // Notify that the position array needs updating
      // Update the vertices to create the ripple effect
      const position = waterRef.current.geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        // Calculate the distance from the ripple origin to each vertex
        const distance = new Vector2(x, y).distanceTo(rippleOrigin);
        // Apply a sine wave based on the distance from the ripple origin
        const wave = Math.sin(distance * waveFrequency - time * rippleSpeed) * waveHeight / (distance + 1); // Fade out as it expands
        position.setZ(i, wave);
      }
    }

    if (groundRef.current) {
      let material = groundRef.current.material;
      if (getCam === "orbitCam") {
        material.emissive.set(0x000000); // Reset to no emission
        material.emissiveIntensity = 0; // Make it glow
      }
      if (mapHover) {
        console.log(groundRef.current.material)
        material.emissive.set(new Color("red")); // Yellow highlight
        material.emissiveIntensity = 0.01; // Make it glow
      } else {
        material.emissive.set(0x000000); // Reset to no emission
        material.emissiveIntensity = 0; // Make it glow
      }
    }

  });

  const { debug } = useLeva(`${LEVA_KEY}-physics`, {
    debug: false,
  })

  const handleButtonPress = () => {
    if (getCam === "orbitCam") return;
    changeCamera("orbitCam"); invalidate();
    camera.position.set(-90, 40, 0)
  }

  return (
    <>
      {getCam === 'orbitCam' && <OrbitControls ref={(ref) => camera.position.set(-90, 40, 0)} target={[0, 0, 0]} />}
      <RigidBody type="fixed" colliders={"trimesh"} >
        <group onClick={handleButtonPress} onPointerMove={(e) => console.log("e", e)} onPointerOver={() => mapHover = true} onPointerOut={() => mapHover = false} receiveShadow castShadow>
          <mesh ref={groundRef} scale={[1, 1, 1]} position={[0, -10, 0]} material={materials['Wet and Rocky Sand']} geometry={nodes.Plane.children[0].geometry} receiveShadow castShadow />
          <mesh scale={[1, 1, 1]} position={[0, -10, 0]} material={materials['Snowy forest path']} geometry={nodes.Plane.children[1].geometry} receiveShadow castShadow />
        </group>
      </RigidBody>
      <DustParticles />

      <group>
        <mesh ref={waterRef} receiveShadow castShadow rotation={[-Math.PI / 2, 0, 0]} position={[20, -12.5, -17]}  >
          <planeGeometry args={[40, 40, 64, 64]} />
          <MeshReflectorMaterial
            envMapIntensity={1}
            opacity={0.7}
            reflectorOffset={1.33}
            displacementMap={new TextureLoader().load('/Water_001_DISP.png')}
            displacementScale={0.1}
            blur={[300, 100]} // Blur effect on the reflection
            resolution={512} // Resolution of the reflection
            mixBlur={1} // Mix intensity of the blur
            mixStrength={10} // Strength of the reflection
            roughness={0.1} // Roughness of the surface
            depthScale={1.2} // Depth of the surface distortion
            minDepthThreshold={0.9} // Minimum depth threshold for reflection
            maxDepthThreshold={1} // Maximum depth threshold for reflection
            color="#666b5a" // Base color of the water
            metalness={0} // Adjust metalness for reflectivity
            transparent mirror={0}

          />
        </mesh>
      </group>
      <EffectComposer>
        <BrightnessContrast
          brightness={-0.05} // Lower brightness to maintain darkness
        />
        <Bloom intensity={0.5} />
        <Vignette eskil={false} offset={0.1} darkness={1.0} />
      </EffectComposer>
      <Lamps position={[26.5, 0, 20]} rotation={[0, Math.PI, 0]} />
      <Lamps position={[24.5, -1, 0]} rotation={[0, Math.PI, 0]} />
      <Lamps position={[23.5, -1.5, -20]} rotation={[0, Math.PI, 0]} />
      <Lamps position={[22.5, -2, -35]} rotation={[0, Math.PI, 0]} />
      <TrafficCone position={[-40, -9.5, 22]} />
      <pointLight receiveShadow castShadow color={"orange"} position={[-40, -7, 29]} intensity={10} />
      <TrafficCone position={[-40, -9.5, 35]} />
      <TrafficCone position={[-22, -11, -35]} />
      <pointLight receiveShadow castShadow color={"orange"} position={[-22, -7.5, -40]} intensity={10} />
      <TrafficCone position={[-24, -10.5, -45]} />
      <directionalLight
        position={[5, 20, 50]}
        intensity={1.5}
        args={[100, 100]}
        castShadow
        color={"#ffffe0"}
        shadow-camera-left={-100}    // Increase left
        shadow-camera-right={100}     // Increase right
        shadow-camera-top={100}       // Increase top
        shadow-camera-bottom={-100}    // Increase bottom
        shadow-camera-near={0.5}
        shadow-camera-far={120}      // Increase far plane if necessary
        shadow-mapSize-width={8096}
        shadow-mapSize-height={8096}
        shadow-bias={-0.001} // Adjust bias to reduce artifacts
      >
        {debug && <Helper type={DirectionalLightHelper} />}
      </directionalLight>
      <Float castShadow receiveShadow speed={1}>
        <mesh position={[24.5, -10, -20]} castShadow receiveShadow>
          <sphereGeometry args={[1.5, 20, 30]} />
          <meshStandardMaterial
            color="aqua"        // Base color of the material
            emissive="aqua"
            emissiveIntensity={1}  // Intensity of the emissive effect
          />
          <pointLight
            castShadow
            receiveShadow
            position={[0, 0, 0]}  // Position (same as the sphere)
            intensity={30}       // Brightness of the light
            distance={10}         // How far the light reaches
            color="aqua"        // Light color (matching the emissive glow)
          />
        </mesh>
      </Float>
    </>
  );
}

export default GameMap;