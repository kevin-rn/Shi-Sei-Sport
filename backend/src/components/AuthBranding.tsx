'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import '../styles/admin.css'

const AuthBranding = () => {
  const pathname = usePathname()

  // Only show on forgot/reset pages — login already renders the Logo via its own brand div
  const showBranding = pathname?.includes('/forgot') || pathname?.includes('/reset')

  if (!showBranding) return null

  return (
    <div className="auth-branding">
      <img
        src="/shi-sei-logo.png"
        alt="Shi-Sei Sport"
        className="auth-branding__image"
      />
      <div className="auth-branding__text">
        <span className="auth-branding__title">Shi-Sei Sport</span>
        <span className="auth-branding__subtitle">Judovereniging - Beheer</span>
      </div>
    </div>
  )
}

export default AuthBranding
