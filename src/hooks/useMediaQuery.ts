import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    mediaQuery.addEventListener('change', handleMediaChange)

    // Check initial value
    setMatches(mediaQuery.matches)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange)
    }
  }, [query])

  return matches
}
