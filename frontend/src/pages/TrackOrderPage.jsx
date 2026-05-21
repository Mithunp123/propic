import { useState } from 'react'
import { requestJson } from '../utils/api'
import { money } from '../utils/format'

const PHONE_REGEX = /^\d{10}$/

// Premium inline SVGs matching our bespoke theme
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

function TrackOrderPage() {
  const [phone, setPhone] = useState('')
  const [pincode, setPincode] = useState('')
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('idle')
  const [step, setStep] = useState('phone')
  const [verified, setVerified] = useState(false)
  const [formFocused, setFormFocused] = useState({
    phone: false,
    pincode: false
  })

  const handleFocus = (field) => {
    setFormFocused((prev) => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field, val) => {
    if (!val) {
      setFormFocused((prev) => ({ ...prev, [field]: false }))
    }
  }

  async function submitPhone(event) {
    event.preventDefault()
    if (!PHONE_REGEX.test(phone)) {
      setOrders([])
      setStep('phone')
      setStatus('phone-none')
      return
    }

    setStatus('loading')
    try {
      const data = await requestJson(`/api/orders/track?phone=${encodeURIComponent(phone)}`)
      setOrders(data)
      setStep('pincode')
      setStatus('phone-ok')
    } catch {
      setOrders([])
      setStep('phone')
      setStatus('phone-none')
    }
  }

  async function verifyPincode(event) {
    event.preventDefault()
    setStatus('verifying')
    try {
      const data = await requestJson('/api/orders/verify', {
        method: 'POST',
        body: JSON.stringify({ phone, pincode }),
      })
      setOrders(data.orders)
      setVerified(true)
      setStep('done')
      setStatus('verified')
    } catch {
      setVerified(false)
      setStep('pincode')
      setStatus('bad-pin')
    }
  }

  // Get color indicators for order statuses
  const getStatusColor = (orderStatus) => {
    const s = orderStatus?.toLowerCase() || ''
    if (s.includes('deliver') || s === 'completed') return 'green'
    if (s.includes('ship') || s.includes('transit')) return 'blue'
    if (s.includes('cancel')) return 'gray'
    return 'orange' // pending, processing, default
  }

  return (
    <div className="track-order-page-container">
      {/* Background Ambience */}
      <div className="track-bg-glow cyan"></div>
      <div className="track-bg-glow yellow"></div>

      {/* Luminous Page Header */}
      <header className="track-hero-section">
        <span className="track-badge">ORDER COMPASS</span>
        <h1 className="track-title">
          Track your<br />
          <span className="gradient-text purple-teal">scent journey.</span>
        </h1>
        <p className="track-subtitle">
          Securely lookup and monitor the transit details of your premium PROPIC order in two simple steps.
        </p>
      </header>

      {/* Modern Horizontal Step Tracker */}
      <div className="track-step-indicator-row">
        <div className={`step-node ${step === 'phone' ? 'active' : ''} ${step !== 'phone' ? 'completed' : ''}`}>
          <div className="step-number">01</div>
          <span className="step-label">Identify Mobile</span>
        </div>
        <div className="step-line-connector">
          <div className={`connector-fill ${step !== 'phone' ? 'filled' : ''}`}></div>
        </div>
        <div className={`step-node ${step === 'pincode' ? 'active' : ''} ${step === 'done' ? 'completed' : ''}`}>
          <div className="step-number">02</div>
          <span className="step-label">Secure Verification</span>
        </div>
      </div>

      {/* Form and Results Section */}
      <div className="track-content-flow-wrap">
        {step === 'phone' && (
          <div className="glass-form-wrap track-glass-wrap">
            <div className="glass-form-glow"></div>
            <div className="glass-form-content">
              <div className="track-form-head-minimal">
                <SearchIcon />
                <h3>Enter Phone Number</h3>
                <p>Provide the 10-digit mobile number bound to your transaction.</p>
              </div>

              <form onSubmit={submitPhone} className="premium-inquiry-form">
                <div className={`form-group ${formFocused.phone || phone ? 'active' : ''}`}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    required
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                    onFocus={() => handleFocus('phone')}
                    onBlur={(e) => handleBlur('phone', e.target.value)}
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Phone number must be exactly 10 digits"
                  />
                  <span className="input-glow-line"></span>
                </div>

                <button type="submit" className="form-submit-btn">
                  {status === 'loading' ? 'Searching...' : 'Find Orders'}
                </button>
              </form>
            </div>
          </div>
        )}

        {step === 'pincode' && (
          <div className="glass-form-wrap track-glass-wrap animate-fade-in">
            <div className="glass-form-glow"></div>
            <div className="glass-form-content">
              <div className="track-form-head-minimal">
                <ShieldIcon />
                <h3>Verify Delivery Pincode</h3>
                <p>Provide the delivery location pincode from your latest order address.</p>
              </div>

              <form onSubmit={verifyPincode} className="premium-inquiry-form">
                <div className={`form-group ${formFocused.pincode || pincode ? 'active' : ''}`}>
                  <label htmlFor="pincode">Latest Order Pincode</label>
                  <input
                    type="text"
                    id="pincode"
                    value={pincode}
                    required
                    onChange={(event) => setPincode(event.target.value.replace(/\s/g, ''))}
                    onFocus={() => handleFocus('pincode')}
                    onBlur={(e) => handleBlur('pincode', e.target.value)}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                  <span className="input-glow-line"></span>
                </div>

                <div className="track-back-option-row">
                  <button type="button" className="btn-back-link" onClick={() => { setStep('phone'); setStatus('idle'); }}>
                    ← Back to Phone Lookup
                  </button>
                </div>

                <button type="submit" className="form-submit-btn">
                  {status === 'verifying' ? 'Verifying Pincode...' : 'Verify & Reveal Orders'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Error Feedback Messages */}
        <div className="track-message-feedback-wrap">
          {status === 'phone-none' && (
            <div className="track-error-notice animate-shake">
              <div className="error-icon-dot">!</div>
              <div className="error-message-text">
                <strong>No Orders Registered</strong>
                <span>We couldn't find any transaction linked to +91 {phone}. Please check and retry.</span>
              </div>
            </div>
          )}
          {status === 'bad-pin' && (
            <div className="track-error-notice animate-shake">
              <div className="error-icon-dot">!</div>
              <div className="error-message-text">
                <strong>Verification Failed</strong>
                <span>The pincode you entered does not match our database records for this number.</span>
              </div>
            </div>
          )}
        </div>

        {/* Display Verified Order Results */}
        {step === 'done' && verified && (
          <div className="track-results-layout animate-fade-in-up">
            <div className="results-header-minimal">
              <div className="success-pulse-check">
                <CheckIcon />
              </div>
              <h2>Verification Complete</h2>
              <p>We found {orders.length} secure order{orders.length !== 1 ? 's' : ''} under your contact number.</p>
            </div>

            <div className="track-order-items-typographic-list">
              {orders.map((order, index) => {
                const color = getStatusColor(order.status)
                return (
                  <div key={order.order_id || index} className="track-order-row-item">
                    {/* Header Row */}
                    <div className="order-row-head">
                      <div className="order-row-meta">
                        <span className="order-row-id-label">ORDER ID</span>
                        <strong className="order-row-id-number">#{order.order_id}</strong>
                      </div>
                      <div className={`order-status-badge ${color}`}>
                        <span className="badge-pulse-dot"></span>
                        <span className="badge-text-label">{order.status || 'Processing'}</span>
                      </div>
                    </div>

                    {/* Progress tracking line */}
                    <div className="order-row-timeline-progress">
                      <div className="timeline-stages-labels">
                        <span className="stage-label completed">Placed</span>
                        <span className={`stage-label ${order.status !== 'pending' && order.status !== 'cancelled' ? 'completed' : ''}`}>Shipped</span>
                        <span className={`stage-label ${color === 'green' ? 'completed' : ''}`}>Delivered</span>
                      </div>
                      <div className="timeline-track-bg">
                        <div 
                          className={`timeline-track-fill ${color}`}
                          style={{
                            width: color === 'green' ? '100%' : (color === 'blue' ? '50%' : '10%')
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="order-row-footer">
                      <div className="order-footer-item">
                        <span>Total Paid</span>
                        <strong>{money(order.total_amount)}</strong>
                      </div>
                      <div className="order-footer-item right-align">
                        <span>Method</span>
                        <span className="payment-method-tag">{order.payment_method?.toUpperCase() || 'COD'}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="track-reset-action-row">
              <button 
                type="button" 
                className="about-cta-btn ghost reset-track-btn" 
                onClick={() => {
                  setStep('phone')
                  setPhone('')
                  setPincode('')
                  setOrders([])
                  setStatus('idle')
                  setVerified(false)
                }}
              >
                Track Another Number
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackOrderPage