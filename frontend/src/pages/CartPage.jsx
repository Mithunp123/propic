import { Link } from 'react-router-dom'
import SectionHeading from '../components/common/SectionHeading'
import { money } from '../utils/format'

function CartPage({ cart, updateQuantity, removeItem, clearCart }) {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = cart.length ? 99 : 0
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  return (
    <section>
      <SectionHeading title="Cart" subtitle="Local cart state from the React app" />
      {!cart.length ? (
        <div className="empty-state">Your cart is empty. Add products to continue.</div>
      ) : (
        <div className="cart-layout">
          <div className="stack">
            {cart.map((item) => (
              <div className="cart-row" key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>{money(item.price)}</p>
                </div>
                <div className="cart-actions-inline">
                  <button className="mini-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="mini-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button className="mini-btn danger" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <aside className="summary-card">
            <h3>Order summary</h3>
            <div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <div className="summary-line"><span>Shipping</span><strong>{money(shipping)}</strong></div>
            <div className="summary-line"><span>Tax</span><strong>{money(tax)}</strong></div>
            <div className="summary-line total"><span>Total</span><strong>{money(total)}</strong></div>
            <Link className="button primary full" to="/checkout">Proceed to checkout</Link>
            <button className="button ghost full" type="button" onClick={clearCart}>Clear cart</button>
          </aside>
        </div>
      )}
    </section>
  )
}

export default CartPage