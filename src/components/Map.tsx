import { useGLTF, Helper, Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { Mesh, TextureLoader, DirectionalLightHelper } from "three";
import Lamps from "./Lamps";
import TrafficCone from "./TrafficCone";
import { RigidBody } from "@react-three/rapier";

const GameMap = () => {
        const { nodes ,materials} = useGLTF('/boxworld.glb');
        console.log(nodes,materials)
    
        const waterRef = useRef<Mesh>(null)
    
        // useFrame(() => {
        //     if(waterRef.current){
        //         const newPos = new Vector3(0,0,0)
        //         waterRef.current?.translateY(0)
        //     }
        // })
    
        useFrame(({ clock }) => {
            if (waterRef.current) {
              // Update the offset to create a wave effect
              const time = clock.getElapsedTime();
              waterRef.current.material.map.offset.y = Math.sin(time * 0.5) * 0.1; // Adjust for animation speed
              waterRef.current.material.map.offset.x = Math.cos(time * 0.5) * 0.1;
            }
          });
    
        return (
            <>
                <RigidBody type="fixed" colliders={"trimesh"} >
                    <primitive scale={[1,1,1]} position={[0,-10,0]} object={nodes.Plane}/>
                </RigidBody>
                {/* <mesh scale={[20,20,20]}  position={[20,-12,-17]} geometry={nodes.Plane001.geometry}/> */}
                <group>
                    <mesh ref={waterRef} receiveShadow castShadow scale={[20,20,20]}  position={[20,-14,-17]} geometry={nodes.Plane001.geometry} >
                        {/* <wobbleMaterialImpl /> */}
                        <meshPhysicalMaterial
                               transmission={1}
                               thickness={1}
                               roughness={0.1}
                               reflectivity={0.4}
                               clearcoat={1}
                               clearcoatRoughness={0.1}
                               metalness={0}
                               color="green"
                               opacity={0.5}
                               transparent={true}
                               envMapIntensity={1}
                               // Add a texture for animation
                               map={new TextureLoader().load('/Water_001_NORM.jpg')}
                               // Use offset to animate texture
                               displacementMap={new TextureLoader().load('/Water_001_DISP.png')}
                               displacementScale={0.1}
                        />
                    </mesh>
                </group>
                <Lamps position={[26.5,0,20]} rotation={[0,Math.PI,0]} />
                <Lamps position={[24.5,-1,0]} rotation={[0,Math.PI,0]} />
                <Lamps position={[23.5,-1.5,-20]} rotation={[0,Math.PI,0]} />
                <Lamps position={[22.5,-2,-35]} rotation={[0,Math.PI,0]} />
                <TrafficCone position={[-40,-10,22]} />
                <pointLight receiveShadow castShadow color={"orange"} position={[-40,-7,29]} intensity={10} />
                <TrafficCone position={[-40,-10,35]} />
                <TrafficCone position={[-22,-11.5,-35]} />
                <pointLight  receiveShadow castShadow color={"orange"} position={[-22,-7.5,-40]} intensity={10} />
                <TrafficCone position={[-22,-10.5,-45]} />
                <directionalLight
                    castShadow
                    receiveShadow
                    color={"#ffffe0"}
                    position={[200,200,0]}
                    args={[100,100]}
                    intensity={1}
                >
                    <Helper type={DirectionalLightHelper} />
                </directionalLight>
                <Float castShadow receiveShadow speed={1}>
                    <mesh position={[24.5,-10,-20]} castShadow receiveShadow>
                        <sphereGeometry args={[1.5,20,30]} />
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