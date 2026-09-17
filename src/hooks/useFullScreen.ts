import { useEffect } from 'react'

// Hook for entering fullscreen when the component mounts
const useFullScreen = () => {
  useEffect(() => {
    const enterFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enter fullscreen mode: ${err.message}`)
        })
      }
    }

    // Trigger fullscreen on mount
    enterFullScreen()
  }, [])
}

export default useFullScreen
