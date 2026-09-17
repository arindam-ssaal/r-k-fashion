'use client'

import { useEffect, useState } from 'react'

export default function SessionExpiredModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)

    window.addEventListener('session-expired', handler)

    return () => {
      window.removeEventListener('session-expired', handler)
    }
  }, [])

  if (!open) return null

  return (
    <div>
      {/* modal */}
    </div>
  )
}