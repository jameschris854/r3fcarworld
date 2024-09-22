import { Helper } from "@react-three/drei";
import React, { useEffect, useMemo, useRef } from "react";
import { Mesh, SpotLight, Vector3, SpotLightHelper } from "three";
import { LEVA_KEY } from "../constants";
import { useControls as useLeva } from 'leva'

const CarHeadLights = () => {
    const headlightLeftRef = useRef<Mesh | null>(null);
    const headlightRightRef = useRef<Mesh | null>(null);
    const leftSpotlightRef = useRef<SpotLight>(null);
    const rightSpotlightRef = useRef<SpotLight>(null);
    const headlightPositionLeft = useMemo(() => new Vector3(2.5, 0, -1), []);
    const headlightPositionRight = useMemo(() => new Vector3(2.5, 0, 1), []);

    const { debug } = useLeva(`${LEVA_KEY}-physics`, { debug: true });

    useEffect(() => {
        // Ensure that the target is updated after mounting
        if (leftSpotlightRef.current && headlightLeftRef.current) {
            leftSpotlightRef.current.target = headlightLeftRef.current;
        }
        if (rightSpotlightRef.current && headlightRightRef.current) {
            rightSpotlightRef.current.target = headlightRightRef.current;
        }
    }, [headlightLeftRef, headlightRightRef]);

    return (
        <>
            <mesh ref={headlightLeftRef} position={headlightPositionLeft}>
                <cylinderGeometry args={[0,0,0]} />
            </mesh>
            <spotLight
                ref={leftSpotlightRef}
                position={[headlightPositionLeft.x - 1, 0, headlightPositionLeft.z]}
                rotation={[Math.PI / 2, Math.PI / 4, 0]} // Rotation in radians
                angle={0.8}
                decay={1}
                distance={20}
                castShadow
                receiveShadow
                penumbra={1}
                intensity={20}
                shadow-bias={-0.005} // Adjust bias to reduce artifacts
            >
                {debug && <Helper type={SpotLightHelper} />}
            </spotLight>

            <mesh ref={headlightRightRef} position={headlightPositionRight}>
                <cylinderGeometry args={[0,0,0]} />
            </mesh>
            <spotLight
                ref={rightSpotlightRef}
                position={[headlightPositionRight.x - 1, 0, headlightPositionRight.z]}
                rotation={[Math.PI / 2, Math.PI / 4, 0]} // Rotation in radians
                angle={0.8}
                decay={1}
                distance={20}
                castShadow
                receiveShadow
                penumbra={1}
                intensity={20}
                shadow-bias={-0.005} // Adjust bias to reduce artifacts

            >
                {debug && <Helper type={SpotLightHelper} />}
            </spotLight>
        </>
    );
};

export default CarHeadLights;