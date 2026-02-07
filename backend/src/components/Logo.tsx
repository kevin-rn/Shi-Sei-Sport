import React from 'react'
import '../styles/admin.css' 

const Logo = () => {
  return (
    <div className="brand-logo">
      <img
        src="/shi-sei-logo.png"
        alt="Shi-Sei Sport"
        className="brand-logo__image"
      />
      <div className="brand-logo__text">
        <span className="brand-logo__title">
          Shi-Sei Sport
        </span>
        <span className="brand-logo__subtitle">
          Judovereniging - Beheer
        </span>
      </div>
    </div>
  )
}

export default Logo