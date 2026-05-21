import { useState } from 'react'

function ContactPage() {
  const [activeSupportTab, setActiveSupportTab] = useState('retail')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [formFocused, setFormFocused] = useState({
    name: false,
    email: false,
    subject: false,
    message: false
  })
  const [submitted, setSubmitted] = useState(false)

  const supportDetails = {
    retail: {
      title: 'Storefront & Customer Orders',
      subtitle: 'Need help with bottle sizes, scents, or delivery tracking?',
      instructions: 'For general purchase guidance, home order inquiries, or shipping status, we are available on phone or email. Please keep your order number ready if you have already purchased from us.',
      ctaText: 'General FAQ Checklist',
      points: [
        'How long does standard delivery take? (Usually 2-4 business days across Tamil Nadu)',
        'What is your return policy? (Damage-on-arrival replacements provided instantly)',
        'Where can I find ingredient disclosures? (Under the back labels of each bottle)'
      ]
    },
    bulk: {
      title: 'Bulk Purchases & Corporate Supply',
      subtitle: 'Ordering for offices, factories, hospitals, or retail resale?',
      instructions: 'Gaayathri Enterprises offers wholesale commercial discounts for buyers purchasing above 50 liters or cartons. Custom sizing (5L canisters) is available for heavy duty setups.',
      ctaText: 'Wholesale Onboarding Requirements',
      points: [
        'Min Order Quantity for wholesale rates: 5 cartons mixed products',
        'Direct delivery arrangements for shops and resellers via local transports',
        'GST invoice provision for institutional buyers'
      ]
    },
    support: {
      title: 'Dermatology & Eco-safety Desk',
      subtitle: 'Have questions regarding active ingredients or surface safety?',
      instructions: 'Our Tiruchengode labs test every formulation. If you need safety data sheets (SDS) or surface safety guidelines (e.g. marble, delicate granite floor care), connect with our technician desk.',
      ctaText: 'Surface Compatibility Quick Guide',
      points: [
        'Propic Floor Cleaners: safe for marble, wood, ceramic, granite, and vitrified tiles.',
        'Propic Dish Wash: skin-friendly, PH balanced, contains zero industrial acids.',
        'Propic Degreaser: heavy-duty kitchen power, non-corrosive to stainless steel.'
      ]
    }
  }

  const handleFocus = (field) => {
    setFormFocused((prev) => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field, val) => {
    if (!val) {
      setFormFocused((prev) => ({ ...prev, [field]: false }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setFormFocused({ name: false, email: false, subject: false, message: false })
      }, 4000)
    }
  }

  return (
    <div className="contact-page-container">
      {/* Dynamic Background Glows */}
      <div className="contact-bg-glow teal"></div>
      <div className="contact-bg-glow purple"></div>

      <div className="contact-asymmetric-split">
        {/* LEFT COLUMN: Premium Connect Details & Interactive Desk */}
        <div className="contact-details-column">
          <div className="contact-header-text">
            <span className="contact-badge">GET IN TOUCH</span>
            <h1 className="contact-title">Let’s start a clean conversation.</h1>
            <p className="contact-subtitle-desc">
              Have inquiries about bulk pricing, active scents, or your shipment? 
              The Gaayathri Enterprises team is here to guide you.
            </p>
          </div>

          {/* Minimalist interactive contact rows */}
          <div className="contact-direct-rows">
            <a href="tel:+919363753633" className="direct-contact-item">
              <div className="contact-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="contact-item-text">
                <span>Call Us Direct</span>
                <strong>+91 93637 53633</strong>
              </div>
            </a>

            <a href="mailto:contact@propic.in" className="direct-contact-item">
              <div className="contact-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="contact-item-text">
                <span>Email Us</span>
                <strong>contact@propic.in</strong>
              </div>
            </a>

            <div className="direct-contact-item no-link">
              <div className="contact-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="contact-item-text">
                <span>Working Hours</span>
                <strong>Mon - Sat: 9 AM - 7 PM</strong>
              </div>
            </div>
          </div>

          {/* Interactive Support Desk Toggles */}
          <div className="contact-support-toggles">
            <h3 className="toggles-header-title">Which department do you need?</h3>
            <div className="support-tabs-row">
              <button
                className={`support-tab-btn ${activeSupportTab === 'retail' ? 'active' : ''}`}
                onClick={() => setActiveSupportTab('retail')}
              >
                Retail Help
              </button>
              <button
                className={`support-tab-btn ${activeSupportTab === 'bulk' ? 'active' : ''}`}
                onClick={() => setActiveSupportTab('bulk')}
              >
                Bulk & Wholesale
              </button>
              <button
                className={`support-tab-btn ${activeSupportTab === 'support' ? 'active' : ''}`}
                onClick={() => setActiveSupportTab('support')}
              >
                Eco & safety
              </button>
            </div>

            <div className="support-details-morph">
              <h4>{supportDetails[activeSupportTab].title}</h4>
              <p className="support-desc-text">{supportDetails[activeSupportTab].subtitle}</p>
              <p className="support-instruction-text">{supportDetails[activeSupportTab].instructions}</p>
              
              <div className="support-checklist">
                <strong>{supportDetails[activeSupportTab].ctaText}</strong>
                <ul>
                  {supportDetails[activeSupportTab].points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Modern Glass Inquiry Form */}
        <div className="contact-form-column">
          <div className="glass-form-wrap">
            <div className="glass-form-glow"></div>
            <div className="glass-form-content">
              <h2>Send an Instant Message</h2>
              <p>We usually reply to form submissions within 3 hours during active hours.</p>

              <form onSubmit={handleSubmit} className="premium-inquiry-form">
                {/* Name field */}
                <div className={`form-group ${formFocused.name || formData.name ? 'active' : ''}`}>
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => handleFocus('name')}
                    onBlur={(e) => handleBlur('name', e.target.value)}
                  />
                  <span className="input-glow-line"></span>
                </div>

                {/* Email field */}
                <div className={`form-group ${formFocused.email || formData.email ? 'active' : ''}`}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    required
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => handleFocus('email')}
                    onBlur={(e) => handleBlur('email', e.target.value)}
                  />
                  <span className="input-glow-line"></span>
                </div>

                {/* Subject field */}
                <div className={`form-group ${formFocused.subject || formData.subject ? 'active' : ''}`}>
                  <label htmlFor="subject">Subject (Optional)</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    onFocus={() => handleFocus('subject')}
                    onBlur={(e) => handleBlur('subject', e.target.value)}
                  />
                  <span className="input-glow-line"></span>
                </div>

                {/* Message field */}
                <div className={`form-group textarea-group ${formFocused.message || formData.message ? 'active' : ''}`}>
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    id="message"
                    value={formData.message}
                    required
                    rows="4"
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    onFocus={() => handleFocus('message')}
                    onBlur={(e) => handleBlur('message', e.target.value)}
                  ></textarea>
                  <span className="input-glow-line"></span>
                </div>

                <button type="submit" className="form-submit-btn">
                  Send Message
                </button>
              </form>

              {submitted && (
                <div className="form-success-banner">
                  <div className="success-icon">✓</div>
                  <div className="success-text">
                    <strong>Message sent successfully!</strong>
                    <span>Thank you. Gaayathri Enterprises will get in touch shortly.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map or Location Section */}
      <section className="location-typography-section">
        <div className="location-minimalist-content">
          <span>OUR PRODUCTION BASE</span>
          <h2>Tiruchengode, Tamil Nadu, India</h2>
          <p>
            All PROPIC cleaning solutions are locally formulated and bottled in the heart of Tiruchengode, 
            guaranteeing standard local employment, verified ingredients, and speedy distribution.
          </p>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
