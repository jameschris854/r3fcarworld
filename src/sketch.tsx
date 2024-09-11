import { Environment, Float, OrbitControls, Stars, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Physics, RigidBody, useBeforePhysicsStep } from '@react-three/rapier'
import { Leva, useControls as useLeva } from 'leva'
import React, { useRef } from 'react'
import styled from 'styled-components'
import { Fog, Quaternion, Vector3 } from 'three'
import { Vehicle, VehicleRef } from './components/vehicle'
import { AFTER_RAPIER_UPDATE, LEVA_KEY, RAPIER_UPDATE_PRIORITY } from './constants'
import { SpeedTextTunnel } from './constants/speed-text-tunnel'
import { useControls } from './hooks/use-controls'
import { useLoadingAssets } from './hooks/use-loading-assets'
import Lamps from './components/Lamps'
import TrafficCone from './components/TrafficCone'
const Text = styled.div`
    text-align: center;
    font-size: 2em;
    color: white;
    font-family: monospace;
    text-shadow: 2px 2px black;
`

const SpeedText = styled(Text)`
    position: absolute;
    bottom: 3em;
    left: 2em;
`
useGLTF.preload('/pg.glb');

const cameraIdealOffset = new Vector3()
const cameraIdealLookAt = new Vector3()
const chassisTranslation = new Vector3()
const chassisRotation = new Quaternion()

const Game = () => {
    const raycastVehicle = useRef<VehicleRef>(null)
    const currentSpeedTextDiv = useRef<HTMLDivElement>(null)

    const camera = useThree((state) => state.camera)
    const currentCameraPosition = useRef(new Vector3(15, 15, 0))
    const currentCameraLookAt = useRef(new Vector3())

    const controls = useControls()

    const { cameraMode } = useLeva(`${LEVA_KEY}-camera`, {
        cameraMode: {
            value: 'drive',
            options: ['drive', 'orbit'],
        },
    })

    const { maxForce, maxSteer, maxBrake } = useLeva(`${LEVA_KEY}-controls`, {
        maxForce: 5,
        maxSteer: 10,
        maxBrake: 0.1,
    })

    useBeforePhysicsStep((world) => {
        if (!raycastVehicle.current || !raycastVehicle.current.rapierRaycastVehicle.current) {
            return
        }

        const {
            wheels,
            rapierRaycastVehicle: { current: vehicle },
            setBraking,
        } = raycastVehicle.current

        // update wheels from controls
        let engineForce = 0
        let steering = 0

        if (controls.current.forward) {
            engineForce += maxForce
        }
        if (controls.current.backward) {
            engineForce -= maxForce
        }

        if (controls.current.left) {
            steering += maxSteer
        }
        if (controls.current.right) {
            steering -= maxSteer
        }

        const brakeForce = controls.current.brake ? maxBrake : 0

        for (let i = 0; i < vehicle.wheels.length; i++) {
            vehicle.setBrakeValue(brakeForce, i)
        }

        // steer front wheels
        vehicle.setSteeringValue(steering, 0)
        vehicle.setSteeringValue(steering, 1)

        // apply engine force to back wheels
        vehicle.applyEngineForce(engineForce, 2)
        vehicle.applyEngineForce(engineForce, 3)

        // update the vehicle
        vehicle.update(world.timestep)

        // update the wheels
        for (let i = 0; i < vehicle.wheels.length; i++) {
            const wheelObject = wheels[i].object.current
            if (!wheelObject) continue

            const wheelState = vehicle.wheels[i].state
            wheelObject.position.copy(wheelState.worldTransform.position)
            wheelObject.quaternion.copy(wheelState.worldTransform.quaternion)
        }

        // update speed text
        if (currentSpeedTextDiv.current) {
            const km = Math.abs(vehicle.state.currentVehicleSpeedKmHour).toFixed()
            currentSpeedTextDiv.current.innerText = `${km} km/h`
        }

        // update brake lights
        setBraking(brakeForce > 0)
    })

    useFrame((_, delta) => {
        if (cameraMode !== 'drive') return

        const chassis = raycastVehicle.current?.chassisRigidBody
        if (!chassis?.current) return

        chassisRotation.copy(chassis.current.rotation() as Quaternion)
        chassisTranslation.copy(chassis.current.translation() as Vector3)

        const t = 1.0 - Math.pow(0.01, delta)

        cameraIdealOffset.set(-10, 3, 0)
        cameraIdealOffset.applyQuaternion(chassisRotation)
        cameraIdealOffset.add(chassisTranslation)

        if (cameraIdealOffset.y < 0) {
            cameraIdealOffset.y = 0.5
        }

        cameraIdealLookAt.set(0, 1, 0)
        cameraIdealLookAt.applyQuaternion(chassisRotation)
        cameraIdealLookAt.add(chassisTranslation)

        currentCameraPosition.current.lerp(cameraIdealOffset, t)
        currentCameraLookAt.current.lerp(cameraIdealLookAt, t)

        camera.position.copy(currentCameraPosition.current)
        camera.lookAt(currentCameraLookAt.current)
    }, AFTER_RAPIER_UPDATE)

    return (
        <>
            <SpeedTextTunnel.In>
                <SpeedText ref={currentSpeedTextDiv} />
            </SpeedTextTunnel.In>
            {/* raycast vehicle */}
            <Vehicle ref={raycastVehicle} position={[0, 5, 0]} rotation={[0, -Math.PI / 2, 0]} />
            {/* <Fog attach="fog" args={['white', 10, 50]} />; // Color and range for fog effect */}
            <hemisphereLight intensity={0.1} />
            {/* <ambientLight intensity={0.1} /> */}
            {/* <Environment preset="sunset" /> */}
            <Stars fade  factor={0} saturation={0}  count={500}/>
            {cameraMode === 'orbit' && <OrbitControls />}
        </>
    )
}



export function Sketch() {
    const loading = useLoadingAssets()


    const { debug ,paused} = useLeva(`${LEVA_KEY}-physics`, {
        debug: false,
        paused: false
    })

    return (
        <>
            <Canvas camera={{ fov: 60, position: [0, 30, -20] }} shadows>
                <color attach="background" args={['#030303']} />
                <Leva hidden />
                <Physics
                    gravity={[0, -9.81, 0]}
                    updatePriority={RAPIER_UPDATE_PRIORITY}
                    timeStep="vary"
                    paused={loading || paused}
                    debug={debug}
                >
                    <Game />
                    <Ground />
                </Physics>
            </Canvas>

            <SpeedTextTunnel.Out />

        </>
    )
}

const Ground = () => {
    const { nodes ,materials} = useGLTF('/pg.glb');
    console.log(nodes,materials)
    return (
        <>
            <RigidBody type="fixed" colliders={"trimesh"}>
                <primitive scale={[1,1,1]} position={[0,-10,0]} object={nodes.Plane}/>
            </RigidBody>
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
            <Float speed={1}>
                <mesh position={[24.5,-10,-20]} castShadow receiveShadow>
                    <sphereGeometry args={[1.5,20,30]} />
                    <meshStandardMaterial
                        color="aqua"        // Base color of the material
                        emissive="aqua"
                        emissiveIntensity={1}  // Intensity of the emissive effect
                    />
                    <pointLight
                        position={[0, 0, 0]}  // Position (same as the sphere)
                        intensity={30}       // Brightness of the light
                        distance={10}         // How far the light reaches
                        color="aqua"        // Light color (matching the emissive glow)
                    />
                </mesh>
            </Float>
        </>
    );
  };
