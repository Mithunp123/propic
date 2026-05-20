import { useState } from 'react'
import { Link } from 'react-router-dom'
import MarqueeBar from './MarqueeBar'

function Icon({ path, viewBox = '0 0 24 24' }) {
  return (
    <svg viewBox={viewBox} fill="none" aria-hidden="true" focusable="false" className="svg-icon">
      <path d={path} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICONS = {
  facebook: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z',
  instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M16 11.4a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M17.5 6.5h.01',
  linkedin: 'M16 8a6 6 0 0 1 6 6v8h-4v-8a2 2 0 0 0-4 0v8h-4V9h4v2 M2 9h4v13H2z M4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  youtube: 'M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.7 12 4.7 12 4.7s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2A29.7 29.7 0 0 0 1 12a29.7 29.7 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2A29.7 29.7 0 0 0 23 12a29.7 29.7 0 0 0-.5-4.8z M10 15.5v-7l6 3.5-6 3.5z',
  arrowRight: 'M5 12h14 M12 5l7 7-7 7'
}

function Footer() {
  const [email, setEmail] = useState('')
  const [emailActive, setEmailActive] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  return (
    <div className="footer-wrapper">
      {/* 1. Infinite Marquee ticker bar */}
      <MarqueeBar />

      {/* 2. Main Premium Footer */}
      <footer className="new-footer">
        <div className="new-footer-container">
          
          {/* Column 1: Brand details & Socialize */}
          <div className="footer-brand-column">
            <div className="footer-brand-logo-wrap">
              <img className="footer-ge-logo" src="/brand/ge-logo.png" alt="Gaayathri Enterprises logo" />
              <div className="footer-brand-titles">
                <h3>PROPIC</h3>
                <p className="footer-subtitle-tag">CLEAN BEYOND THE SURFACE</p>
              </div>
            </div>
            <p className="footer-brand-description">
              PROPIC is a product of Gaayathri Enterprises. We build reliable, affordable cleaning solutions for homes and businesses.
            </p>
            <div className="footer-brand-badges-row">
              <span className="brand-badge-pill">Verified Brand</span>
              <span className="brand-badge-pill">Quality Assured</span>
            </div>

            <div className="footer-social-section">
              <h4 className="footer-section-title">let’s socialize</h4>
              <nav className="footer-social-icons" aria-label="Social Media Links">
                <a href="#" aria-label="Instagram" className="social-icon-btn"><Icon path={ICONS.instagram} /></a>
                <a href="#" aria-label="Facebook" className="social-icon-btn"><Icon path={ICONS.facebook} /></a>
                <a href="#" aria-label="LinkedIn" className="social-icon-btn"><Icon path={ICONS.linkedin} /></a>
                <a href="#" aria-label="YouTube" className="social-icon-btn"><Icon path={ICONS.youtube} /></a>
              </nav>
            </div>
          </div>

          {/* Column 2: shop + explore & info */}
          <div className="footer-links-column">
            <div className="footer-links-subgrid">
              
              {/* Sub-column 1: shop + explore */}
              <div className="footer-links-group">
                <h4 className="footer-section-title">shop + explore</h4>
                <nav className="footer-nav-menu">
                  <Link to="/">home</Link>
                  <Link to="/products">products</Link>
                  <Link to="/track-order">track order</Link>
                  <Link to="/contact">contact us</Link>
                </nav>
              </div>

              {/* Sub-column 2: info */}
              <div className="footer-links-group">
                <h4 className="footer-section-title">info</h4>
                <nav className="footer-nav-menu">
                  <Link to="/about">meet method</Link>
                  <span className="footer-static-item">floor cleaners</span>
                  <span className="footer-static-item">bathroom cleaners</span>
                  <span className="footer-static-item">kitchen degreasers</span>
                  <span className="footer-static-item">disinfectant solutions</span>
                  <span className="footer-static-item">specialty cleaners</span>
                </nav>
              </div>

            </div>
          </div>

          {/* Column 3: refresh your inbox */}
          <div className="footer-newsletter-column">
            <h4 className="footer-section-title">refresh your inbox</h4>
            <p className="footer-newsletter-desc">
              join our email list to get 10% off your first order, plus first dibs on exclusive offers + scent-illating news.
            </p>
            
            <form className="footer-newsletter-form" onSubmit={handleSubmit}>
              <div className={`footer-input-wrapper ${emailActive || email ? 'active' : ''}`}>
                <label className="footer-input-label">Email</label>
                <input 
                  type="email" 
                  value={email}
                  placeholder={emailActive ? '' : 'email address'}
                  required
                  className="footer-email-input"
                  onFocus={() => setEmailActive(true)}
                  onBlur={() => setEmailActive(false)}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" aria-label="Submit form" className="footer-submit-btn">
                  <Icon path={ICONS.arrowRight} />
                </button>
              </div>
              {subscribed && (
                <p className="footer-success-msg">Thanks for subscribing! Check your inbox for your 10% discount.</p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom copyright notice & legal links */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-inner">
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy Notice</a>
              <span className="footer-bottom-sep">|</span>
              <a href="#" className="footer-bottom-link">Terms + Conditions</a>
            </div>
            <p className="footer-copyright">
              © 2026 PROPIC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer