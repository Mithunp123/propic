import { useState } from 'react'
import { money } from '../../utils/format'
import { getProductImageUrls, resolveMediaUrl } from '../../utils/api'

function ProductCard({ product, onOpenViewer, addToCart }) {
  const imageUrls = getProductImageUrls(product)
  const primaryImageUrl = imageUrls[0] || ''
  const description = product.description || 'Professional cleaning solution.'

  return (
    <div className="showcase-card">
      <div className="showcase-image">
        {primaryImageUrl ? (
          <button
            type="button"
            className="showcase-image-trigger"
            onClick={() => onOpenViewer(product, 0)}
            aria-label={`Open ${product.name} image gallery`}
          >
            <div className="showcase-image-main">
              <img src={resolveMediaUrl(primaryImageUrl)} alt={product.name} />
            </div>
          </button>
        ) : (
          <div className="showcase-image-empty">🧴</div>
        )}
      </div>
      <div className="showcase-content">
        <span className="category">{product.category || 'General'}</span>
        <h3>{product.name}</h3>
        <p className="showcase-description">{description}</p>
        <button
          type="button"
          className="showcase-details-trigger"
          onClick={() => onOpenViewer(product, 0, true)}
        >
          View full info
        </button>
        <strong>{money(product.price)}</strong>
        <button
          className="button primary"
          style={{ width: '100%', padding: '10px' }}
          onClick={() => addToCart(product)}
        >
          Add to cart
        </button>
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