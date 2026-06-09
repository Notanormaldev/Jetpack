import React from 'react'

function Logo({ size = 28, showText = true }) {
  return (
    <div className="flex items-center gap-2.5 select-none logo-container">
      {/* Sleek Minimalist Jetpack SVG Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-icon-svg"
      >
        {/* Engine Flames (Apple Blue Boosters) */}
        <path
          d="M31 68 L31 82 L27 75 Z"
          fill="#0071E3"
        />
        <path
          d="M69 68 L69 82 L65 75 Z"
          fill="#0071E3"
        />
        
        {/* Jetpack Cylinders (L & R) */}
        <rect x="22" y="26" width="18" height="42" rx="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
        <rect x="60" y="26" width="18" height="42" rx="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
        
        {/* Center Harness Bridge */}
        <rect x="38" y="20" width="24" height="35" rx="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
        
        {/* Connection Tubes */}
        <path d="M40 38 H60" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
        
        {/* Core Power Node */}
        <circle cx="50" cy="38" r="4.5" fill="#0071E3" />
      </svg>

      {showText && (
        <span className="logo-text font-bold tracking-[1.5px] text-[var(--ios-text)]" style={{ fontSize: '19px', textTransform: 'lowercase', fontFamily: "'Space Grotesk', sans-serif" }}>
          jetpack<span style={{ color: '#0071E3' }}>.</span>
        </span>
      )}
    </div>
  )
}

export default Logo
