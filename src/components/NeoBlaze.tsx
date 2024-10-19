import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import React, { Suspense } from "react";
import { RAPIER_UPDATE_PRIORITY } from "../constants";
import InitialLoader from "./InitialLoader";
import { Leva } from "leva";
import usePageActive from "../hooks/usePageActive";

const NeoBlaze = () => {
    const Map = React.lazy(() => import('./NeoBlazeMap'));
    const Car = React.lazy(() => import('../Car'));
    const tabHidden = usePageActive()

    return (
        <>
        <Suspense fallback={<InitialLoader />} >
        <button id="reset" >Reset</button>
        <button id="brake" >Brake</button>
        <Canvas shadows>
            {/* <OrbitControls /> */}
            {Map && Car && <Physics
                gravity={[0, -9.81, 0]}
                updatePriority={RAPIER_UPDATE_PRIORITY}
                timeStep="vary"
                paused={tabHidden}
                debug={false}
            >
                <Map />
                <Car />
            </Physics>}
        </Canvas>
        <Leva hidden />
        </Suspense>
        </>
    );
  };
  
  
  export default NeoBlaze;