import { useFrame, useThree } from '@react-three/fiber'
import { Physics, RigidBody, useBeforePhysicsStep } from '@react-three/rapier'
import { Leva, useControls as useLeva } from 'leva'
import React, { Suspense, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { DirectionalLightHelper, Fog, Mesh, Quaternion, TextureLoader, Vector3 } from 'three'
import { Vehicle, VehicleRef } from './components/vehicle'
import { AFTER_RAPIER_UPDATE, LEVA_KEY, RAPIER_UPDATE_PRIORITY } from './constants'
import { SpeedTextTunnel } from './constants/speed-text-tunnel'
import { useControls } from './hooks/use-controls'
import commonStore from './stores/commonStore'

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

const cameraIdealOffset = new Vector3()
const cameraIdealLookAt = new Vector3()
const chassisTranslation = new Vector3()
const chassisRotation = new Quaternion()

const Car = () => {
    const raycastVehicle = useRef<VehicleRef>(null)
    const currentSpeedTextDiv = useRef<HTMLDivElement>(null)
    const camera = useThree((state) => state.camera)
    const currentCameraPosition = useRef(new Vector3(15, 15, 0))
    const currentCameraLookAt = useRef(new Vector3())
    const controls = useControls()

    const { camera: currentCam  }= commonStore();

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
        if(controls.current.reset){
            raycastVehicle.current?.reset();
            return;
        }
        if (currentCam === 'followCamClose'){

            const chassis = raycastVehicle.current?.chassisRigidBody
            if (!chassis?.current) return
    
            chassisRotation.copy(chassis.current.rotation() as Quaternion)
            chassisTranslation.copy(chassis.current.translation() as Vector3)
    
            const t = 1.0 - Math.pow(0.01, delta)
    
            cameraIdealOffset.set(-15, 0, 0)
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
        }
    }, AFTER_RAPIER_UPDATE)

    return (
        <>
            <SpeedTextTunnel.In>
                <SpeedText ref={currentSpeedTextDiv} />
            </SpeedTextTunnel.In>
            <Vehicle ref={raycastVehicle} position={[0, 5, 0]} rotation={[0, -Math.PI / 2, 0]} />
            <hemisphereLight intensity={0.1} />
        </>
    )
}

export default Car;