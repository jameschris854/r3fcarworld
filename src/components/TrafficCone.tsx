import React from "react";

const TrafficCone = ({position}) => {
    return (
      <group position={position}>
        <mesh position={[0, 1, 0]}>
              <cylinderGeometry args={[0.2, 0.5, 2, 32]} />
              <meshStandardMaterial
              emissiveIntensity={0.2}
              emissive={"orange"}
              color="orange" />
            </mesh>
            
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
              <meshStandardMaterial
              emissiveIntensity={0.2}
              emissive={"orange"}
              color="black" />
            </mesh>
      </group>
    );
  };

export default TrafficCone;