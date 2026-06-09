import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { useauth } from '../hook/useauth'
import './Auth.css'

function Register() {
  const navigate = useNavigate()
  const { user, handleregister, handlegoogleauth, handleverifyotp, loading } = useauth()

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  // Step 1: Registration form
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Step 2: OTP verification
  const [step, setStep] = useState(1) // 1 = register form, 2 = OTP screen
  const [otp, setOtp] = useState('')
  const [otpEmail, setOtpEmail] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [resendLoading, setResendLoading] = useState(false)

  // Resend timer effect
  useEffect(() => {
    let interval
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Client-side validations
    if (!fullName) {
      setError('Full Name is required.')
      return
    }
    if (fullName.trim().length < 3) {
      setError('Full Name must be at least 3 characters.')
      return
    }
    if (!email) {
      setError('Email address is required.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password) {
      setError('Password is required.')
      return
    }
    // Simple 8-char validation (can be customized by users of this boilerplate)
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    try {
      const res = await handleregister({
        email,
        fullname: fullName,
        password,
        isseller: false
      })
      if (res && res.requiresOtp) {
        setOtpEmail(email)
        setStep(2)
        setResendTimer(30)
      }
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors[0].msg)
      } else if (err.msg) {
        setError(err.msg)
      } else {
        setError('Registration failed. Please try again.')
      }
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!otp) {
      setError('OTP is required.')
      return
    }
    if (otp.length !== 6) {
      setError('OTP must be 6 digits.')
      return
    }

    try {
      await handleverifyotp({
        email: otpEmail,
        otp
      })
      navigate('/')
    } catch (err) {
      if (err.msg === 'OTP expired') {
        setError('OTP expired, please register again')
      } else if (err.msg === 'Account already verified') {
        setError('Account already exists, please login')
      } else if (err.msg === 'Invalid OTP') {
        setError('Invalid OTP, please try again')
      } else if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors[0].msg)
      } else if (err.msg) {
        setError(err.msg)
      } else {
        setError('Something went wrong, please try again')
      }
    }
  }

  const handleResendOtp = async () => {
    setError('')
    setResendLoading(true)

    try {
      const res = await handleregister({
        email: otpEmail,
        fullname: fullName,
        password,
        isseller: false
      })
      if (res && res.requiresOtp) {
        setResendTimer(30)
      }
    } catch (err) {
      if (err.msg) {
        setError(err.msg)
      } else {
        setError('Failed to resend OTP, please try again.')
      }
    } finally {
      setResendLoading(false)
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

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="font-semibold text-2xl tracking-tight text-white mb-2">
              {step === 1 ? 'Create Account' : 'Verify Email'}
            </h1>
            <p className="text-[var(--dash-subtitle)] text-sm">
              {step === 1 
                ? 'Enter your details to register a new account' 
                : `We sent a 6-digit code to ${otpEmail}`}
            </p>
          </div>

          {step === 1 ? (
            <>
              {/* STEP 1: Registration Form */}
              <form onSubmit={handleRegisterSubmit} className="w-full flex flex-col">
                {/* Error Message */}
                {error && (
                  <div className="p-3 mb-4 rounded-xl bg-red-500/15 border border-red-500/25 text-red-500 text-xs font-semibold uppercase tracking-wider text-center">
                    {error}
                  </div>
                )}

                {/* Full Name */}
                <div className="auth-input-wrapper">
                  <label className="auth-input-label">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>

                {/* Email Address */}
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

                {/* Password */}
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

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="cta-button"
                >
                  {loading ? 'Creating...' : 'Register'}
                </button>
              </form>

              {/* Divider */}
              <div className="social-divider">
                <div className="social-divider-line" />
                <span className="social-divider-text">or</span>
                <div className="social-divider-line" />
              </div>

              {/* Google Sign-Up */}
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
                    setError('Google sign-up failed. Please try again.')
                  }}
                  mode="signup"
                />
              </div>
            </>
          ) : (
            <>
              {/* STEP 2: OTP Verification Form */}
              <form onSubmit={handleOtpSubmit} className="w-full flex flex-col">
                {/* Error Message */}
                {error && (
                  <div className="p-3 mb-4 rounded-xl bg-red-500/15 border border-red-500/25 text-red-500 text-xs font-semibold uppercase tracking-wider text-center">
                    {error}
                  </div>
                )}

                {/* OTP Input */}
                <div className="auth-input-wrapper">
                  <label className="auth-input-label">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="auth-input otp-input"
                    required
                  />
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="cta-button"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>

              {/* Resend Section */}
              <div className="social-divider">
                <div className="social-divider-line" />
                <span className="social-divider-text">resend code</span>
                <div className="social-divider-line" />
              </div>

              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || resendLoading}
                className="resend-otp-button"
              >
                {resendTimer > 0 ? (
                  <>Resend OTP in <span className="ml-1 font-bold">{resendTimer}s</span></>
                ) : (
                  resendLoading ? 'Sending...' : 'Resend OTP Code'
                )}
              </button>
            </>
          )}

          {/* Footer Navigation */}
          <div className="text-center mt-6">
            {step === 1 && (
              <p className="auth-text-muted">
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Log in
                </Link>
              </p>
            )}
            <p className="auth-legal-text">
              © 2026 JETPACK. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
