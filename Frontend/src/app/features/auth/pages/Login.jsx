import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { useauth } from '../hook/useauth'
import './Auth.css'

function Login() {
  const navigate = useNavigate()
  const { user, handlelogin, handlegoogleauth, handleforgotpassword, handleresetpassword, loading } = useauth()

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [newForgotPwd, setNewForgotPwd] = useState('')
  const [forgotStep, setForgotStep] = useState(1) // 1 = enter email, 2 = enter otp + reset password
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault()
    setForgotError('')
    setForgotSuccess('')
    if (!forgotEmail) {
      setForgotError('Please enter your email.')
      return
    }
    setForgotLoading(true)
    try {
      await handleforgotpassword({ email: forgotEmail })
      setForgotSuccess('OTP sent successfully to your email.')
      setForgotStep(2)
    } catch (err) {
      setForgotError(err.msg || 'Failed to send OTP.')
    } finally {
      setForgotLoading(false)
    }
  }

  const handleForgotResetSubmit = async (e) => {
    e.preventDefault()
    setForgotError('')
    setForgotSuccess('')
    if (!forgotOtp) {
      setForgotError('Please enter the 6-digit OTP.')
      return
    }
    if (!newForgotPwd) {
      setForgotError('Please enter your new password.')
      return
    }
    if (newForgotPwd.length < 8) {
      setForgotError('New password must be at least 8 characters.')
      return
    }
    setForgotLoading(true)
    try {
      await handleresetpassword({
        email: forgotEmail,
        otp: forgotOtp,
        newPassword: newForgotPwd
      })
      setForgotSuccess('Password reset successfully. You can now log in.')
      setTimeout(() => {
        setShowForgotModal(false)
        setForgotStep(1)
        setForgotEmail('')
        setForgotOtp('')
        setNewForgotPwd('')
        setForgotSuccess('')
      }, 2500)
    } catch (err) {
      setForgotError(err.msg || 'Failed to reset password.')
    } finally {
      setForgotLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      await handlelogin({ email, password })
      navigate('/')
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors[0].msg)
      } else if (err.msg) {
        setError(err.msg)
      } else {
        setError('Login failed. Please check your credentials.')
      }
    }
  }

  return (
    <div className="genz-auth-body">
      {/* Decorative Blur Background Circles */}
      <div className="auth-bg-circle bg-purple"></div>
      <div className="auth-bg-circle bg-cyan"></div>
      <div className="auth-bg-circle bg-pink"></div>

      <div className="genz-auth-card-wrapper">
        <div className="genz-auth-card">
          {/* Logo */}
          <div className="mb-6 flex justify-center w-full">
            <Logo size={42} showText={true} />
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="font-semibold text-2xl tracking-tight text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-[var(--dash-subtitle)] text-sm">
              Please enter your details to sign in
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            {/* Error Message */}
            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/15 border border-red-500/25 text-red-500 text-xs font-semibold uppercase tracking-wider text-center">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="auth-input-wrapper">
              <label className="auth-input-label">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
              />
            </div>

            {/* Password Field */}
            <div className="auth-input-wrapper relative">
              <label className="auth-input-label">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pwd-toggle-btn"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            {/* Forgot password trigger */}
            <div className="forgot-pwd-wrap">
              <button
                type="button"
                onClick={() => {
                  setForgotError('')
                  setForgotSuccess('')
                  setForgotStep(1)
                  setShowForgotModal(true)
                }}
                className="forgot-pwd-btn"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="cta-button"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="social-divider">
            <div className="social-divider-line" />
            <span className="social-divider-text">or</span>
            <div className="social-divider-line" />
          </div>

          {/* Google Sign-In */}
          <div className="google-signin-container">
            <GoogleSignInButton
              onSuccess={async (token) => {
                try {
                  const res = await handlegoogleauth(token)
                  if (res && res.success) {
                    navigate('/')
                  }
                } catch (err) {
                  console.error('Google auth failed:', err)
                }
              }}
              onError={() => {
                setError('Google sign-in failed. Please try again.')
              }}
              mode="login"
            />
          </div>

          {/* Footer Navigation */}
          <div className="text-center mt-6">
            <p className="auth-text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create one
              </Link>
            </p>
            <p className="auth-legal-text">
              © 2026 JETPACK. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[400px] p-6 relative flex flex-col gap-5">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white text-xl cursor-pointer"
            >
              &times;
            </button>

            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-white">
                Reset Password
              </h2>
              <p className="text-xs text-[var(--dash-subtitle)]">
                {forgotStep === 1
                  ? "Enter your email to request a 6-digit verification code."
                  : "Enter the code received and choose your new password."}
              </p>
            </div>

            {forgotError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-500 text-xs font-semibold text-center uppercase tracking-wider">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/20 text-green-500 text-xs font-semibold text-center uppercase tracking-wider">
                {forgotSuccess}
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotEmailSubmit} className="flex flex-col gap-4">
                <div className="auth-input-wrapper">
                  <label className="auth-input-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="cta-button w-full"
                >
                  {forgotLoading ? "SENDING CODE..." : "SEND OTP CODE"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotResetSubmit} className="flex flex-col gap-4">
                <div className="auth-input-wrapper">
                  <label className="auth-input-label">6-Digit OTP Code</label>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength="6"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    className="auth-input otp-input"
                    required
                  />
                </div>
                <div className="auth-input-wrapper">
                  <label className="auth-input-label">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newForgotPwd}
                    onChange={(e) => setNewForgotPwd(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="cta-button w-full"
                >
                  {forgotLoading ? "RESETTING..." : "RESET PASSWORD"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
