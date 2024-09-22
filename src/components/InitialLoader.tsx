import React, { useEffect, useState } from "react";

const InitialLoader = () => {

    const loadingText =  [
        'Loading map... get your compass ready!',
        'Revving up the engine... almost there!',
        'Painting the sky... hope you like blue!',
        'Summoning the water... don’t get wet!',
        'Sprinkling a bit of magic... ✨',
        'Almost there... don’t blink!',
        'Soo close now... feel the excitement?',
        'Close your eyes... trust the process!',
        'Look away & look back... something awesome is coming!',
        'Ta-da! We made it!'
    ]
    const [count,setCount] = useState(0)

    useEffect(() => {
        const id = setInterval(() => {
            setCount(prev => (prev === 9 ? 0 : prev + 1));
        }, 200);
    
        return () => clearInterval(id); // Correct cleanup
    },[])

    return <div style={{justifyContent:"center",alignItems:'center',width:"100vw",height:'100vh',display:'flex'}}>{loadingText[count]}</div>
}

export default InitialLoader;