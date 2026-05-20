import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { loadAdminOrderDetails, loadAdminOrders, updateAdminOrderStatus } from '../utils/adminApi'
import { money } from '../utils/format'
import './AdminOrdersPage.css'

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

function AdminOrdersPage() {
  const { token } = useOutletContext()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [phoneQuery, setPhoneQuery] = useState('')

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')
  }

  async function refreshOrders() {
    setIsLoading(true)
    try {
      setOrders(await loadAdminOrders(token))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshOrders()
  }, [token])

  async function openOrderDetails(orderId) {
    setSelectedOrder(await loadAdminOrderDetails(token, orderId))
  }

  async function updateStatus(orderId, status) {
    await updateAdminOrderStatus(token, orderId, status)
    await refreshOrders()
  }

  async function printOrder(orderId) {
    const details = await loadAdminOrderDetails(token, orderId)
    const { order, items } = details

    const itemRows = items.map((item) => {
      const lineTotal = Number(item.price || 0) * Number(item.quantity || 0)
      return `
        <tr>
          <td>${escapeHtml(item.product_name || 'Product')}</td>
          <td>${escapeHtml(item.quantity || 0)}</td>
          <td>${escapeHtml(money(item.price || 0))}</td>
          <td>${escapeHtml(money(lineTotal))}</td>
        </tr>
      `
    }).join('')

    const createdAt = order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'

    const printHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Order #${escapeHtml(order.id)}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
            h1 { margin: 0 0 10px; font-size: 28px; }
            h2 { margin: 0 0 12px; font-size: 18px; }
            .meta { margin: 0 0 14px; }
            .meta p { margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 14px; }
            th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
            th { background: #f3f4f6; }
            .total { margin-top: 16px; font-size: 18px; font-weight: 700; text-align: right; }
          </style>
        </head>
        <body>
          <h1>PROPIC Order Receipt</h1>
          <h2>Order #${escapeHtml(order.id)}</h2>

          <div class="meta">
            <p><strong>Customer:</strong> ${escapeHtml(order.first_name || '')} ${escapeHtml(order.last_name || '')}</p>
            <p><strong>Mobile:</strong> ${escapeHtml(order.phone || 'N/A')}</p>
            <p><strong>Email:</strong> ${escapeHtml(order.email || 'N/A')}</p>
            <p><strong>Status:</strong> ${escapeHtml(order.status || 'N/A')}</p>
            <p><strong>Date:</strong> ${escapeHtml(createdAt)}</p>
            <p><strong>Address:</strong> ${escapeHtml(order.address || 'N/A')}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>

          <p class="total">Grand Total: ${escapeHtml(money(order.total_amount || 0))}</p>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `

    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    iframe.setAttribute('aria-hidden', 'true')
    document.body.appendChild(iframe)

    const iframeDoc = iframe.contentWindow?.document
    if (!iframeDoc || !iframe.contentWindow) {
      document.body.removeChild(iframe)
      window.alert('Unable to open print preview. Please try again.')
      return
    }

    iframe.onload = () => {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
      window.setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
      }, 1000)
    }

    iframeDoc.open()
    iframeDoc.write(printHtml)
    iframeDoc.close()
  }

  const normalizedPhoneQuery = phoneQuery.trim().toLowerCase()
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPhone = !normalizedPhoneQuery || String(order.phone || '').toLowerCase().includes(normalizedPhoneQuery)
    return matchesStatus && matchesPhone
  })

  return (
    <div className="admin-orders-page stack">
      <div className="card-panel admin-page-panel">
        <div className="row-between">
          <div>
            <h2 className="admin-section-title">Orders</h2>
          </div>
        </div>

        <div className="admin-order-filters">
          <label className="admin-filter-field">
            <span>Status</span>
            <select className="field" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>

          <label className="admin-filter-field">
            <span>Search by mobile</span>
            <input
              className="field"
              type="text"
              value={phoneQuery}
              onChange={(event) => setPhoneQuery(event.target.value)}
              placeholder="Enter mobile number"
            />
          </label>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="empty-table inline-loader">
                    <span className="loading-spinner" aria-hidden="true" />
                    <span>Loading orders...</span>
                  </td>
                </tr>
              ) : filteredOrders.length ? filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.first_name} {order.last_name}</td>
                  <td>{order.email || 'N/A'}</td>
                  <td>{order.phone || 'N/A'}</td>
                  <td>{money(order.total_amount)}</td>
                  <td>
                    <select className="field compact" value={order.status} onChange={(event) => updateStatus(order.id, event.target.value)}>
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>{order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</td>
                  <td>
                    <div className="table-actions">
                      <button className="mini-btn" type="button" onClick={() => openOrderDetails(order.id)}>View</button>
                      <button className="mini-btn" type="button" onClick={() => printOrder(order.id)}>Print</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="empty-table">No orders match this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder ? (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="row-between">
              <h3>Order #{selectedOrder.order.id}</h3>
              <button className="mini-btn" type="button" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
            <p>{selectedOrder.order.first_name} {selectedOrder.order.last_name}</p>
            <p>{selectedOrder.order.email} | {selectedOrder.order.phone}</p>
            <p>{selectedOrder.order.address}</p>
            <div className="stack">
              {selectedOrder.items.map((item) => (
                <div className="summary-line" key={item.id}>
                  <span>{item.product_name} x {item.quantity}</span>
                  <strong>{money(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AdminOrdersPage