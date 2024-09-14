import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import React, { Suspense } from "react";
import { LEVA_KEY, RAPIER_UPDATE_PRIORITY } from "./constants";
import { SpeedTextTunnel } from "./constants/speed-text-tunnel";
import { useLoadingAssets } from "./hooks/use-loading-assets";
import { Leva, useControls as useLeva } from 'leva'
import Car from "./Car";

const App = () => {
        const loading = useLoadingAssets()
        // const Car = React.lazy(() => import('./Car'));
        const Map = React.lazy(() => import('./components/Map'));
    
    
        const { debug ,paused} = useLeva(`${LEVA_KEY}-physics`, {
            debug: false,
            paused: false
        })
    
        return (
            <>
            <Suspense>
                    <Leva hidden />
                    <Canvas camera={{ fov: 60, position: [-90, 40, -0] }} shadows>
                        <color attach="background" args={['#030303']} />
                        <Physics
                            gravity={[0, -9.81, 0]}
                            updatePriority={RAPIER_UPDATE_PRIORITY}
                            timeStep="vary"
                            paused={loading || paused}
                            debug={debug}
                        >
                            <Car />
                            <Map />
                        </Physics>
                    </Canvas>
            </Suspense>
    
                <SpeedTextTunnel.Out />
    
            </>
        )
}

export default App;