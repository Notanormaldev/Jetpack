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
        <defs>
          <linearGradient id="jetpack-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0071E3" />
            <stop offset="100%" stopColor="#7000FF" />
          </linearGradient>
        </defs>
        
        {/* Parallel Booster Cylinders with Gradient & Bold Stroke */}
        <rect x="23" y="20" width="18" height="46" rx="9" fill="url(#jetpack-gradient)" stroke="#0F172A" strokeWidth="4" />
        <rect x="59" y="20" width="18" height="46" rx="9" fill="url(#jetpack-gradient)" stroke="#0F172A" strokeWidth="4" />
        
        {/* Center Control Core */}
        <rect x="38" y="15" width="24" height="30" rx="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
        
        {/* Core Power Node */}
        <circle cx="50" cy="30" r="3.5" fill="#0071E3" />
        
        {/* Connector Bridge */}
        <path d="M41 36 H59" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
        
        {/* Minimalist Launch Flame Trails */}
        <path d="M32 72 V86" stroke="#0071E3" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M68 72 V86" stroke="#0071E3" strokeWidth="4.5" strokeLinecap="round" />
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
