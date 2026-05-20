import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { deleteAdminProduct, loadAdminProducts, saveAdminProduct } from '../utils/adminApi'
import { money } from '../utils/format'
import './AdminProductsPage.css'

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

function AdminProductsPage() {
  const { token } = useOutletContext()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [nameQuery, setNameQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    categoryCustom: '',
    stock: '0',
    featured: false,
    imageFiles: [],
  })

  async function refreshProducts() {
    setIsLoading(true)
    try {
      setProducts(await loadAdminProducts(token))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshProducts()
  }, [token])

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
      imageFiles: [],
    } : {
      name: '',
      description: '',
      price: '',
      category: '',
      categoryCustom: '',
      stock: '0',
      featured: false,
      imageFiles: [],
    })
    setProductModalOpen(true)
  }

  function closeProductModal() {
    setProductModalOpen(false)
    setEditing(null)
    setMessage('')
  }

  async function saveProduct(event) {
    event.preventDefault()
    const category = form.category === 'Other' ? form.categoryCustom.trim() : form.category.trim()
    if (!category) {
      setMessage('Please choose a category')
      return
    }

    const existingImageCount = editing
      ? (editing.image_urls?.length || (editing.image_url ? 1 : 0))
      : 0
    if (!existingImageCount && !form.imageFiles.length) {
      setMessage('Please upload at least one product image')
      return
    }

    try {
      await saveAdminProduct(token, editing?.id, { ...form, category })
      await refreshProducts()
      closeProductModal()
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function removeProduct(productId) {
    await deleteAdminProduct(token, productId)
    await refreshProducts()
  }

  const categoryOptions = Array.from(new Set(products.map((product) => (product.category || 'N/A').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b))
  const normalizedNameQuery = nameQuery.trim().toLowerCase()
  const filteredProducts = products.filter((product) => {
    const productCategory = (product.category || 'N/A').trim() || 'N/A'
    const matchesCategory = categoryFilter === 'all' || productCategory === categoryFilter
    const matchesName = !normalizedNameQuery || String(product.name || '').toLowerCase().includes(normalizedNameQuery)
    return matchesCategory && matchesName
  })

  return (
    <div className="admin-products-page stack">
      <div className="card-panel admin-page-panel">
        <div className="row-between">
          <div>
            <h2 className="admin-section-title">Products</h2>
          </div>
          <button className="button primary" type="button" onClick={() => openProductModal()}>Add product</button>
        </div>

        <div className="admin-product-filters">
          <label className="admin-product-filter-field">
            <span>Category</span>
            <select className="field" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">All categories</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className="admin-product-filter-field">
            <span>Search by name</span>
            <input
              className="field"
              type="text"
              value={nameQuery}
              onChange={(event) => setNameQuery(event.target.value)}
              placeholder="Enter product name"
            />
          </label>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Images</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="empty-table inline-loader">
                    <span className="loading-spinner" aria-hidden="true" />
                    <span>Loading products...</span>
                  </td>
                </tr>
              ) : filteredProducts.length ? filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <strong>{product.name}</strong>
                    <div className="muted-cell">{product.description?.slice(0, 50) || 'No description'}</div>
                  </td>
                  <td>{product.category || 'N/A'}</td>
                  <td>{money(product.price)}</td>
                  <td>{(product.image_urls?.length || (product.image_url ? 1 : 0))} image{(product.image_urls?.length || (product.image_url ? 1 : 0)) === 1 ? '' : 's'}</td>
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
                  <td colSpan="8" className="empty-table">No products match this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {message ? <div className="error-text">{message}</div> : null}
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
                <input className="field" value={form.categoryCustom} onChange={(event) => setForm({ ...form, categoryCustom: event.target.value })} placeholder="Enter custom category" />
              ) : null}
              <textarea className="field" rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" />
              <div className="stack">
                <input
                  className="field"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setForm({ ...form, imageFiles: Array.from(event.target.files || []) })}
                />
                <p className="muted-cell">
                  {editing
                    ? 'New uploads will be added to the existing product images.'
                    : 'You can select multiple images for the new product.'}
                </p>
                {editing ? (
                  <p className="muted-cell">
                    Existing images: {editing.image_urls?.length || (editing.image_url ? 1 : 0)}
                  </p>
                ) : null}
                {form.imageFiles.length ? (
                  <div className="admin-image-list">
                    {form.imageFiles.map((file) => (
                      <span key={file.name}>{file.name}</span>
                    ))}
                  </div>
                ) : null}
              </div>
              <label className="check-row"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Featured product</label>
              <div className="hero-actions">
                <button className="button primary" type="submit">{editing ? 'Update' : 'Create'}</button>
                <button className="button ghost" type="button" onClick={closeProductModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AdminProductsPage