import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

// Custom premium inline SVGs to match the high-end look
const PhoneIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const MailIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const TwitterIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const FacebookIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const ArrowDownIcon = ({ className = 'w-3 h-3' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

function Header({ cartCount, isHome, onCartClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Premium Yellow Top Bar */}
      <div className="yellow-topbar">
        <div className="yellow-topbar-inner">
          <div className="topbar-contact">
            <a href="tel:+4033949940" className="topbar-item">
              <PhoneIcon className="topbar-icon" />
              <span>Call us: +403-394-9940</span>
            </a>
            <span className="topbar-divider">|</span>
            <a href="mailto:hello@neatly.com" className="topbar-item">
              <MailIcon className="topbar-icon" />
              <span>hello@neatly.com</span>
            </a>
          </div>
          <div className="topbar-socials">
            <a href="#" aria-label="Twitter" className="social-link"><TwitterIcon /></a>
            <a href="#" aria-label="Facebook" className="social-link"><FacebookIcon /></a>
            <a href="#" aria-label="Instagram" className="social-link"><InstagramIcon /></a>
            <a href="#" aria-label="LinkedIn" className="social-link"><LinkedinIcon /></a>
          </div>
        </div>
      </div>

      {/* Main Transparent / Overlay Navigation Header */}
      <header className={`neatly-header ${isHome ? 'is-home' : 'is-solid'}`}>
        <div className="neatly-header-inner">
          {/* Logo Brand area */}
          <Link to="/" className="neatly-brand" aria-label="PROPIC Home">
            <div className="logo-icon-container">
              <img src="/brand/propic-logo.png" className="neatly-logo-img" alt="PROPIC Logo" />
            </div>
            <span className="neatly-brand-name">PROPIC</span>
          </Link>

          {/* Navigation Links */}
          <nav className="neatly-nav">
            <NavLink to="/" className="neatly-navlink">Home</NavLink>
            <NavLink to="/products" className="neatly-navlink">Products</NavLink>
            <NavLink to="/about" className="neatly-navlink">About</NavLink>
            <NavLink to="/contact" className="neatly-navlink">Contact</NavLink>
            <NavLink to="/track-order" className="neatly-navlink">Track Order</NavLink>
          </nav>

          {/* Header Action Button (Right Side) */}
          <div className="header-actions">
            <button
              type="button"
              className="header-cart-action"
              onClick={(e) => {
                if (onCartClick) {
                  e.preventDefault()
                  onCartClick()
                }
              }}
              aria-label="Shopping Cart"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <div className="cart-icon-wrapper">
                <svg className="header-cart-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cartCount > 0 && (
                  <span className="header-cart-count-badge">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header