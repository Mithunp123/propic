import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { money } from '../../utils/format'
import { requestJson, resolveMediaUrl, getProductImageUrls } from '../../utils/api'

function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeItem, addToCart }) {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState([])
  const [subscribedItems, setSubscribedItems] = useState({})

  // Fetch product recommendations for cross-sell
  useEffect(() => {
    if (!isOpen) return
    requestJson('/api/products')
      .then((data) => {
        // filter out items already in cart
        const cartIds = cart.map((item) => item.id)
        const filtered = data.filter((p) => !cartIds.includes(p.id))
        setRecommendations(filtered.slice(0, 4))
      })
      .catch(() => setRecommendations([]))
  }, [isOpen, cart])

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  // Shipping & Gift thresholds
  const shippingThreshold = 500
  const giftThreshold = 750

  const shippingRemaining = Math.max(0, shippingThreshold - subtotal)
  const giftRemaining = Math.max(0, giftThreshold - subtotal)

  const shippingPercent = Math.min(100, (subtotal / shippingThreshold) * 100)
  const giftPercent = Math.min(100, (subtotal / giftThreshold) * 100)

  function handleCheckout() {
    onClose()
    navigate('/checkout')
  }

  function toggleSubscription(itemId) {
    setSubscribedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <header className="cart-drawer-header">
          <h2>your cart <span className="cart-header-count">({cartCount})</span></h2>
          <button type="button" className="cart-drawer-close" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </header>

        {/* Threshold Progress Section */}
        <div className="cart-threshold-section">
          {shippingRemaining > 0 ? (
            <p className="threshold-msg">
              you are <strong>{money(shippingRemaining)}</strong> away from free shipping!
            </p>
          ) : (
            <p className="threshold-msg success">
              🎉 <strong>you've earned free shipping!</strong>
            </p>
          )}
          <div className="threshold-progress-bg">
            <div className="threshold-progress-bar" style={{ width: `${shippingPercent}%` }}></div>
            <span className="progress-dot" style={{ left: '0%' }}></span>
            <span className="progress-dot" style={{ left: '100%' }}></span>
          </div>

          {giftRemaining > 0 ? (
            <p className="threshold-msg mini-gift">
              <strong>{money(giftRemaining)}</strong> away from a <u>free body wash mini</u>!
            </p>
          ) : (
            <p className="threshold-msg success mini-gift">
              🎁 <strong>you've earned a free body wash mini!</strong>
            </p>
          )}
          <div className="threshold-progress-bg mini-gift-bar">
            <div className="threshold-progress-bar gift" style={{ width: `${giftPercent}%` }}></div>
            <span className="progress-dot" style={{ left: '0%' }}></span>
            <span className="progress-dot" style={{ left: '100%' }}></span>
          </div>
        </div>

        {/* Cart Contents */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <span className="empty-cart-icon">🛒</span>
              <h3>your cart is empty</h3>
              <p>discover a rainbow of products for homes + humans.</p>
              <button type="button" className="button primary" onClick={onClose}>
                start shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => {
                const isSubscribed = !!subscribedItems[item.id]
                const itemPrice = isSubscribed ? item.price * 0.9 : item.price
                const displayFragrance = item.fragrance ? `${item.fragrance}` : ''
                const displayDetails = item.category ? `${item.category}` : ''

                return (
                  <div key={item.id} className="cart-item-card">
                    <div className="cart-item-image">
                      {item.image_url ? (
                        <img src={resolveMediaUrl(item.image_url)} alt={item.name} />
                      ) : (
                        <div className="cart-item-image-placeholder">🧴</div>
                      )}
                    </div>
                    
                    <div className="cart-item-details">
                      <h4 className="cart-item-name">
                        {item.name}
                        {displayFragrance && (
                          <span className="cart-item-scent-detail">
                             - {displayFragrance}
                          </span>
                        )}
                      </h4>
                      <p className="cart-item-price">{money(itemPrice)}</p>

                      <div className="cart-item-actions-row">
                        <div className="cart-qty-selector">
                          <button
                            type="button"
                            className="qty-btn minus"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            —
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn plus"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="cart-item-delete-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          delete
                        </button>
                      </div>

                      {/* Subscribe & Save Actions */}
                      {item.category && item.category.includes('wash') && (
                        <button
                          type="button"
                          className={`cart-subscribe-btn ${isSubscribed ? 'active' : ''}`}
                          onClick={() => toggleSubscription(item.id)}
                        >
                          {isSubscribed ? '✓ subscribed & saved 10%' : 'subscribe & save 10%'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* More to Love Cross-Sell Carousel */}
          {recommendations.length > 0 && (
            <div className="cart-cross-sell">
              <h4 className="cross-sell-title">more to love</h4>
              <div className="cross-sell-carousel">
                {recommendations.map((prod) => (
                  <div key={prod.id} className="cross-sell-card">
                    <div className="cross-sell-image">
                      <img src={resolveMediaUrl((getProductImageUrls(prod)[0]) || prod.image_url)} alt={prod.name} />
                    </div>
                    <div className="cross-sell-content">
                      <h5>{prod.name}</h5>
                      <div className="cross-sell-footer">
                        <span>{money(prod.price)}</span>
                        <button
                          type="button"
                          className="cross-sell-add-btn"
                          onClick={() => addToCart(prod)}
                          aria-label={`Add ${prod.name} to cart`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Sticky Footer */}
        {cart.length > 0 && (
          <footer className="cart-drawer-footer">
            <div className="cart-summary-line subtotal">
              <span>subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>
            <p className="cart-tax-shipping-notice">shipping & taxes calculated at checkout</p>
            <button type="button" className="button primary full checkout-btn" onClick={handleCheckout}>
              checkout
            </button>
          </footer>
        )}

      </div>
    </div>
  )
}

export default CartDrawer
