import { Helper, useGLTF } from "@react-three/drei";
import React, { useRef } from "react";
import { Mesh, SpotLightHelper } from "three";
import { LEVA_KEY } from "../constants";
import { useControls as useLeva } from 'leva'

const Lamps = ({position,rotation}) => {

    const  { nodes,materials }  = useGLTF('/lowpolylamp.glb')
    const targetRef = useRef<Mesh>(null)
    const { debug } = useLeva(`${LEVA_KEY}-physics`, {
        debug: false,
    })
    return <mesh castShadow receiveShadow position={position} rotation={rotation} >
        <mesh geometry={nodes.Cube.geometry} scale={[0.07,3,0.07]}>
            <meshPhysicalMaterial
                color={"#AAAAAA"}
                metalness={1}
                roughness={0.3}
                reflectivity={0.8}          // Higher reflectivity for a polished steel look
                clearcoat={0.1}             // Adds a thin clear coating for a polished effect
                clearcoatRoughness={0.1}    // How rough the clear coat is
            />
        </mesh>
        <mesh ref={targetRef} position={[-4,-5,0]} >
            <boxGeometry args={[0,0,0]} />
        </mesh>
        {targetRef.current && <spotLight
            position={[-1.3,3,0]}
            target={targetRef.current}
            angle={1.5}
            decay={1}
            distance={20}
            castShadow
            receiveShadow
            penumbra={1}
            intensity={20}
        >
            {debug && <Helper type={SpotLightHelper} />}
        </spotLight>}
    </mesh>
}

export default Lamps;
