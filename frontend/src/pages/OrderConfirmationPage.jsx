import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { requestJson } from '../utils/api'
import { money } from '../utils/format'

function OrderConfirmationPage({ clearCart }) {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    requestJson(`/api/orders/${orderId}`).then((data) => {
      setOrder(data)
      clearCart()
    }).catch(() => setOrder(false))
  }, [orderId, clearCart])

  if (order === null) return <div className="empty-state">Loading order...</div>
  if (order === false) return <div className="empty-state">Order not found.</div>

  return (
    <section className="card-panel">
      <h1>Order confirmed</h1>
      <p>Order #{order.order_id} has been placed.</p>
      <div className="stack">
        {order.order_items.map((item, index) => <div className="summary-line" key={index}><span>{item.name} x{item.quantity}</span><strong>{money(item.price * item.quantity)}</strong></div>)}
      </div>
      <Link className="button primary" to="/">Back to home</Link>
    </section>
  )
}

export default OrderConfirmationPage