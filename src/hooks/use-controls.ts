import JoystickController from 'joystick-controller'
import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'

const keyControlMap = {
    ArrowDown: 'backward',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'forward',
    a: 'left',
    d: 'right',
    s: 'backward',
    w: 'forward',
    A: 'left',
    D: 'right',
    S: 'backward',
    W: 'forward',
    ' ': 'brake',
    r: 'reset'
} as const

type KeyCode = keyof typeof keyControlMap
type GameControl = (typeof keyControlMap)[KeyCode]

const keyCodes = Object.keys(keyControlMap) as KeyCode[]
const isKeyCode = (v: unknown): v is KeyCode => keyCodes.includes(v as KeyCode)

export type Controls = Record<GameControl, boolean>

const useKeyControls = ({ current }: MutableRefObject<Controls>, map: Record<KeyCode, GameControl>) => {
    useEffect(() => {
        const handleKeydown = ({ key }: KeyboardEvent) => {
            if (!isKeyCode(key)) return
            current[map[key]] = true
        }
        window.addEventListener('keydown', handleKeydown)

        const handleKeyup = ({ key }: KeyboardEvent) => {
            if (!isKeyCode(key)) return
            current[map[key]] = false
        }
        window.addEventListener('keyup', handleKeyup)

        const resetBtn = document.getElementById("reset")
        resetBtn?.addEventListener('touchend', () => {
            handleKeydown({key:"r"})
        })    
        resetBtn?.addEventListener('mousedown', () => {
            handleKeydown({key:"r"})
        })    
        resetBtn?.addEventListener('mouseup', () => {
            handleKeyup({key:"r"});
        })
        resetBtn?.addEventListener('touchend', () => {
            handleKeyup({key:"r"});
        }) 

        const brakeBtn = document.getElementById("brake")
        brakeBtn?.addEventListener('touchend', () => {
            handleKeydown({key:" "})
        })    
        brakeBtn?.addEventListener('mousedown', () => {
            handleKeydown({key:" "})
        })    
        brakeBtn?.addEventListener('mouseup', () => {
            handleKeyup({key:" "});
        })
        brakeBtn?.addEventListener('touchend', () => {
            handleKeyup({key:" "});
        }) 

        const joystick = new JoystickController({
            containerClass: "joystick-container",
            controllerClass: "joystick-controller",
            joystickClass: "joystick",
        }, (data) => {
            if(data.y > 50) {
                handleKeydown({key:"w"})
            }else{
                handleKeyup({key:"w"})
            }         
            if(data.y < -50){
                handleKeydown({key:"s"})
            }else{
                handleKeyup({key:"s"})
            }
            if(data.x > 50){
                handleKeydown({key:"d"})
            }else{
                handleKeyup({key:"d"})
            }
            if(data.x < -50){
                handleKeydown({key:"a"})
            }else{
                handleKeyup({key:"a"})
            }
        });
        return () => {
            window.removeEventListener('keydown', handleKeydown)
            window.removeEventListener('keyup', handleKeyup)
            window.removeEventListener('keyup', handleKeyup)
            // resetBtn?.removeEventListener("keydown")
            joystick.destroy();
        }
    }, [current, map])
}

export const useControls = () => {
    const controls = useRef<Controls>({
        backward: false,
        forward: false,
        left: false,
        right: false,
        brake: false,
        reset: false
    })

    useKeyControls(controls, keyControlMap)

    return controls
}
