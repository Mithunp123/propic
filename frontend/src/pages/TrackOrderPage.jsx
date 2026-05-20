import { useState } from 'react'
import SectionHeading from '../components/common/SectionHeading'
import { requestJson } from '../utils/api'
import { money } from '../utils/format'

const PHONE_REGEX = /^\d{10}$/

function TrackOrderPage() {
  const [phone, setPhone] = useState('')
  const [pincode, setPincode] = useState('')
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('idle')
  const [step, setStep] = useState('phone')
  const [verified, setVerified] = useState(false)

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

  return (
    <section className="track-shell page-wrap">
      <SectionHeading title="Track order" subtitle="Phone lookup followed by pincode verification" />
      <p className="track-help">
        Enter the phone number first. Then verify the pincode. After verification, only the order details remain.
      </p>

      <div className="track-flow">
        {step === 'phone' ? (
          <form className="card-panel track-card" onSubmit={submitPhone}>
            <div className="track-card-head">
              <span className="track-step">Step 1</span>
              <div>
                <h3>Enter phone number</h3>
                <p>Use the phone number linked to the order.</p>
              </div>
            </div>
            <div className="track-form-row">
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
              <button className="button primary" type="submit">Find orders</button>
            </div>
          </form>
        ) : null}

        {step === 'pincode' ? (
          <form className="card-panel track-card" onSubmit={verifyPincode}>
            <div className="track-card-head">
              <span className="track-step">Step 2</span>
              <div>
                <h3>Verify pincode</h3>
                <p>Enter the pincode from the latest order address.</p>
              </div>
            </div>
            <div className="track-form-row">
              <input
                className="field"
                value={pincode}
                onChange={(event) => setPincode(event.target.value)}
                placeholder="Latest order pincode"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
              <button className="button primary" type="submit">Verify</button>
            </div>
          </form>
        ) : null}
      </div>

      <div className="stack track-results-shell">
        {status === 'phone-none' ? <div className="empty-state">No orders found for that phone number.</div> : null}
        {status === 'bad-pin' ? <div className="empty-state">Incorrect pincode.</div> : null}
        {step === 'done' && verified ? (
          <div className="card-panel track-results-card">
            <h3>Verified orders</h3>
            <div className="stack">
              {orders.map((order) => (
                <div className="summary-line track-order-line" key={order.order_id}>
                  <span>Order #{order.order_id} · {order.status}</span>
                  <strong>{money(order.total_amount)}</strong>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default TrackOrderPage