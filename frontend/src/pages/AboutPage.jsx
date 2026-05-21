import { useState } from 'react'
import { Link } from 'react-router-dom'

function AboutPage() {
  const [activePillar, setActivePillar] = useState('purpose')

  const pillars = {
    purpose: {
      title: 'Reliable cleaning for homes, shops, and bulk buyers.',
      desc: 'We exist to deliver deep, uncompromising cleanliness. Whether it is a busy household, a retail storefront, or bulk commercial facilities, our formulations are balanced to handle intense demands without complications.',
      stat: '100% Reliable',
      statLabel: 'Daily performance'
    },
    quality: {
      title: 'Made with absolute focus on consistency, safety, and results.',
      desc: 'Quality is not a luxury—it is our baseline. Every batch is manufactured under strict controls in Tiruchengode, ensuring that the PH levels, active sanitizing agents, and fresh botanical scents remain completely uniform.',
      stat: 'PH Balanced',
      statLabel: 'Derm-tested formulas'
    },
    value: {
      title: 'Products that are practical, long-lasting, and affordable.',
      desc: 'We reject overpriced fancy boxes. Propic focuses on maximum efficacy per ounce, durable packaging, and direct distribution to give both households and businesses premium value for repeat purchases.',
      stat: 'Eco-Efficacy',
      statLabel: 'Best value per ml'
    }
  }

  const timelineSteps = [
    {
      year: 'Genesis',
      title: 'A Vision for Smarter Cleaning',
      description: 'Gaayathri Enterprises realized that everyday households were caught between harsh industrial chemicals and overpriced organic brands that lacked actual grease-cutting power. Propic was born to bridge this gap.'
    },
    {
      year: 'Development',
      title: 'The Scent & Efficacy Lab',
      description: 'We collaborated with leading chemical formulators in Tamil Nadu to craft botanical-scented, premium cleaning liquids. Our focus was simple: biodegradable surfactants, long-lasting aroma, and zero residue.'
    },
    {
      year: 'Scale',
      title: 'Trusted by Homes & Shops',
      description: 'Today, Propic is distributed across key commercial outlets, supermarkets, and industrial buyers, establishing a legacy of safety, high performance, and unmatched economic value.'
    }
  ]

  return (
    <div className="about-page-container">
      {/* 1. Luminous Hero Section */}
      <section className="about-premium-hero">
        <div className="about-hero-backdrop-glow"></div>
        <div className="about-hero-content">
          <span className="about-hero-badge">OUR ESSENCE</span>
          <h1 className="about-hero-title">
            Cleaner homes.<br />
            Safer routines.<br />
            <span className="gradient-text purple-teal">Better value.</span>
          </h1>
          <p className="about-hero-description">
            Propic is a high-performance cleaning brand built by Gaayathri Enterprises. 
            We engineer products that are relentlessly effective on dirt, gentle on the surfaces you cherish, 
            and thoughtfully priced for everyday living.
          </p>
          <div className="about-hero-actions">
            <Link to="/products" className="about-cta-btn primary">
              Explore Products
            </Link>
            <Link to="/contact" className="about-cta-btn ghost">
              Connect With Us
            </Link>
          </div>
        </div>

        {/* Luminous Stat Box overlay */}
        <div className="about-hero-media">
          <div className="glass-metric-panel">
            <div className="glass-metric-row">
              <span className="metric-num">98%</span>
              <div className="metric-info">
                <strong>Repeat Customers</strong>
                <span>Built on trusted daily cleanliness</span>
              </div>
            </div>
            <div className="glass-metric-row">
              <span className="metric-num">0%</span>
              <div className="metric-info">
                <strong>Harsh Toxic Residues</strong>
                <span>Safe for kids, pets & sensitive floors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Pillars Panel (Replacing standard card grid) */}
      <section className="about-pillars-section">
        <div className="section-header-minimal">
          <span className="section-subtitle">THE PROPIC WAY</span>
          <h2 className="section-title">What we stand for</h2>
          <p className="section-desc">
            We reject the typical card layout. Select a core brand pillar below to explore our engineering philosophy:
          </p>
        </div>

        <div className="pillars-interactive-split">
          {/* Left Column: Capsule tabs */}
          <div className="pillars-tabs-column">
            {Object.keys(pillars).map((key) => (
              <button
                key={key}
                className={`pillar-tab-trigger ${activePillar === key ? 'active' : ''}`}
                onClick={() => setActivePillar(key)}
              >
                <span className="pillar-tab-num">0{Object.keys(pillars).indexOf(key) + 1}</span>
                <span className="pillar-tab-name">{key.toUpperCase()}</span>
                <span className="pillar-tab-indicator"></span>
              </button>
            ))}
          </div>

          {/* Right Column: Dynamic descriptive view */}
          <div className="pillars-content-column">
            <div className="pillar-content-card-glow"></div>
            <div className="pillar-content-card">
              <span className="pillar-content-badge">{pillars[activePillar].stat}</span>
              <h3 className="pillar-content-title">{pillars[activePillar].title}</h3>
              <p className="pillar-content-desc">{pillars[activePillar].desc}</p>
              <div className="pillar-content-footer">
                <span className="pillar-content-footer-label">Engineering target:</span>
                <strong>{pillars[activePillar].statLabel}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Typographic Timeline Section */}
      <section className="about-timeline-section">
        <div className="section-header-minimal">
          <span className="section-subtitle">OUR JOURNEY</span>
          <h2 className="section-title">How we got here</h2>
        </div>

        <div className="timeline-interactive-flow">
          <div className="timeline-track-line"></div>
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="timeline-node-row">
              <div className="timeline-year-column">
                <span className="timeline-year-bubble">{step.year}</span>
              </div>
              <div className="timeline-details-column">
                <h3 className="timeline-node-title">{step.title}</h3>
                <p className="timeline-node-desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Elegant Brand Slogan Band */}
      <section className="about-slogan-band">
        <div className="slogan-band-content">
          <h2>Ready to transform your cleaning ritual?</h2>
          <p>Explore our premium floor cleaners, fresh dishwashing formulas, and multi-surface degreasers.</p>
          <Link to="/products" className="slogan-band-btn">Shop Scent-Sational Cleaning</Link>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
