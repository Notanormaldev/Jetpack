import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#FAFAFA',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, sans-serif",
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        {/* Logo */}
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="jet-grad-404" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0071E3" />
              <stop offset="100%" stopColor="#7000FF" />
            </linearGradient>
          </defs>
          <path d="M24 72 L48 20 L58 45 L34 80 Z" fill="url(#jet-grad-404)" />
          <path d="M76 72 L52 20 L42 45 L66 80 Z" fill="#0F172A" />
          <circle cx="50" cy="40" r="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4.5" />
          <circle cx="50" cy="40" r="2.5" fill="#0071E3" />
          <path d="M30 84 L30 92" stroke="#0071E3" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M70 84 L70 92" stroke="#0071E3" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
        <span style={{
          fontSize: '19px',
          fontWeight: '700',
          fontFamily: "'Space Grotesk', sans-serif",
          background: 'linear-gradient(to right, #0F172A 72%, #0071E3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>jetpack.</span>
      </div>
      <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#0F172A', margin: 0 }}>404</h1>
      <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>Page not found</p>
      <Link to="/login" style={{
        marginTop: '8px',
        padding: '10px 24px',
        background: '#0071E3',
        color: '#fff',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
      }}>
        Go to Login
      </Link>
    </div>
  )
}

export default NotFound
