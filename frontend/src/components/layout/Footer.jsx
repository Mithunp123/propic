import { Link } from 'react-router-dom'

function Icon({ path, viewBox = '0 0 24 24' }) {
  return (
    <svg viewBox={viewBox} fill="none" aria-hidden="true" focusable="false">
      <path d={path} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICONS = {
  location: 'M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.8 2.6a2 2 0 0 1-.4 2.1L8.2 9.7a16 16 0 0 0 6.1 6.1l1.3-1.3a2 2 0 0 1 2.1-.4c.8.4 1.7.7 2.6.8A2 2 0 0 1 22 16.9z',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 7l-10 7L2 7',
  clock: 'M12 6v6l4 2 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
  facebook: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z',
  instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M16 11.4a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M17.5 6.5h.01',
  linkedin: 'M16 8a6 6 0 0 1 6 6v8h-4v-8a2 2 0 0 0-4 0v8h-4V9h4v2 M2 9h4v13H2z M4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  youtube: 'M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.7 12 4.7 12 4.7s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2A29.7 29.7 0 0 0 1 12a29.7 29.7 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2A29.7 29.7 0 0 0 23 12a29.7 29.7 0 0 0-.5-4.8z M10 15.5v-7l6 3.5-6 3.5z',
}

function Footer() {
  return (
    <footer className="footer footer-pro">
      <div className="footer-grid">
        <section className="footer-col brand-col">
          <div className="footer-brand-head">
            <img className="footer-logo" src="/brand/ge-logo.png" alt="Gaayathri Enterprises logo" />
            <div>
              <h3>PROPIC</h3>
              <p className="footer-tag">CLEAN BEYOND THE SURFACE</p>
            </div>
          </div>
          <p className="footer-desc">PROPIC is a product of Gaayathri Enterprises. We build reliable, affordable cleaning solutions for homes and businesses.</p>
          <div className="footer-badges">
            <span>Verified Brand</span>
            <span>Quality Assured</span>
          </div>
        </section>

        <section className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/track-order">Track Order</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </section>

        <section className="footer-col">
          <h4>Our Products</h4>
          <ul>
            <li>Floor Cleaners</li>
            <li>Bathroom Cleaners</li>
            <li>Kitchen Degreasers</li>
            <li>Disinfectant Solutions</li>
            <li>Specialty Cleaners</li>
            <li>Spare & Refill Packs</li>
          </ul>
        </section>

        <section className="footer-col">
          <h4>Contact Us</h4>
          <ul className="contact-list">
            <li><span className="contact-icon"><Icon path={ICONS.location} /></span>Tiruchengode, Tamil Nadu, India - 632001</li>
            <li><span className="contact-icon"><Icon path={ICONS.phone} /></span>+91 93637 53633</li>
            <li><span className="contact-icon"><Icon path={ICONS.mail} /></span>contact@propic.in</li>
            <li><span className="contact-icon"><Icon path={ICONS.clock} /></span>Mon-Sat: 9 AM - 7 PM</li>
          </ul>
          <div className="social-row">
            <a href="#" aria-label="Facebook"><Icon path={ICONS.facebook} /></a>
            <a href="#" aria-label="Instagram"><Icon path={ICONS.instagram} /></a>
            <a href="#" aria-label="LinkedIn"><Icon path={ICONS.linkedin} /></a>
            <a href="#" aria-label="YouTube"><Icon path={ICONS.youtube} /></a>
          </div>
        </section>
      </div>
    </footer>
  )
}

export default Footer