import { NavLink } from 'react-router-dom'

function MobileNav({ cartCount }) {
  return (
    <nav className="mobile-nav">
      <NavLink to="/" aria-label="Home" title="Home">
        <span className="nav-icon" aria-hidden="true">&#8962;</span>
        <span className="sr-only">Home</span>
      </NavLink>
      <NavLink to="/products" aria-label="Products" title="Products">
        <span className="nav-icon" aria-hidden="true">&#9638;</span>
        <span className="sr-only">Products</span>
      </NavLink>
      <NavLink to="/track-order" aria-label="Track Order" title="Track Order">
        <span className="nav-icon" aria-hidden="true">&#8982;</span>
        <span className="sr-only">Track Order</span>
      </NavLink>
      <NavLink to="/cart" className="cart-pill" aria-label="Cart" title="Cart">
        <span className="nav-icon" aria-hidden="true">&#128722;</span>
        <span className="mobile-cart-count" aria-hidden="true">{cartCount}</span>
        <span className="sr-only">Cart {cartCount}</span>
      </NavLink>
    </nav>
  )
}

export default MobileNav