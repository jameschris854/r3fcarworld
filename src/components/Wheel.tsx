import { MeshProps } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import React, { forwardRef } from "react"
import { Group, Mesh } from "three"
type WheelProps = JSX.IntrinsicElements['group'] & {
    side: 'left' | 'right'
    radius: number
}

const Wheel = forwardRef<Group,WheelProps>(({ side, radius, ...props }: WheelProps,ref) => {

    return (
        <group ref={ref}>
            <mesh  castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[radius,radius,radius,32]}/>
                <meshStandardMaterial
                color={"#fdffdf"}
                />
            </mesh>
        </group>
    )
})

export default Wheel