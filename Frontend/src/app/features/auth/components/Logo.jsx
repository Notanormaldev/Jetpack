import React from 'react'

function Logo({ size = 28, showText = true }) {
  return (
    <div className="flex items-center gap-2.5 select-none logo-container">
      {/* Sleek iPhone-style Jetpack SVG Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-icon-svg"
      >
        <defs>
          {/* Cyber-Cyan/Violet Gradient for Jetpack Boosters */}
          <linearGradient id="jetpack-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="50%" stopColor="#7000FF" />
            <stop offset="100%" stopColor="#FF007A" />
          </linearGradient>
          {/* Sleek Glass White Gradient with Icy Tint */}
          <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
            <stop offset="100%" stopColor="rgba(224, 242, 254, 0.5)" />
          </linearGradient>
          {/* Dark theme shadow */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Back Flame Glow */}
        <path
          d="M35 72 L31 88 L38 80 Z"
          fill="url(#jetpack-glow)"
          opacity="0.95"
        />
        <path
          d="M65 72 L69 88 L62 80 Z"
          fill="url(#jetpack-glow)"
          opacity="0.95"
        />
        
        {/* Jetpack Outer Thruster Bodies (L & R) */}
        <rect x="25" y="28" width="16" height="42" rx="8" fill="url(#glass-grad)" stroke="rgba(15, 23, 42, 0.12)" strokeWidth="1.5" />
        <rect x="59" y="28" width="16" height="42" rx="8" fill="url(#glass-grad)" stroke="rgba(15, 23, 42, 0.12)" strokeWidth="1.5" />
        
        {/* Jetpack Center Body Harness */}
        <rect x="39" y="23" width="22" height="37" rx="5" fill="rgba(15, 23, 42, 0.03)" stroke="rgba(15, 23, 42, 0.1)" strokeWidth="1.2" />
        
        {/* Connecting Tubes */}
        <path d="M41 41 H59" stroke="rgba(15, 23, 42, 0.18)" strokeWidth="2" />
        
        {/* Core Power Node */}
        <circle cx="50" cy="41" r="5" fill="#00F0FF" filter="url(#glow)" />
      </svg>

      {showText && (
        <span className="logo-text font-bold tracking-[1.5px] text-[var(--ios-text)]" style={{ fontSize: '18px', textTransform: 'lowercase', fontFamily: "'Space Grotesk', sans-serif" }}>
          jetpack<span style={{ color: '#0071E3' }}>.</span>
        </span>
      )}
    </div>
  )
}

export default Logo
