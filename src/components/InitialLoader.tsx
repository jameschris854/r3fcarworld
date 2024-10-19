import React, { useEffect, useState } from "react";

const InitialLoader = () => {
    const loadingText = [
        'Loading map... get your compass ready!',
        'Painting the sky... hope you like blue!',
        'Summoning the water... don’t get wet!',
        'Sprinkling a bit of magic... ✨',
        'Almost there... don’t blink!',
        'Soo close now... feel the excitement?',
        'Close your eyes... trust the process!',
        'Look away & look back... something awesome is coming!',
        'Ta-da! We made it!'
    ];

    const [count, setCount] = useState(0);
    const [fadeProp, setFadeProp] = useState({ opacity: 1 });

    useEffect(() => {
        const id = setInterval(() => {
            setFadeProp({ opacity: 0 }); // Start fade out
            setTimeout(() => {
                setCount(prev => (prev === 8 ? 0 : prev + 1)); // Switch text after fade out
                setFadeProp({ opacity: 1 }); // Fade in new text
            }, 500); // Match the transition duration
        }, 2000); // Every 2 seconds change text

        return () => clearInterval(id); // Correct cleanup
    }, []);

    return (
        <div style={{
            justifyContent: "center",
            alignItems: 'center',
            width: "100vw",
            height: '100vh',
            display: 'flex',
            background: '#ff8534' // Static background gradient
        }}>
            <div style={{
                ...fadeProp, // Apply dynamic opacity
                transition: 'opacity 0.5s ease-in-out', // Smooth fade animation for text
                color: '#ffffff', // Darker color for better readability
                fontSize: '2rem', // Larger font size
                fontWeight: 'bold', // Make the text bold
                textShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)', // Add text shadow for contrast
                textAlign:'center'
            }}>
                {loadingText[count]}
            </div>
        </div>
    );
};

export default InitialLoader;