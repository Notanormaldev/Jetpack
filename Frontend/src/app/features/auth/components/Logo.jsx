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
          <linearGradient id="jet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0071E3" />
            <stop offset="100%" stopColor="#7000FF" />
          </linearGradient>
        </defs>
        
        {/* Left Jet Wing (Gradient Ribbon) */}
        <path d="M24 72 L48 20 L58 45 L34 80 Z" fill="url(#jet-grad)" />
        
        {/* Right Jet Wing (Slate Ribbon) */}
        <path d="M76 72 L52 20 L42 45 L66 80 Z" fill="#0F172A" />
        
        {/* Floating Center Core Node */}
        <circle cx="50" cy="40" r="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4.5" />
        <circle cx="50" cy="40" r="2.5" fill="#0071E3" />
        
        {/* Clean Flame Boost Paths */}
        <path d="M30 84 L30 92" stroke="#0071E3" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M70 84 L70 92" stroke="#0071E3" strokeWidth="4.5" strokeLinecap="round" />
      </svg>

      {showText && (
        <span className="logo-text font-bold tracking-[1.5px]" style={{ 
          fontSize: '19px', 
          textTransform: 'lowercase', 
          fontFamily: "'Space Grotesk', sans-serif",
          background: 'linear-gradient(to right, #0F172A 72%, #0071E3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}>
          jetpack<span style={{ color: '#0071E3', WebkitTextFillColor: '#0071E3' }}>.</span>
        </span>
      )}
    </div>
  )
}

export default Logo
