import { useEffect, useRef } from 'react'

import { useClickAway } from '@/hooks/useClickAway'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import useSidebar from '@/store/useSidebar'

export function useSidebarComp() {
  const open = useSidebar((state) => state.open)
  const closeSidebar = useSidebar((state) => state.closeSidebar)

  // Reference to the sidebar element
  const sidebarRef = useRef<HTMLElement>(null)

  // Use media query hook to detect if viewport is below 900px
  const isMobile = useMediaQuery('(max-width: 900px)')

  // Apply the useClickAway hook but activate it only for mobile viewports
  useClickAway(sidebarRef, () => closeSidebar(), isMobile)

  // Close sidebar on mobile screens when the media query changes
  useEffect(() => {
    if (isMobile) {
      closeSidebar()
    }
  }, [isMobile, closeSidebar])

  return { open, sidebarRef }
}
