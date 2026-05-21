import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/products/ProductGrid'
import { requestJson } from '../utils/api'



const SORT_OPTIONS = [
  { value: 'manual', label: 'Featured' },
  { value: 'most-relevant', label: 'Most relevant' },
  { value: 'best-selling', label: 'Best selling' },
  { value: 'title-ascending', label: 'Alphabetically, A-Z' },
  { value: 'title-descending', label: 'Alphabetically, Z-A' },
  { value: 'price-ascending', label: 'Price, low to high' },
  { value: 'price-descending', label: 'Price, high to low' },
  { value: 'created-ascending', label: 'Date, old to new' },
  { value: 'created-descending', label: 'Date, new to old' }
]

function ProductsPage({ addToCart }) {
  const [products, setProducts] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedAvailability, setSelectedAvailability] = useState([])
  const [sortBy, setSortBy] = useState('manual')
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [displayLimit, setDisplayLimit] = useState(12)

  // Fetch products
  useEffect(() => {
    requestJson('/api/products').then(setProducts).catch(() => setProducts([]))
  }, [])

  // Lock scroll when filter drawer is open
  useEffect(() => {
    if (!isFilterDrawerOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isFilterDrawerOpen])

  // Get unique categories present in seed
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort()
  }, [products])

  // Toggle handlers
  function toggleCategory(cat) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }



  function toggleAvailability(status) {
    setSelectedAvailability((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  function clearAllFilters() {
    setSelectedCategories([])
    setSelectedAvailability([])
  }

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category))
    }



    // Availability Filter
    if (selectedAvailability.length > 0) {
      result = result.filter((p) => {
        const isStocked = p.stock > 0
        if (selectedAvailability.includes('in-stock') && isStocked) return true
        if (selectedAvailability.includes('out-of-stock') && !isStocked) return true
        return false
      })
    }

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'title-ascending') return a.name.localeCompare(b.name)
      if (sortBy === 'title-descending') return b.name.localeCompare(a.name)
      if (sortBy === 'price-ascending') return a.price - b.price
      if (sortBy === 'price-descending') return b.price - a.price
      if (sortBy === 'created-ascending') return a.id - b.id
      if (sortBy === 'created-descending') return b.id - a.id
      if (sortBy === 'best-selling') return (b.review_count || 0) - (a.review_count || 0)
      
      // Default: manual / most-relevant (featured first)
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.id - a.id
    })
  }, [products, selectedCategories, selectedAvailability, sortBy])

  // Paginated List to Render
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayLimit)
  }, [filteredProducts, displayLimit])

  const activeSortLabel = useMemo(() => {
    return SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || 'Featured'
  }, [sortBy])

  const totalActiveFilters = selectedCategories.length + selectedAvailability.length

  return (
    <section className="shopify-section-collection">
      {/* Breadcrumbs & Header Banner Section */}
      <div className="shopify-richtext-banner">
        <nav className="breadcrumbs" role="navigation" aria-label="breadcrumbs">
          <Link to="/">Home</Link>
          <span className="divider">/</span>
          <span className="inactive">shop it all</span>
        </nav>
        
        <h1 className="collection-title">shop it all</h1>
        <p className="collection-subtitle">discover a rainbow of products for homes + humans.</p>
      </div>

      {/* Toolbar Options */}
      <div className="collection-toolbar">
        <div className="product-count-label">
          <strong>{filteredProducts.length} products</strong>
        </div>

        <div className="toolbar-controls">
          {/* Custom Filter Button */}
          <button
            type="button"
            className="filter-toggle-btn"
            onClick={() => setIsFilterDrawerOpen(true)}
          >
            filter
            <svg className="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="2" y1="14" x2="6" y2="14" />
              <line x1="10" y1="8" x2="14" y2="8" />
              <line x1="18" y1="16" x2="22" y2="16" />
            </svg>
          </button>

          {/* Custom Sort Dropdown Button */}
          <div className="sort-dropdown-container">
            <button
              type="button"
              className="sort-toggle-btn"
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              sort by: {activeSortLabel.toLowerCase()}
              <svg className={`chevron-icon ${isSortOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isSortOpen && (
              <>
                <div className="sort-popover-backdrop" onClick={() => setIsSortOpen(false)} />
                <ul className="sort-dropdown-list">
                  {SORT_OPTIONS.map((opt) => (
                    <li
                      key={opt.value}
                      className={`sort-option ${sortBy === opt.value ? 'active' : ''}`}
                      onClick={() => {
                        setSortBy(opt.value)
                        setIsSortOpen(false)
                      }}
                    >
                      <span className="check-icon-wrap">
                        {sortBy === opt.value && (
                          <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      {opt.label.toLowerCase()}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {totalActiveFilters > 0 && (
        <div className="active-filter-chips">
          {selectedCategories.map((cat) => (
            <span key={cat} className="filter-chip">
              {cat}
              <button type="button" className="remove-chip-btn" onClick={() => toggleCategory(cat)}>×</button>
            </span>
          ))}

          {selectedAvailability.map((status) => (
            <span key={status} className="filter-chip">
              {status === 'in-stock' ? 'in stock' : 'out of stock'}
              <button type="button" className="remove-chip-btn" onClick={() => toggleAvailability(status)}>×</button>
            </span>
          ))}
          <button type="button" className="clear-all-chips-btn" onClick={clearAllFilters}>
            clear filters
          </button>
        </div>
      )}

      {/* Products Results */}
      <div className="collection-products-column">
        <ProductGrid products={displayedProducts} addToCart={addToCart} />
        
        {/* Pagination Section */}
        {filteredProducts.length > displayedProducts.length && (
          <div className="collection-pagination-section">
            <p className="pagination-count-label">
              showing {displayedProducts.length} of {filteredProducts.length} results
            </p>
            <button
              type="button"
              className="button primary load-more-btn"
              onClick={() => setDisplayLimit((prev) => prev + 12)}
            >
              load more products
            </button>
          </div>
        )}
      </div>

      {/* Premium Filter Drawer Overlay */}
      {isFilterDrawerOpen && (
        <div className="filter-drawer-backdrop" onClick={() => setIsFilterDrawerOpen(false)}>
          <div className="filter-drawer" onClick={(e) => e.stopPropagation()}>
            <header className="filter-drawer-header">
              <button
                type="button"
                className="filter-drawer-close"
                onClick={() => setIsFilterDrawerOpen(false)}
                aria-label="Close Filter Drawer"
              >
                ×
              </button>
            </header>

            <div className="filter-drawer-body">
              {/* Accordion 1: Product Type */}
              <div className="filter-accordion">
                <details open className="filter-details-block">
                  <summary className="filter-accordion-summary">
                    <span>product type</span>
                    <svg className="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>

                  <div className="accordion-collapsible-content">
                    <fieldset className="checkbox-filter-group">
                      {categories.map((cat) => {
                        const isChecked = selectedCategories.includes(cat)
                        return (
                          <label key={cat} className="filter-checkbox-label">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleCategory(cat)}
                            />
                            <span className="custom-check-box" />
                            <span>{cat}</span>
                          </label>
                        )
                      })}
                    </fieldset>
                  </div>
                </details>
              </div>



              {/* Accordion 3: Availability */}
              <div className="filter-accordion">
                <details open className="filter-details-block">
                  <summary className="filter-accordion-summary">
                    <span>availability</span>
                    <svg className="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>

                  <div className="accordion-collapsible-content">
                    <fieldset className="checkbox-filter-group">
                      <label className="filter-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedAvailability.includes('in-stock')}
                          onChange={() => toggleAvailability('in-stock')}
                        />
                        <span className="custom-check-box" />
                        <span>in stock</span>
                      </label>
                      <label className="filter-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedAvailability.includes('out-of-stock')}
                          onChange={() => toggleAvailability('out-of-stock')}
                        />
                        <span className="custom-check-box" />
                        <span>out of stock</span>
                      </label>
                    </fieldset>
                  </div>
                </details>
              </div>
            </div>

            {/* Filter Drawer Sticky Footer */}
            <footer className="filter-drawer-footer">
              <button
                type="button"
                className="button primary see-products-btn"
                onClick={() => setIsFilterDrawerOpen(false)}
              >
                see products {filteredProducts.length}
              </button>
              <button
                type="button"
                className="button outline clear-filters-btn"
                onClick={clearAllFilters}
              >
                clear filters
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductsPage