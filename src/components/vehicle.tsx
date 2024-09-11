import React from 'react'
import { CuboidCollider, RapierRigidBody, RigidBody, RigidBodyProps, useRapier } from '@react-three/rapier'
import { useControls as useLeva } from 'leva'
import { Fragment, RefObject, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {  Group,  Mesh,  Object3D, SpotLightHelper, Vector3 } from 'three'
import { LEVA_KEY } from '../constants'
import { RapierRaycastVehicle, WheelOptions } from '../lib/rapier-raycast-vehicle'

import Wheel from './Wheel'
import { Helper, SpotLight } from '@react-three/drei'
import { rotate } from 'three/webgpu'


type RaycastVehicleWheel = {
    options: WheelOptions
    object: RefObject<Object3D>
}

export type VehicleProps = RigidBodyProps

export type VehicleRef = {
    chassisRigidBody: RefObject<RapierRigidBody>
    rapierRaycastVehicle: RefObject<RapierRaycastVehicle>
    wheels: RaycastVehicleWheel[]
    setBraking: (braking: boolean) => void
}

export const Vehicle = forwardRef<VehicleRef, VehicleProps>(({ children, ...groupProps }, ref) => {
    const rapier = useRapier()
    const vehicleRef = useRef<RapierRaycastVehicle>(null!)
    const chassisRigidBodyRef = useRef<RigidBody>(null!)

    const topLeftWheelObject = useRef<Group>(null!)
    const topRightWheelObject = useRef<Group>(null!)
    const bottomLeftWheelObject = useRef<Group>(null!)
    const bottomRightWheelObject = useRef<Group>(null!)

    const {
        indexRightAxis,
        indexForwardAxis,
        indexUpAxis,
        directionLocal: directionLocalArray,
        axleLocal: axleLocalArray,
        vehicleWidth,
        vehicleHeight,
        vehicleFront,
        vehicleBack,
        ...levaWheelOptions
    } = useLeva(`${LEVA_KEY}-wheel-options`, {
        radius: 0.38,

        indexRightAxis: 2,
        indexForwardAxis: 0,
        indexUpAxis: 1,

        directionLocal: [0, -1, 0],
        axleLocal: [0, 0, 1],

        suspensionStiffness: 30,
        suspensionRestLength: 0.3,
        maxSuspensionForce: 100000,
        maxSuspensionTravel: 0.3,

        sideFrictionStiffness: 1,
        frictionSlip: 1.4,
        dampingRelaxation: 2.3,
        dampingCompression: 4.4,

        rollInfluence: 0.01,

        customSlidingRotationalSpeed: -30,
        useCustomSlidingRotationalSpeed: true,

        forwardAcceleration: 1,
        sideAcceleration: 1,

        vehicleWidth: 1.7,
        vehicleHeight: 0.1,
        vehicleFront: -1.35,
        vehicleBack: 1.3,
    })

    const directionLocal = useMemo(() => new Vector3(...directionLocalArray), [directionLocalArray])
    const axleLocal = useMemo(() => new Vector3(...axleLocalArray), [axleLocalArray])

    const commonWheelOptions = {
        ...levaWheelOptions,
        directionLocal,
        axleLocal,
    }

    const wheels: RaycastVehicleWheel[] = [
        {
            object: topLeftWheelObject,
            options: {
                ...commonWheelOptions,
                chassisConnectionPointLocal: new Vector3(vehicleBack, vehicleHeight, vehicleWidth * 0.5),
            },
        },
        {
            object: topRightWheelObject,
            options: {
                ...commonWheelOptions,
                chassisConnectionPointLocal: new Vector3(vehicleBack, vehicleHeight, vehicleWidth * -0.5),
            },
        },
        {
            object: bottomLeftWheelObject,
            options: {
                ...commonWheelOptions,
                chassisConnectionPointLocal: new Vector3(vehicleFront, vehicleHeight, vehicleWidth * 0.5),
            },
        },
        {
            object: bottomRightWheelObject,
            options: {
                ...commonWheelOptions,
                chassisConnectionPointLocal: new Vector3(vehicleFront, vehicleHeight, vehicleWidth * -0.5),
            },
        },
    ]

    useImperativeHandle(ref, () => ({
        chassisRigidBody: chassisRigidBodyRef,
        rapierRaycastVehicle: vehicleRef,
        setBraking: (braking: boolean) => {
            // const material = brakeLightsRef.current.material as MeshStandardMaterial
            // material.color = braking ? BRAKE_LIGHTS_ON_COLOR : BRAKE_LIGHTS_OFF_COLOR
        },
        wheels,
    }))

    useEffect(() => {
        vehicleRef.current = new RapierRaycastVehicle({
            world: rapier.world,
            chassisRigidBody: chassisRigidBodyRef.current,
            indexRightAxis,
            indexForwardAxis,
            indexUpAxis,
        })

        for (let i = 0; i < wheels.length; i++) {
            const options = wheels[i].options
            vehicleRef.current.addWheel(options)
        }

        vehicleRef.current = vehicleRef.current
    }, [
        chassisRigidBodyRef,
        vehicleRef,
        indexRightAxis,
        indexForwardAxis,
        indexUpAxis,
        directionLocal,
        axleLocal,
        levaWheelOptions,
    ])
    const headlightLeftRef = useRef<Mesh>();
    const headlightPositionLeft = new Vector3(2.1,0,-1)

    const headlightRightRef = useRef<Mesh>();
    const headlightPositionRight = new Vector3(2.1,0,1)
    const { debug } = useLeva(`${LEVA_KEY}-physics`, {
        debug: true,
    })
    return (
        <>
            <RigidBody ref={chassisRigidBodyRef} {...groupProps}  position={[0,0,-1]} mass={150}>
                {/* <CuboidCollider args={[2.35, 0.55, 2]} /> */}
                
                <Fragment key={0}>
                    <mesh ref={headlightLeftRef} position={headlightPositionLeft}>
                        <cylinderGeometry args={[0,0,0]} />
                    </mesh>
                    {topLeftWheelObject.current && <spotLight
                        position={[headlightPositionLeft.x-1,0,headlightPositionLeft.z]}
                        rotation={[Math.PI / 2, Math.PI / 4, 0]} // Rotation in radians
                        angle={0.8}
                        decay={1}
                        distance={20}
                        castShadow
                        penumbra={1}
                        intensity={20}
                        target={headlightLeftRef.current}

                    >
                        {debug && <Helper type={SpotLightHelper} />}
                    </spotLight>}

                    <mesh ref={headlightRightRef} position={headlightPositionRight}>
                        <cylinderGeometry args={[0,0,0]} />
                    </mesh>
                    {topLeftWheelObject.current && <spotLight
                        position={[headlightPositionRight.x-1,0,headlightPositionRight.z]}
                        rotation={[Math.PI / 2, Math.PI / 4, 0]} // Rotation in radians
                        angle={0.8}
                        decay={1}
                        distance={20}
                        castShadow
                        penumbra={1}
                        intensity={20}
                        target={headlightRightRef.current}

                    >
                        {debug && <Helper type={SpotLightHelper} />}
                    </spotLight>}
                </Fragment>
                <mesh>
                    <boxGeometry args={[2,0.5,2]} />
                    <meshPhysicalMaterial
                        color={"#fdfdfd"}
                        metalness={0.2}
                        roughness={0.3}
                        reflectivity={0.8}          // Higher reflectivity for a polished steel look
                        clearcoat={0.1}             // Adds a thin clear coating for a polished effect
                        clearcoatRoughness={0.1}    // How rough the clear coat is
                    />
                </mesh>
            </RigidBody>
            
            {/* Wheels */}
            <Wheel ref={topLeftWheelObject} side="left" radius={commonWheelOptions.radius} />
            <Wheel ref={topRightWheelObject} side="right" radius={commonWheelOptions.radius} />
            <Wheel ref={bottomLeftWheelObject} side="left" radius={commonWheelOptions.radius} />
            <Wheel ref={bottomRightWheelObject} side="right" radius={commonWheelOptions.radius} />
        </>
    )
})
