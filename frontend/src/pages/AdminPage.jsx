import { useEffect, useState } from 'react'
import { API_BASE } from '../config'
import AdminSidebar from '../components/layout/AdminSidebar'
import { requestJson } from '../utils/api'
import { money } from '../utils/format'

const PRODUCT_CATEGORIES = [
  'New Launches',
  'New Launches of Experts',
  'Mega Value Packs',
  'Cleaning',
  'Personal Care',
  'Essentials',
  'Kitchen',
  'Bathroom',
  'Laundry',
  'Other',
]

function AdminPage() {
  const [token, setToken] = useState(sessionStorage.getItem('adminToken') || '')
  const [gate, setGate] = useState(token ? 'ready' : 'lock')
  const [summary, setSummary] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [editing, setEditing] = useState(null)
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    categoryCustom: '',
    stock: '0',
    featured: false,
  })

  async function loadAdminData(secret = token) {
    const headers = { 'X-Admin-Token': secret }
    const [summaryData, productData, orderData] = await Promise.all([
      requestJson('/api/admin/summary', { headers }),
      requestJson('/api/admin/products', { headers }),
      requestJson('/api/admin/orders', { headers }),
    ])
    setSummary(summaryData)
    setProducts(productData)
    setOrders(orderData)
  }

  useEffect(() => {
    if (token) {
      loadAdminData().catch(() => setGate('lock'))
    }
  }, [token])

  async function unlock(event) {
    event.preventDefault()
    sessionStorage.setItem('adminToken', token)
    setGate('ready')
    try {
      await loadAdminData(token)
    } catch (error) {
      setMessage(error.message)
    }
  }

  function logout() {
    sessionStorage.removeItem('adminToken')
    setToken('')
    setGate('lock')
    setSummary(null)
    setProducts([])
    setOrders([])
    setEditing(null)
    setProductModalOpen(false)
    setSelectedOrder(null)
    setMessage('You have been logged out.')
  }

  function jumpToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function jumpToDashboard() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openProductModal(product = null) {
    setMessage('')
    setEditing(product)
    setForm(product ? {
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: PRODUCT_CATEGORIES.includes(product.category) ? product.category : (product.category ? 'Other' : ''),
      categoryCustom: PRODUCT_CATEGORIES.includes(product.category) ? '' : (product.category || ''),
      stock: product.stock,
      featured: !!product.featured,
    } : {
      name: '',
      description: '',
      price: '',
      category: '',
      categoryCustom: '',
      stock: '0',
      featured: false,
    })
    setProductModalOpen(true)
  }

  function closeProductModal() {
    setProductModalOpen(false)
    setEditing(null)
    setMessage('')
    setForm({ name: '', description: '', price: '', category: '', categoryCustom: '', stock: '0', featured: false })
  }

  async function saveProduct(event) {
    event.preventDefault()
    const category = form.category === 'Other' ? form.categoryCustom.trim() : form.category.trim()
    if (!category) {
      setMessage('Please choose a category')
      return
    }

    setMessage('')
    const payload = new FormData()
    payload.append('name', form.name)
    payload.append('description', form.description)
    payload.append('price', form.price)
    payload.append('category', category)
    payload.append('stock', form.stock)
    payload.append('featured', form.featured ? 'on' : '')
    if (form.image) payload.append('image', form.image)

    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products'

    const response = await fetch(`${API_BASE}${url}`, {
      method,
      headers: { 'X-Admin-Token': token },
      body: payload,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || 'Unable to save product')
    }

    closeProductModal()
    await loadAdminData()
  }

  async function removeProduct(productId) {
    await fetch(`${API_BASE}/api/admin/products/${productId}`, { method: 'DELETE', headers: { 'X-Admin-Token': token } })
    await loadAdminData()
  }

  async function openOrderDetails(orderId) {
    const data = await requestJson(`/api/admin/orders/${orderId}`, { headers: { 'X-Admin-Token': token } })
    setSelectedOrder(data)
  }

  async function updateStatus(orderId, status) {
    await requestJson(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'X-Admin-Token': token },
      body: JSON.stringify({ status }),
    })
    await loadAdminData()
  }

  if (gate !== 'ready') {
    return (
      <section className="card-panel private-gate">
        <h1>Private admin portal</h1>
        <p>This URL is intentionally not linked from the public site.</p>
        <form onSubmit={unlock} className="stack">
          <input className="field" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Admin token" required />
          <button className="button primary" type="submit">Unlock</button>
        </form>
        {message ? <div className="error-text">{message}</div> : null}
      </section>
    )
  }

  return (
    <section className="admin-shell">
      <div className="admin-layout">
        <AdminSidebar
          onJumpToDashboard={jumpToDashboard}
          onAddProduct={() => openProductModal()}
          onLogout={logout}
          onJumpToProducts={() => jumpToSection('admin-products')}
          onJumpToOrders={() => jumpToSection('admin-orders')}
        />

        <div className="admin-content">
          <header className="admin-page-header">
            <span className="admin-page-kicker">PROPIC WEB</span>
            <h1>Admin portal</h1>
            <p>Product CRUD and order controls over the shared API</p>
          </header>

          <div className="admin-summary-banner card-panel" id="admin-dashboard">
            <div className="admin-summary-copy">
              <span className="admin-summary-kicker">Dashboard overview</span>
              <h2>Operations at a glance</h2>
              <p>Monitor product inventory, active orders and revenue from a single polished control center.</p>
              <strong>{summary?.total_orders ?? 0}</strong>
              <span>Total orders</span>
            </div>

            <div className="admin-summary-metrics">
              <div className="admin-summary-metric metric-green">
                <strong>{summary?.total_products ?? 0}</strong>
                <span>Products</span>
              </div>
              <div className="admin-summary-metric metric-blue">
                <strong>{summary?.pending_orders ?? 0}</strong>
                <span>Pending</span>
              </div>
              <div className="admin-summary-metric metric-red">
                <strong>{summary?.total_orders ?? 0}</strong>
                <span>Orders</span>
              </div>
              <div className="admin-summary-metric metric-amber">
                <strong>{money(summary?.total_revenue ?? 0)}</strong>
                <span>Revenue</span>
              </div>
            </div>
          </div>

          <div className="admin-grid">
            <div className="card-panel" id="admin-products">
              <div className="row-between">
                <h3>Products list</h3>
                <button className="button primary" type="button" onClick={() => openProductModal()}>
                  Add product
                </button>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length ? products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          <strong>{product.name}</strong>
                          <div className="muted-cell">{product.description?.slice(0, 50) || 'No description'}</div>
                        </td>
                        <td>{product.category || 'N/A'}</td>
                        <td>{money(product.price)}</td>
                        <td>{product.stock}</td>
                        <td>{product.featured ? 'Yes' : 'No'}</td>
                        <td>
                          <div className="table-actions">
                            <button className="mini-btn" type="button" onClick={() => openProductModal(product)}>Edit</button>
                            <button className="mini-btn danger" type="button" onClick={() => removeProduct(product.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="7" className="empty-table">No products found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-panel" id="admin-orders">
              <h3>Orders list</h3>
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
                    {orders.length ? orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.first_name} {order.last_name}</td>
                        <td>{order.email || 'N/A'}</td>
                        <td>{order.phone || 'N/A'}</td>
                        <td>{money(order.total_amount)}</td>
                        <td>
                          <select className="field compact" value={order.status} onChange={(event) => updateStatus(order.id, event.target.value)}>
                            <option value="pending">pending</option>
                            <option value="processing">processing</option>
                            <option value="shipped">shipped</option>
                            <option value="delivered">delivered</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                        </td>
                        <td>{order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</td>
                        <td>
                          <div className="table-actions">
                            <button className="mini-btn" type="button" onClick={() => openOrderDetails(order.id)}>View</button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="8" className="empty-table">No orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </div>
        </div>

      {productModalOpen ? (
        <div className="modal-backdrop" onClick={closeProductModal}>
          <div className="modal-card product-modal" onClick={(event) => event.stopPropagation()}>
            <div className="row-between">
              <h3>{editing ? 'Edit product' : 'Add product'}</h3>
              <button className="mini-btn" type="button" onClick={closeProductModal}>Close</button>
            </div>
            <form className="stack" onSubmit={saveProduct}>
              <div className="form-grid">
                <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Name" required />
                <select className="field" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value, categoryCustom: event.target.value === 'Other' ? form.categoryCustom : '' })}>
                  <option value="">Select category</option>
                  {PRODUCT_CATEGORIES.map((categoryName) => (
                    <option key={categoryName} value={categoryName}>{categoryName}</option>
                  ))}
                </select>
                <input className="field" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Price" required />
                <input className="field" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} placeholder="Stock" />
              </div>
              {form.category === 'Other' ? (
                <input
                  className="field"
                  value={form.categoryCustom}
                  onChange={(event) => setForm({ ...form, categoryCustom: event.target.value })}
                  placeholder="Enter custom category"
                />
              ) : null}
              <textarea className="field" rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" />
              <input className="field" type="file" onChange={(event) => setForm({ ...form, image: event.target.files?.[0] })} />
              <label className="check-row"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Featured product</label>
              <div className="hero-actions">
                <button className="button primary" type="submit">{editing ? 'Update' : 'Create'}</button>
                <button className="button ghost" type="button" onClick={closeProductModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

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
    </section>
  )
}

export default AdminPage