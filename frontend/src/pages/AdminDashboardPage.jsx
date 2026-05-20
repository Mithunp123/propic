import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { loadAdminSummary } from '../utils/adminApi'
import { money } from '../utils/format'
import './AdminDashboardPage.css'

function AdminDashboardPage() {
  const { token } = useOutletContext()
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    loadAdminSummary(token).then(setSummary).catch(() => setSummary(null)).finally(() => setIsLoading(false))
  }, [token])

  const totalOrders = summary?.total_orders ?? 0
  const totalProducts = summary?.total_products ?? 0
  const pendingOrders = summary?.pending_orders ?? 0
  const totalRevenue = summary?.total_revenue ?? 0
  const fulfilledOrders = Math.max(totalOrders - pendingOrders, 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  if (isLoading) {
    return (
      <div className="admin-dashboard-page">
        <div className="card-panel inline-loader" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-summary-banner card-panel">
        <div className="admin-summary-copy">
          <span className="admin-summary-kicker">Overview</span>
          <h2>Store summary</h2>
          <p className="admin-summary-note">Quick snapshot of orders, products, and revenue.</p>
          <strong>{totalOrders}</strong>
          <span>Total orders</span>
        </div>

        <div className="admin-summary-metrics">
          <div className="admin-summary-metric metric-green">
            <strong>{totalProducts}</strong>
            <span>Products</span>
          </div>
          <div className="admin-summary-metric metric-blue">
            <strong>{pendingOrders}</strong>
            <span>Pending</span>
          </div>
          <div className="admin-summary-metric metric-red">
            <strong>{fulfilledOrders}</strong>
            <span>Fulfilled</span>
          </div>
          <div className="admin-summary-metric metric-amber">
            <strong>{money(totalRevenue)}</strong>
            <span>Revenue</span>
          </div>
        </div>
      </div>

      <div className="admin-insights-grid">
        <article className="admin-insight-card card-panel">
          <p className="insight-label">Catalog</p>
          <h3>{totalProducts}</h3>
          <p className="insight-help">Total active products in your store catalog.</p>
        </article>

        <article className="admin-insight-card card-panel">
          <p className="insight-label">Order queue</p>
          <h3>{pendingOrders}</h3>
          <p className="insight-help">Orders waiting for packing, dispatch, or status update.</p>
        </article>

        <article className="admin-insight-card card-panel">
          <p className="insight-label">Average order value</p>
          <h3>{money(avgOrderValue)}</h3>
          <p className="insight-help">Average revenue earned per order so far.</p>
        </article>
      </div>
    </div>
  )
}

export default AdminDashboardPage