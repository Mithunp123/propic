import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SectionHeading from '../components/common/SectionHeading'
import { requestJson } from '../utils/api'
import { money } from '../utils/format'

const PHONE_REGEX = /^\d{10}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function CheckoutPage({ cart, clearCart }) {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [lookupState, setLookupState] = useState('idle')
  const [customer, setCustomer] = useState(null)
  const [message, setMessage] = useState('')
  const [ordersPreview, setOrdersPreview] = useState([])
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', address: '', pincode: '', payment_method: 'cod' })

  async function lookupPhone(event) {
    event.preventDefault()
    if (!PHONE_REGEX.test(phone)) {
      setMessage('Please enter a valid 10-digit phone number.')
      return
    }

    setMessage('')
    setLookupState('loading')
    try {
      const orders = await requestJson(`/api/orders/track?phone=${encodeURIComponent(phone)}`)
      const latest = orders[0]
      setOrdersPreview(orders)
      if (latest) {
        setCustomer(latest)
        setForm((current) => ({ ...current, first_name: latest.first_name, last_name: latest.last_name, email: latest.email, address: latest.address, pincode: latest.pincode }))
      }
      setLookupState('ready')
    } catch {
      setCustomer(null)
      setLookupState('ready')
    }
  }

  async function submitOrder(event) {
    event.preventDefault()
    if (!PHONE_REGEX.test(phone)) {
      setMessage('Please enter a valid 10-digit phone number.')
      return
    }

    if (!EMAIL_REGEX.test(form.email.trim())) {
      setMessage('Please enter a valid email address.')
      return
    }

    setMessage('')
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 99 + cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.1
    try {
      const result = await requestJson('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          phone,
          ...form,
          cart_items: cart,
          total_amount: total,
        }),
      })
      clearCart()
      navigate(`/order/${result.order_id}`)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <section className="checkout-page page-wrap">
      <SectionHeading title="Checkout" subtitle="Customer lookup + order placement" />
      <div className="checkout-shell">
        <div className="stack checkout-main">
          <form className="card-panel checkout-card" onSubmit={lookupPhone}>
            <div className="checkout-card-head">
              <span className="checkout-step">Step 1</span>
              <div>
                <h3>Phone lookup</h3>
                <p>Find recent order details using the phone number.</p>
              </div>
            </div>
            <div className="checkout-row-single">
              <input
                className="field"
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Phone number"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                pattern="[0-9]{10}"
                title="Phone number must be exactly 10 digits"
                required
              />
              <button className="button primary" type="submit">Continue</button>
            </div>
          </form>

          {lookupState === 'ready' ? (
            <form className="card-panel checkout-card" onSubmit={submitOrder}>
              <div className="checkout-card-head">
                <span className="checkout-step">Step 2</span>
                <div>
                  <h3>Delivery details</h3>
                  <p>Fill in the address for the final order.</p>
                </div>
              </div>
              {customer ? <p className="note">Previous address found. You can update it below.</p> : <p className="note">New customer. Fill in your delivery details.</p>}
              <div className="form-grid">
                <input className="field" value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} placeholder="First name" required />
                <input className="field" value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} placeholder="Last name" required />
                <input
                  className="field"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="Email"
                  autoComplete="email"
                  required
                />
                <input className="field" value={form.pincode} onChange={(event) => setForm({ ...form, pincode: event.target.value })} placeholder="Pincode" required />
              </div>
              <textarea className="field" rows="4" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Delivery address" required />
              <select className="field" value={form.payment_method} onChange={(event) => setForm({ ...form, payment_method: event.target.value })}>
                <option value="cod">Cash on delivery</option>
                <option value="upi">UPI</option>
              </select>
              {message ? <div className="error-text">{message}</div> : null}
              <button className="button primary" type="submit" disabled={!cart.length}>Place order</button>
            </form>
          ) : null}

          {ordersPreview.length ? (
            <div className="card-panel checkout-card">
              <h3>Recent orders for this phone</h3>
              <div className="stack">
                {ordersPreview.map((order) => (
                  <div className="summary-line" key={order.order_id}>
                    <span>#{order.order_id} - {order.status}</span>
                    <strong>{money(order.total_amount)}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <aside className="summary-card checkout-summary">
          <h3>Cart preview</h3>
          {cart.map((item) => <div className="summary-line" key={item.id}><span>{item.name} x{item.quantity}</span><strong>{money(item.price * item.quantity)}</strong></div>)}
          <Link className="button ghost full" to="/cart">Back to cart</Link>
        </aside>
      </div>
    </section>
  )
}

export default CheckoutPage