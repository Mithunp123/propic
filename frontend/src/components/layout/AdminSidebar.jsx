import { Link, NavLink } from 'react-router-dom'
import { ADMIN_ROUTE } from '../../config'
import './AdminSidebar.css'

function AdminSidebar({ currentPath, onLogout }) {
  const isDashboard = currentPath === ADMIN_ROUTE
  const isProducts = currentPath.startsWith(`${ADMIN_ROUTE}/products`)
  const isOrders = currentPath.startsWith(`${ADMIN_ROUTE}/orders`)

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span className="admin-sidebar-badge">Admin</span>
        <h2>Control panel</h2>
      </div>

      <div className="admin-sidebar-section">
        <span className="admin-sidebar-label">Navigation</span>
        <NavLink className={({ isActive }) => `admin-nav-item${isActive || isDashboard ? ' active' : ''}`} to={ADMIN_ROUTE} end>
          Overview
        </NavLink>
        <NavLink className={({ isActive }) => `admin-nav-item${isActive || isProducts ? ' active' : ''}`} to={`${ADMIN_ROUTE}/products`}>
          Products
        </NavLink>
        <NavLink className={({ isActive }) => `admin-nav-item${isActive || isOrders ? ' active' : ''}`} to={`${ADMIN_ROUTE}/orders`}>
          Orders
        </NavLink>
      </div>

      <div className="admin-sidebar-section">
        <span className="admin-sidebar-label">Actions</span>
        <Link className="button ghost full" to="/">Back to site</Link>
        <button className="button ghost full danger-button" type="button" onClick={onLogout}>Logout</button>
      </div>
    </aside>
  )
}

export default AdminSidebar