import React, { useEffect, useState } from "react";

const usePageActive = () => {
  const [tabHidden,setTabHidden] = useState(false)

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                setTabHidden(true)
              } else {
                setTabHidden(false)
              }
        }
    
        // Add event listener to monitor when the tab becomes visible or hidden
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return tabHidden
}

export default usePageActive;