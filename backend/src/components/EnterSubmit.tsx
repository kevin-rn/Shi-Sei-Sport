'use client'

import { useEffect } from 'react'

export const EnterSubmit = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        const saveButton = document.querySelector<HTMLButtonElement>(
          'button[id="action-save"]'
        )
        saveButton?.click()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return null
}

export default EnterSubmit
