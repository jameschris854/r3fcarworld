import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import React, { Suspense } from "react";
import { LEVA_KEY, RAPIER_UPDATE_PRIORITY } from "./constants";
import { SpeedTextTunnel } from "./constants/speed-text-tunnel";
import { Leva, useControls as useLeva } from 'leva'
import usePageActive from "./hooks/usePageActive";
import InitialLoader from "./components/InitialLoader";

const App = () => {
        const Map = React.lazy(() => import('./components/Map'));
        const Car = React.lazy(() => import('./Car'));

    
        const { debug ,paused} = useLeva(`${LEVA_KEY}-physics`, {
            debug: false,
            paused: false
        })
        const tabHidden = usePageActive()
        return (
            <>
            <Suspense fallback={<InitialLoader />} >
                    <Leva hidden  />
                    <Canvas shadows >
                        <color attach="background" args={['#030303']} />
                        {Map && Car && <Physics
                            gravity={[0, -9.81, 0]}
                            updatePriority={RAPIER_UPDATE_PRIORITY}
                            timeStep="vary"
                            paused={tabHidden}
                            debug={debug}
                            >
                            <Car />
                            <Map />
                        </Physics>}
                    </Canvas>
            </Suspense>
    
                <SpeedTextTunnel.Out />
    
            </>
        )
}

export default App;