import { useEffect, useRef } from 'react'

function useFocusOnKeyPress<T extends HTMLElement>(
  key: string,
  action: (element: T | null) => void,
  shouldFocusInitially: boolean = false
) {
  const elementRef = useRef<T>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault()
        action(elementRef.current) // Perform the action on the element
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [key, action])

  // Handle initial focus if needed
  useEffect(() => {
    if (shouldFocusInitially && elementRef.current) {
      elementRef.current.focus()
    }
  }, [shouldFocusInitially])

  return elementRef
}

export default useFocusOnKeyPress
