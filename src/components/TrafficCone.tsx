import { RigidBody } from "@react-three/rapier";
import React from "react";

const TrafficCone = ({position}) => {
    return (
      <RigidBody mass={1}>
        <group receiveShadow castShadow position={position}>
          <mesh castShadow receiveShadow position={[0, 1, 0]}>
                <cylinderGeometry args={[0.2, 0.5, 2, 32]} />
                <meshStandardMaterial
                emissiveIntensity={0.2}
                emissive={"orange"}
                color="orange" />
              </mesh>
              
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
                <meshStandardMaterial
                emissiveIntensity={0.2}
                emissive={"orange"}
                color="black" />
              </mesh>
        </group>
      </RigidBody>
    );
  };

export default TrafficCone;