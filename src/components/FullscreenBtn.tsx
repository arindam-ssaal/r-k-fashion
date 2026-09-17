import { Expand, Minimize2 } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Button } from './ui/button'

function FullscreenBtn() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen mode
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error(`Error attempting to enable fullscreen mode: ${err.message}`))
    } else {
      // Exit fullscreen mode
      if (document.fullscreenElement) {
        document
          .exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch((err) => console.error(`Error attempting to exit fullscreen mode: ${err.message}`))
      }
    }
  }

  // Listen for fullscreen changes (e.g., pressing Esc to exit fullscreen)
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Check if the document is in fullscreen mode or not
      if (document.fullscreenElement) {
        setIsFullscreen(true)
      } else {
        setIsFullscreen(false)
      }
    }

    // Attach event listener for fullscreen change
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <Button size="icon" variant="ghost" className="mr-2 cursor-pointer" onClick={toggleFullscreen}>
      {isFullscreen ? (
        <Minimize2 size={14} strokeWidth={2} absoluteStrokeWidth />
      ) : (
        <Expand size={14} strokeWidth={2} absoluteStrokeWidth />
      )}
    </Button>
  )
}

export default FullscreenBtn
