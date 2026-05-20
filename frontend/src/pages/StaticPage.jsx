import { Link } from 'react-router-dom'

function StaticPage({ title, description }) {
  const isAboutPage = String(title || '').toLowerCase().includes('about')
  const isContactPage = String(title || '').toLowerCase().includes('contact')

  if (isAboutPage) {
    return (
      <section className="grid">
        <section className="hero-card about-hero-card">
          <div className="hero-copy">
            <p className="offer-badge">About Propic</p>
            <h1>Cleaner homes, safer routines, better value.</h1>
            <p>
              Propic is a cleaning brand built for real households and businesses. We focus on products that
              are effective on everyday dirt, gentle on the spaces you care about, and practical for regular use.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="button primary">Explore Products</Link>
              <Link to="/contact" className="button ghost">Talk to Us</Link>
            </div>
          </div>
          <div className="hero-panel">
            <div className="feature-band">
              <div>
                <strong>Purpose</strong>
                <span>Reliable cleaning for homes, shops, and bulk buyers.</span>
              </div>
              <div>
                <strong>Quality</strong>
                <span>Made with a focus on consistency, safety, and results.</span>
              </div>
              <div>
                <strong>Value</strong>
                <span>Products that are practical, long-lasting, and affordable.</span>
              </div>
            </div>
          </div>
        </section>

        <div className="about-section">
          <div className="about-text">
            <h2>What Propic stands for</h2>
            <p>
              We believe cleaning products should do the job well without making daily routines complicated.
              That is why Propic is designed around strong performance, easy use, and dependable results.
            </p>
            <p>
              From floor care to kitchen and bathroom cleaning, our range is made to support the spaces where
              families live, work, and gather every day.
            </p>
          </div>
          <div className="card-panel">
            <h3>Why customers choose Propic</h3>
            <p>Our products are made to balance three things that matter most:</p>
            <ul>
              <li>Cleaning power that handles daily mess quickly.</li>
              <li>Practical packaging and value for repeat use.</li>
              <li>Trust built for households, retailers, and business orders.</li>
            </ul>
          </div>
        </div>

        <section className="card-panel">
          <h2>Our promise</h2>
          <p>
            Propic exists to make everyday cleaning simpler, more reliable, and better suited to modern homes.
            We keep improving our range so customers can choose products that fit their routine with confidence.
          </p>
        </section>
      </section>
    )
  }

  if (isContactPage) {
    return (
      <section className="grid">
        <section className="hero-card about-hero-card">
          <div className="hero-copy">
            <p className="offer-badge">Contact Propic</p>
            <h1>Need product help, order support, or bulk pricing?</h1>
            <p>
              The Propic team is here to help with product recommendations, order updates, and business enquiries.
              Reach out and we’ll point you to the right solution for home use, retail shelves, or larger supplies.
            </p>
            <div className="hero-actions">
              <a href="tel:+919363753633" className="button primary">Call +91 93637 53633</a>
              <a href="mailto:contact@propic.in" className="button ghost">Email Us</a>
            </div>
          </div>
          <div className="hero-panel">
            <div className="feature-band">
              <div>
                <strong>Retail Orders</strong>
                <span>Help choosing products for shelves, counters, and repeat purchases.</span>
              </div>
              <div>
                <strong>Bulk Enquiries</strong>
                <span>Support for businesses, resellers, and larger packaging needs.</span>
              </div>
              <div>
                <strong>Customer Support</strong>
                <span>Guidance on usage, product ranges, and availability.</span>
              </div>
            </div>
          </div>
        </section>

        <div className="about-section">
          <div className="card-panel">
            <h2>How to reach us</h2>
            <ul className="contact-list contact-page-list">
              <li>Tiruchengode, Tamil Nadu, India - 632001</li>
              <li><a href="tel:+919363753633">+91 93637 53633</a></li>
              <li><a href="mailto:contact@propic.in">contact@propic.in</a></li>
              <li>Mon-Sat: 9 AM - 7 PM</li>
            </ul>
          </div>
          <div className="card-panel">
            <h3>What we can help with</h3>
            <p>Use this contact page for questions about:</p>
            <ul>
              <li>Product recommendations for homes and businesses.</li>
              <li>Bulk order or reseller enquiries.</li>
              <li>Availability, delivery, and general support.</li>
            </ul>
          </div>
        </div>

        <section className="card-panel">
          <h2>Quick note</h2>
          <p>
            If you already placed an order, keep your order details ready so the Propic team can help faster.
            For product questions, mention what you’re cleaning and we’ll suggest the best fit.
          </p>
        </section>
      </section>
    )
  }

  return (
    <section className="card-panel">
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}

export default StaticPage