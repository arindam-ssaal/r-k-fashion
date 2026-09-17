import { useEffect } from 'react'

// Custom Hook to detect clicks outside a ref element
export function useClickAway(
  ref: React.RefObject<HTMLElement>,
  onClickAway: () => void,
  active?: boolean // Add an 'active' flag to conditionally enable/disable
) {
  useEffect(() => {
    if (!active) return // Skip adding the event listener if not active

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway()
      }
    }

    // Add the event listener if active
    document.addEventListener('mousedown', handleClickOutside)

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onClickAway, active]) // Add 'active' to the dependency array
}
