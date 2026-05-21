import { useState } from 'react'
import { money } from '../../utils/format'
import { getProductImageUrls, resolveMediaUrl } from '../../utils/api'

function ProductCard({ product, onOpenViewer, addToCart }) {
  const imageUrls = getProductImageUrls(product)
  const primaryImageUrl = imageUrls[0] || ''

  return (
    <div className="product-showcase-card">
      <div className="product-image-container">
        {product.badge && (
          <span className={`product-badge-bubble ${product.badge.toLowerCase()}`}>
            {product.badge}
          </span>
        )}
        {primaryImageUrl ? (
          <button
            type="button"
            className="product-image-link"
            onClick={() => onOpenViewer(product, 0)}
            aria-label={`Open ${product.name} image gallery`}
          >
            <img src={resolveMediaUrl(primaryImageUrl)} alt={product.name} className="product-main-img" />
          </button>
        ) : (
          <div className="product-image-empty">🧴</div>
        )}

        {/* Add to Cart Button moved to price row for right-of-price placement */}
      </div>
      
      <div className="product-card-details">
        {/* Rating Row */}
        <div className="product-card-rating">
          <span className="stars-fill">★ ★ ★ ★ ★</span>
          <span className="review-count">({product.review_count || 0})</span>
        </div>

        {/* Title */}
        <h3 className="product-card-title" onClick={() => onOpenViewer(product, 0, true)}>
          {product.name ? product.name.toLowerCase() : ''}
        </h3>

        {/* Price Row */}
        <div className="product-price-container">
          {product.original_price && (
            <span className="price-compare">{money(product.original_price)}</span>
          )}
          <span className="price-current">{money(product.price)}</span>

          <button
            className="product-add-to-cart-btn"
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            add to cart
          </button>
        </div>
      </div>
    </div>
  )
}

function ProductGrid({ products, addToCart }) {
  const [viewer, setViewer] = useState(null)
  const [detailsProduct, setDetailsProduct] = useState(null)

  if (!products.length) {
    return <div className="empty-state">No products available yet.</div>
  }

  function openViewer(product, index, openDetails = false) {
    if (openDetails) {
      setDetailsProduct(product)
      return
    }
    const imageUrls = getProductImageUrls(product)
    if (!imageUrls.length) return
    setViewer({ product, imageUrls, activeIndex: Math.max(0, Math.min(index, imageUrls.length - 1)) })
  }

  function closeViewer() {
    setViewer(null)
  }

  function closeDetails() {
    setDetailsProduct(null)
  }

  function selectViewerImage(index) {
    setViewer((current) => {
      if (!current) return current
      return { ...current, activeIndex: Math.max(0, Math.min(index, current.imageUrls.length - 1)) }
    })
  }

  function stepViewer(offset) {
    setViewer((current) => {
      if (!current || current.imageUrls.length <= 1) return current
      const nextIndex = (current.activeIndex + offset + current.imageUrls.length) % current.imageUrls.length
      return { ...current, activeIndex: nextIndex }
    })
  }

  return (
    <>
      <div className="showcase-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenViewer={openViewer}
            addToCart={addToCart}
          />
        ))}
      </div>

      {viewer ? (
        <div className="showcase-lightbox-backdrop" onClick={closeViewer}>
          <div className="showcase-lightbox" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="showcase-lightbox-close" onClick={closeViewer} aria-label="Close gallery">×</button>

            <div className="showcase-lightbox-main">
              <img
                src={resolveMediaUrl(viewer.imageUrls[viewer.activeIndex])}
                alt={`${viewer.product.name} - image ${viewer.activeIndex + 1}`}
              />

              {viewer.imageUrls.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="showcase-lightbox-nav prev"
                    onClick={() => stepViewer(-1)}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="showcase-lightbox-nav next"
                    onClick={() => stepViewer(1)}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              ) : null}
            </div>

            {viewer.imageUrls.length > 1 ? (
              <div className="showcase-lightbox-thumbs" aria-label={`${viewer.product.name} gallery thumbnails`}>
                {viewer.imageUrls.map((imageUrl, index) => (
                  <button
                    key={`${viewer.product.id}-viewer-${imageUrl}-${index}`}
                    type="button"
                    className={`showcase-thumb${index === viewer.activeIndex ? ' active' : ''}`}
                    onClick={() => selectViewerImage(index)}
                    aria-label={`Show image ${index + 1}`}
                  >
                    <img src={resolveMediaUrl(imageUrl)} alt="" aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {detailsProduct ? (
        <div className="showcase-lightbox-backdrop" onClick={closeDetails}>
          <div className="showcase-details-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="showcase-lightbox-close"
              onClick={closeDetails}
              aria-label="Close product details"
            >
              ×
            </button>
            <span className="category">{detailsProduct.category || 'General'}</span>
            <h3>{detailsProduct.name}</h3>
            <p>{detailsProduct.description || 'Professional cleaning solution.'}</p>
            <strong>{money(detailsProduct.price)}</strong>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ProductGrid