import { useEffect, useMemo, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ADMIN_ROUTE } from './config'
import Header from './components/layout/Header'
import MobileNav from './components/layout/MobileNav'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import TrackOrderPage from './pages/TrackOrderPage'
import StaticPage from './pages/StaticPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import CartDrawer from './components/layout/CartDrawer'
import { readCart, writeCart } from './utils/cart'

function App() {
  const [cart, setCart] = useState(readCart())
  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart])
  const [notice, setNotice] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const location = useLocation()
  const isAdminRoute = location.pathname === ADMIN_ROUTE || location.pathname.startsWith(`${ADMIN_ROUTE}/`)

  const isHome = location.pathname === '/'

  useEffect(() => {
    writeCart(cart)
  }, [cart])

  useEffect(() => {
    const onStorage = () => setCart(readCart())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function addToCart(product) {
    setCart((current) => {
      const next = [...current]
      const existing = next.find((item) => item.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        next.push({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
          image_url: product.image_url,
          fragrance: product.fragrance || '',
          category: product.category || ''
        })
      }
      return next
    })
    setNotice(`Successfully added ${product.name} to cart`)
    setIsCartOpen(true) // Auto open cart drawer when product is added
    window.setTimeout(() => setNotice(''), 2200)
  }

  function updateQuantity(productId, quantity) {
    setCart((current) => current.map((item) => (item.id === productId ? { ...item, quantity } : item)).filter((item) => item.quantity > 0))
  }

  function removeItem(productId) {
    setCart((current) => current.filter((item) => item.id !== productId))
  }

  function clearCart() {
    setCart([])
  }

  return (
    <div className={isAdminRoute ? 'app-shell admin-shell' : 'app-shell'}>
      {!isAdminRoute ? (
        <Header
          cartCount={cartCount}
          isHome={isHome}
          onCartClick={() => setIsCartOpen(true)}
        />
      ) : null}
      {!isAdminRoute && notice ? <div className="toast-banner">{notice}</div> : null}
      {!isAdminRoute ? <MobileNav cartCount={cartCount} /> : null}

      <main className={`${isAdminRoute ? 'page-wrap admin-page-wrap' : 'page-wrap'} ${isHome ? 'is-home-wrap' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeItem={removeItem} clearCart={clearCart} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} />} />
          <Route path="/order/:orderId" element={<OrderConfirmationPage clearCart={clearCart} />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/about" element={<StaticPage title="About PROPIC" description="Premium cleaning products for homes and businesses." />} />
          <Route path="/contact" element={<StaticPage title="Contact" description="Use the checkout and tracking flows to connect with the business team." />} />
          <Route path={ADMIN_ROUTE} element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdminRoute ? <Footer /> : null}

      {!isAdminRoute ? (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          addToCart={addToCart}
        />
      ) : null}
    </div>
  )
}

export default App
