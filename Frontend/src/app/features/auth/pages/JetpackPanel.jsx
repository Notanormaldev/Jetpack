import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useauth } from '../hook/useauth'
import Logo from '../components/Logo'
import { FiLogOut, FiTrash2, FiUser, FiCode, FiAward, FiInfo } from 'react-icons/fi'
import './JetpackPanel.css'

function JetpackPanel() {
  const navigate = useNavigate()
  const { user, handlelogout, handledeleteaccount, loading } = useauth()
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // If user is not logged in, redirect to login page
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  const onLogout = async () => {
    try {
      await handlelogout()
      navigate('/login')
    } catch (err) {
      setErrorMsg(err.msg || 'Failed to logout.')
    }
  }

  const onDeleteAccount = async () => {
    try {
      await handledeleteaccount()
      navigate('/login')
    } catch (err) {
      setErrorMsg(err.msg || 'Failed to delete account.')
      setShowConfirmDelete(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="jetpack-loader-container">
        <div className="ios-spinner"></div>
      </div>
    )
  }

  return (
    <div className="jetpack-panel-root">
      <div className="jetpack-panel-container">
        {/* Header Section */}
        <header className="jetpack-header">
          <Logo size={42} showText={true} />
          <div className="ios-badge">v1.0.0 Stable</div>
        </header>

        {errorMsg && (
          <div className="ios-alert-banner">
            <span className="alert-text">{errorMsg}</span>
            <button className="alert-close" onClick={() => setErrorMsg('')}>&times;</button>
          </div>
        )}

        <main className="jetpack-main-grid">
          {/* Left Panel: Profile Info */}
          <section className="jetpack-card profile-card">
            <div className="card-header">
              <FiUser className="header-icon" />
              <h3>Session Profile</h3>
            </div>
            
            <div className="profile-details">
              <div className="avatar-wrapper">
                {user.profilepic ? (
                  <img src={user.profilepic} alt={user.fullname} className="avatar-img" />
                ) : (
                  <div className="avatar-fallback">{user.fullname?.charAt(0).toUpperCase()}</div>
                )}
                <div className="status-indicator online"></div>
              </div>

              <div className="profile-info-text">
                <h2 className="user-fullname">{user.fullname}</h2>
                <p className="user-email">{user.email}</p>
                <div className="role-chip uppercase">{user.role || 'buyer'}</div>
              </div>
            </div>

            <div className="profile-meta-grid">
              <div className="meta-item">
                <span className="meta-label">Status</span>
                <span className="meta-val active">Verified</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Connected</span>
                <span className="meta-val">{user.googleid ? 'Google OAuth' : 'Local Email'}</span>
              </div>
            </div>
          </section>

          {/* Right Panel: Project Details & Hackathon Note */}
          <section className="jetpack-card project-card">
            <div className="card-header">
              <FiCode className="header-icon" />
              <h3>Project Information</h3>
            </div>

            <div className="project-detail-list">
              <div className="project-detail-item">
                <div className="item-icon-box">
                  <FiAward />
                </div>
                <div className="item-text">
                  <h4>Developer & Owner</h4>
                  <p>
                    <a 
                      href="https://github.com/Notanormaldev" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="owner-link"
                    >
                      Harsh Patel (Notanormaldev)
                    </a>
                  </p>
                </div>
              </div>

              <div className="project-detail-item">
                <div className="item-icon-box">
                  <FiInfo />
                </div>
                <div className="item-text">
                  <h4>Why Jetpack was built</h4>
                  <p className="project-description">
                    Jetpack was built for a hackathon as an out-of-the-box, production-grade authentication boilerplate. 
                    It saves setup time by packaging robust MongoDB schema integration, JWT-based cookie security, 
                    Redis-backed session token blacklisting, and a clean interface, so developers can focus 
                    solely on coding their unique hackathon features.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Action Buttons Footer */}
        <footer className="jetpack-actions-footer">
          <button className="ios-btn ios-btn-secondary" onClick={onLogout}>
            <FiLogOut className="btn-icon" />
            <span>Sign Out</span>
          </button>
          
          <button className="ios-btn ios-btn-danger" onClick={() => setShowConfirmDelete(true)}>
            <FiTrash2 className="btn-icon" />
            <span>Delete Account</span>
          </button>
        </footer>
      </div>

      {/* iPhone-like Glassmorphic Confirmation Modal */}
      {showConfirmDelete && (
        <div className="ios-modal-overlay">
          <div className="ios-confirm-dialog">
            <div className="dialog-content">
              <h4 className="dialog-title">Delete Account?</h4>
              <p className="dialog-message">
                Are you sure you want to delete your account? This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="dialog-actions">
              <button className="dialog-btn cancel" onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </button>
              <button className="dialog-btn confirm-danger" onClick={onDeleteAccount}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JetpackPanel
