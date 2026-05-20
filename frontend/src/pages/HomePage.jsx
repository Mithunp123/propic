import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

function HomePage({ addToCart }) {
  const scrollContainerRef = useRef(null)
  const collectionsGridRef = useRef(null)
  const thumbRef = useRef(null)

  useEffect(() => {
    const slider = collectionsGridRef.current
    if (!slider) return

    // Custom Visual Scrollbar Thumb Positioning
    const updateThumb = () => {
      const thumbEl = thumbRef.current
      if (!slider || !thumbEl) return
      
      const scrollWidth = slider.scrollWidth
      const clientWidth = slider.clientWidth
      const scrollLeft = slider.scrollLeft
      
      const maxScroll = scrollWidth - clientWidth
      const trackEl = thumbEl.parentElement
      if (!trackEl) return
      
      const trackWidth = trackEl.clientWidth
      
      // Calculate active visual ratio of visible container
      const visibleRatio = clientWidth / scrollWidth
      // Proportional thumb width, min 60px to ensure clickability
      const thumbWidth = Math.max(60, trackWidth * visibleRatio)
      
      const percent = maxScroll > 0 ? scrollLeft / maxScroll : 0
      const maxThumbLeft = trackWidth - thumbWidth
      const thumbLeft = percent * maxThumbLeft
      
      thumbEl.style.width = `${thumbWidth}px`
      thumbEl.style.transform = `translateX(${thumbLeft}px)`
    }

    slider.addEventListener('scroll', updateThumb)
    window.addEventListener('resize', updateThumb)
    
    // Slight timeout to ensure layout has compiled sizes on mount
    const timer = setTimeout(updateThumb, 50)

    // Make thumb draggable to scroll cards
    let isDraggingThumb = false
    let thumbStartX = 0
    let thumbStartScrollLeft = 0

    const onThumbMouseDown = (e) => {
      isDraggingThumb = true
      thumbStartX = e.clientX
      thumbStartScrollLeft = slider.scrollLeft
      slider.classList.add('active-dragging')
      document.addEventListener('mousemove', onThumbMouseMove)
      document.addEventListener('mouseup', onThumbMouseUp)
      e.preventDefault()
    }

    const onThumbMouseMove = (e) => {
      if (!isDraggingThumb) return
      const thumbEl = thumbRef.current
      if (!slider || !thumbEl) return
      
      const trackEl = thumbEl.parentElement
      if (!trackEl) return
      
      const deltaX = e.clientX - thumbStartX
      const trackWidth = trackEl.clientWidth
      const scrollWidth = slider.scrollWidth
      const clientWidth = slider.clientWidth
      
      const visibleRatio = clientWidth / scrollWidth
      const thumbWidth = Math.max(60, trackWidth * visibleRatio)
      const maxThumbLeft = trackWidth - thumbWidth
      if (maxThumbLeft <= 0) return
      
      const scrollRatio = (scrollWidth - clientWidth) / maxThumbLeft
      slider.scrollLeft = thumbStartScrollLeft + deltaX * scrollRatio
    }

    const onThumbMouseUp = () => {
      if (isDraggingThumb) {
        isDraggingThumb = false
        slider.classList.remove('active-dragging')
        document.removeEventListener('mousemove', onThumbMouseMove)
        document.removeEventListener('mouseup', onThumbMouseUp)
      }
    }

    const thumbEl = thumbRef.current
    if (thumbEl) {
      thumbEl.addEventListener('mousedown', onThumbMouseDown)
    }

    return () => {
      clearTimeout(timer)
      slider.removeEventListener('scroll', updateThumb)
      window.removeEventListener('resize', updateThumb)
      if (thumbEl) {
        thumbEl.removeEventListener('mousedown', onThumbMouseDown)
      }
      document.removeEventListener('mousemove', onThumbMouseMove)
      document.removeEventListener('mouseup', onThumbMouseUp)
    }
  }, [])

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }
  return (
    <section className="home-shell">
      {/* Main Hero Section */}
      <div className="main-hero">
        <div className="hero-dark-overlay"></div>
        <div className="main-hero-inner">
          {/* Left Column: Title, Subtitle, CTA */}
          <div className="hero-content-left">
            <span className="hero-badge-tag">new!</span>
            <h1 className="hero-title">
              break up with<br />
              basic dish soap.<br />
              meet <span className="gradient-text purple-teal">super shine.</span>
            </h1>

            <Link to="/products" className="hero-primary-cta purple-btn">
              <span className="cta-text">shop dish soap</span>
            </Link>
          </div>
        </div>

        {/* Wavy scalloped white border divider */}
        <div className="hero-scalloped-divider">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,80 Q22.5,35 45,80 Q67.5,35 90,80 Q112.5,35 135,80 Q157.5,35 180,80 Q202.5,35 225,80 Q247.5,35 270,80 Q292.5,35 315,80 Q337.5,35 360,80 Q382.5,35 405,80 Q427.5,35 450,80 Q472.5,35 495,80 Q517.5,35 540,80 Q562.5,35 585,80 Q607.5,35 630,80 Q652.5,35 675,80 Q697.5,35 720,80 Q742.5,35 765,80 Q787.5,35 810,80 Q832.5,35 855,80 Q877.5,35 900,80 Q922.5,35 945,80 Q967.5,35 990,80 Q1012.5,35 1035,80 Q1057.5,35 1080,80 Q1102.5,35 1125,80 Q1147.5,35 1170,80 Q1192.5,35 1215,80 Q1237.5,35 1260,80 Q1282.5,35 1305,80 Q1327.5,35 1350,80 Q1372.5,35 1395,80 Q1417.5,35 1440,80 V100 H0 Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Eco-Friendly Cleaning Section */}
      <section className="eco-friendly-section">
        <div className="eco-friendly-container">
          <div className="eco-friendly-title-wrapper">
            <h2 className="eco-friendly-title">
              <span>Eco-Friendly</span> <span>Cleaning</span>
            </h2>
            <p className="eco-friendly-subtitle">
              We proudly offer eco-friendly cleaning options using safer products that don’t compromise on results.
            </p>
          </div>

          <div className="eco-friendly-grid">
            {/* Card 1: Regular Home Cleaning */}
            <Link to="/products" className="eco-card">
              {/* Scallop Top SVG */}
              <div className="card-scallop-top-wrapper">
                <svg viewBox="0 0 300 30" preserveAspectRatio="none" className="card-scallop-svg">
                  <path d="M 0 30 A 30 30 0 0 1 60 30 A 30 30 0 0 1 120 30 A 30 30 0 0 1 180 30 A 30 30 0 0 1 240 30 A 30 30 0 0 1 300 30 V 30 H 0 Z" fill="white" />
                </svg>
              </div>

              <div className="eco-card-body">
                <div className="eco-card-image-box">
                  <img src="https://framerusercontent.com/images/HBZ3x7BCcvND87tntT5WQ6g.png" alt="Regular Home Cleaning" className="eco-card-img" />
                </div>
                <h3 className="eco-card-title">Regular Home Cleaning</h3>
                <p className="eco-card-text">Our regular cleaning service keeps your home consistently clean and comfortable.</p>
              </div>

              {/* Scallop Bottom SVG */}
              <div className="card-scallop-bottom-wrapper">
                <svg viewBox="0 0 300 30" preserveAspectRatio="none" className="card-scallop-svg">
                  <path d="M 0 0 A 30 30 0 0 0 60 0 A 30 30 0 0 0 120 0 A 30 30 0 0 0 180 0 A 30 30 0 0 0 240 0 A 30 30 0 0 0 300 0 V 0 H 0 Z" fill="white" />
                </svg>
              </div>
            </Link>

            {/* Card 2: Floor Cleaning & Care */}
            <Link to="/products" className="eco-card">
              {/* Scallop Top SVG */}
              <div className="card-scallop-top-wrapper">
                <svg viewBox="0 0 300 30" preserveAspectRatio="none" className="card-scallop-svg">
                  <path d="M 0 30 A 30 30 0 0 1 60 30 A 30 30 0 0 1 120 30 A 30 30 0 0 1 180 30 A 30 30 0 0 1 240 30 A 30 30 0 0 1 300 30 V 30 H 0 Z" fill="white" />
                </svg>
              </div>

              <div className="eco-card-body">
                <div className="eco-card-image-box">
                  <img src="https://framerusercontent.com/images/6uNJaVvJG8zAOIeQpuMnce3SW4.png" alt="Floor Cleaning & Care" className="eco-card-img" />
                </div>
                <h3 className="eco-card-title">Floor Cleaning & Care</h3>
                <p className="eco-card-text">We clean all kinds of floors using safe and eco-friendly methods that really work.</p>
              </div>

              {/* Scallop Bottom SVG */}
              <div className="card-scallop-bottom-wrapper">
                <svg viewBox="0 0 300 30" preserveAspectRatio="none" className="card-scallop-svg">
                  <path d="M 0 0 A 30 30 0 0 0 60 0 A 30 30 0 0 0 120 0 A 30 30 0 0 0 180 0 A 30 30 0 0 0 240 0 A 30 30 0 0 0 300 0 V 0 H 0 Z" fill="white" />
                </svg>
              </div>
            </Link>

            {/* Card 3: Kitchen Cleaning */}
            <Link to="/products" className="eco-card">
              {/* Scallop Top SVG */}
              <div className="card-scallop-top-wrapper">
                <svg viewBox="0 0 300 30" preserveAspectRatio="none" className="card-scallop-svg">
                  <path d="M 0 30 A 30 30 0 0 1 60 30 A 30 30 0 0 1 120 30 A 30 30 0 0 1 180 30 A 30 30 0 0 1 240 30 A 30 30 0 0 1 300 30 V 30 H 0 Z" fill="white" />
                </svg>
              </div>

              <div className="eco-card-body">
                <div className="eco-card-image-box">
                  <img src="https://framerusercontent.com/images/vXm1JwnYTIK7WS4c936TMaFBY.png" alt="Kitchen Cleaning" className="eco-card-img" />
                </div>
                <h3 className="eco-card-title">Kitchen Cleaning</h3>
                <p className="eco-card-text">Our regular cleaning service keeps your home consistently clean and comfortable.</p>
              </div>

              {/* Scallop Bottom SVG */}
              <div className="card-scallop-bottom-wrapper">
                <svg viewBox="0 0 300 30" preserveAspectRatio="none" className="card-scallop-svg">
                  <path d="M 0 0 A 30 30 0 0 0 60 0 A 30 30 0 0 0 120 0 A 30 30 0 0 0 180 0 A 30 30 0 0 0 240 0 A 30 30 0 0 0 300 0 V 0 H 0 Z" fill="white" />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Section bottom scallop divider */}
        <div className="section-scalloped-divider">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,80 Q22.5,35 45,80 Q67.5,35 90,80 Q112.5,35 135,80 Q157.5,35 180,80 Q202.5,35 225,80 Q247.5,35 270,80 Q292.5,35 315,80 Q337.5,35 360,80 Q382.5,35 405,80 Q427.5,35 450,80 Q472.5,35 495,80 Q517.5,35 540,80 Q562.5,35 585,80 Q607.5,35 630,80 Q652.5,35 675,80 Q697.5,35 720,80 Q742.5,35 765,80 Q787.5,35 810,80 Q832.5,35 855,80 Q877.5,35 900,80 Q922.5,35 945,80 Q967.5,35 990,80 Q1012.5,35 1035,80 Q1057.5,35 1080,80 Q1102.5,35 1125,80 Q1147.5,35 1170,80 Q1192.5,35 1215,80 Q1237.5,35 1260,80 Q1282.5,35 1305,80 Q1327.5,35 1350,80 Q1372.5,35 1395,80 Q1417.5,35 1440,80 V100 H0 Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Brand Discovery Section: "see what’s new from method" */}
      <section className="collection-cards-section">
        <div className="collection-cards-container">
          <div className="collection-cards-header">
            <h2 className="collection-cards-title">
              see what’s new from method
            </h2>
          </div>

          <div className="collection-cards-grid">
            {/* Card 1: Body wash regimen */}
            <div className="collection-card">
              <img 
                src="/brand/products/whats_new_-_ulta.webp" 
                alt="create your better skin + body regimen" 
                className="collection-card-img" 
              />
              <div className="collection-card-overlay">
                <div className="collection-card-content">
                  <h3 className="collection-card-title-text">
                    create your better<br />
                    skin + body regimen
                  </h3>
                  <p className="collection-card-desc">
                    meet our body wash tonics. an innovative collection for your specific skincare needs. mix and match to create the perfect regimen for your unique skin.
                  </p>
                  <a 
                    href="https://methodproducts.com/collections/body-wash-tonics" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="collection-card-btn"
                  >
                    shop body tonics
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2: Hydrating serum hand wash */}
            <div className="collection-card">
              <img 
                src="/brand/products/hydrating-serum-new--desktop.webp" 
                alt="hydrating serum hand wash" 
                className="collection-card-img" 
              />
              <div className="collection-card-overlay">
                <div className="collection-card-content">
                  <span className="collection-card-tag">new</span>
                  <h3 className="collection-card-title-text">
                    hydrating serum<br />
                    hand wash
                  </h3>
                  <p className="collection-card-desc">
                    with a dermatologist-tested formula and skincare inspired ingredients, this hydrating serum maintains skin’s microbiome and smells delightful.
                  </p>
                  <a 
                    href="https://methodproducts.com/collections/hydrating-serum-hand-wash" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="collection-card-btn"
                  >
                    shop hand serum
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bundles Section: "shop bundles for your skin needs" */}
      <section className="bundles-section">
        <div className="bundles-container">
          <div className="bundles-header">
            <h2 className="bundles-title">
              shop bundles for your skin needs
            </h2>
            <p className="bundles-subtitle">
              your skin deserves a regimen built for you. browse our bundles to create your custom routine.
            </p>
          </div>

          <div className="bundles-grid">
            {/* Card 1: The Soft Radiance Bundle */}
            <div className="bundle-card">
              <div className="bundle-card-img-box">
                <img 
                  src="https://methodproducts.com/cdn/shop/files/3ea4251ebeb625eaf3d4c2c013aebc35ac6e2786_1.jpg?crop=center&height=1200&v=1772813719&width=1200" 
                  alt="the soft radiance bundle" 
                  className="bundle-card-img" 
                />
              </div>
              <div className="bundle-card-text-box">
                <h3 className="bundle-card-title">
                  the soft<br />radiance bundle
                </h3>
                <p className="bundle-card-desc">
                  for glowy, dewy skin
                </p>
                <a 
                  href="https://methodproducts.com/products/barrier-supporting-and-microbuffing-body-wash-tonic-bundle-34-fl-oz" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bundle-card-btn"
                >
                  shop the bundle
                </a>
              </div>
            </div>

            {/* Card 2: The Smooth Hydration Bundle */}
            <div className="bundle-card">
              <div className="bundle-card-img-box">
                <img 
                  src="https://methodproducts.com/cdn/shop/files/Rectangle_5_03c2f127-29ea-478f-a7b7-add531e227e7.png?crop=center&height=538&v=1773258554&width=464" 
                  alt="the smooth hydration bundle" 
                  className="bundle-card-img" 
                />
              </div>
              <div className="bundle-card-text-box">
                <h3 className="bundle-card-title">
                  the smooth<br />hydration bundle
                </h3>
                <p className="bundle-card-desc">
                  for clear, hydrated skin
                </p>
                <a 
                  href="https://methodproducts.com/products/dewy-glow-bundle-34-fl-oz" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bundle-card-btn"
                >
                  shop the bundle
                </a>
              </div>
            </div>

            {/* Card 3: The Dewy Glow Bundle */}
            <div className="bundle-card">
              <div className="bundle-card-img-box">
                <img 
                  src="https://methodproducts.com/cdn/shop/files/a87ef715583177b3724044b57ca2a92195892e2d.jpg?crop=center&height=1200&v=1773258629&width=1200" 
                  alt="the dewy glow bundle" 
                  className="bundle-card-img" 
                />
              </div>
              <div className="bundle-card-text-box">
                <h3 className="bundle-card-title">
                  the dewy<br />glow bundle
                </h3>
                <p className="bundle-card-desc">
                  for smooth, hydrated skin
                </p>
                <a 
                  href="https://methodproducts.com/products/dewy-glow-bundle-34-fl-oz" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bundle-card-btn"
                >
                  shop the bundle
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section: "go ahead, grab our fan favorites" */}
      <section className="bestsellers-section">
        {/* Backdrop Wave Vector image */}
        <picture className="bestsellers-backdrop">
          <img 
            src="https://methodproducts.com/cdn/shop/files/refill-carousel-vector.webp?crop=center&height=855&v=1742308145&width=1680" 
            alt="wavy vector background" 
            className="bestsellers-backdrop-img" 
          />
        </picture>

        <div className="bestsellers-container">
          <div className="bestsellers-header">
            <div className="bestsellers-title-box">
              <span className="bestsellers-subtitle">shop bestsellers</span>
              <h2 className="bestsellers-title">go ahead, grab our fan favorites</h2>
            </div>
          </div>



          {/* Cards Grid wrapper with scroll snapping */}
          <div className="bestsellers-grid-wrap" ref={scrollContainerRef}>
            <div className="bestsellers-grid">
              
              {/* Card 1: Gel Hand Wash Refill */}
              <div className="bestseller-card">
                <div className="bestseller-img-box">
                  <img 
                    src="https://methodproducts.com/cdn/shop/files/MTHD_GHW_Refill_34oz_SweetWater_Front_US_378682__13360.1737652984.386.513_122dd232-c8d7-43e9-907c-c6d1ea521685.jpg?v=1770160914" 
                    alt="gel hand wash refill - sweet water" 
                    className="bestseller-img"
                  />
                </div>
                <div className="bestseller-content">
                  <div className="bestseller-reviews">★★★★★ <span className="review-count">(54)</span></div>
                  <div className="bestseller-tag-text">best seller</div>
                  <div className="bestseller-scent">sweet water</div>
                  <h3 className="bestseller-product-title">gel hand wash refill</h3>
                  <div className="bestseller-footer">
                    <span className="bestseller-price">$7.49</span>
                    <button 
                      type="button"
                      className="bestseller-card-btn"
                      onClick={() => addToCart({
                        id: 'bestseller-1',
                        name: 'gel hand wash refill - sweet water',
                        price: 7.49
                      })}
                    >
                      add to cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Moisturizing Body Wash */}
              <div className="bestseller-card">
                <div className="bestseller-img-box">
                  <img 
                    src="/brand/products/Simply Nourish Body Wash Image.webp" 
                    alt="moisturizing body wash - simply nourish" 
                    className="bestseller-img"
                  />
                </div>
                <div className="bestseller-content">
                  <div className="bestseller-reviews">★★★★★ <span className="review-count">(1363)</span></div>
                  <div className="bestseller-tag-text">new</div>
                  <div className="bestseller-scent">simply nourish</div>
                  <h3 className="bestseller-product-title">moisturizing body wash</h3>
                  <div className="bestseller-footer">
                    <span className="bestseller-price">$12.49</span>
                    <button 
                      type="button"
                      className="bestseller-card-btn"
                      onClick={() => addToCart({
                        id: 'bestseller-2',
                        name: 'moisturizing body wash - simply nourish',
                        price: 12.49
                      })}
                    >
                      add to cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3: Concentrated Laundry Detergent */}
              <div className="bestseller-card">
                <div className="bestseller-img-box">
                  <img 
                    src="/brand/products/Ginger Mango Laundry Detergent Image.webp" 
                    alt="concentrated laundry detergent - ginger mango" 
                    className="bestseller-img"
                  />
                </div>
                <div className="bestseller-content">
                  <div className="bestseller-reviews">★★★★★ <span className="review-count">(43)</span></div>
                  <div className="bestseller-tag-text">best seller</div>
                  <div className="bestseller-scent">ginger mango</div>
                  <h3 className="bestseller-product-title">concentrated laundry detergent</h3>
                  <div className="bestseller-footer">
                    <span className="bestseller-price">$14.49</span>
                    <button 
                      type="button"
                      className="bestseller-card-btn"
                      onClick={() => addToCart({
                        id: 'bestseller-3',
                        name: 'concentrated laundry detergent - ginger mango',
                        price: 14.49
                      })}
                    >
                      add to cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 4: Men Body Wash */}
              <div className="bestseller-card">
                <div className="bestseller-img-box">
                  <img 
                    src="/brand/products/Sea + Surf Body Wash Image.webp" 
                    alt="men body wash - sea + surf" 
                    className="bestseller-img"
                  />
                </div>
                <div className="bestseller-content">
                  <div className="bestseller-reviews">★★★★★ <span className="review-count">(1323)</span></div>
                  <div className="bestseller-tag-text">new</div>
                  <div className="bestseller-scent">sea + surf</div>
                  <h3 className="bestseller-product-title">men body wash</h3>
                  <div className="bestseller-footer">
                    <span className="bestseller-price">$12.49</span>
                    <button 
                      type="button"
                      className="bestseller-card-btn"
                      onClick={() => addToCart({
                        id: 'bestseller-4',
                        name: 'men body wash - sea + surf',
                        price: 12.49
                      })}
                    >
                      add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Explore Our Collections Section */}
      <section className="explore-collections-section">
        {/* LEFT CONTENT */}
        <div className="explore-left">
          <div className="explore-title">
            <p>explore our collections</p>
          </div>
          <div className="explore-subtitle">
            <h3>show me <br /><span className="explore-subtitle-line">products that...</span></h3>
          </div>
          <Link to="/products" className="view-all-btn">
            view all collections
          </Link>
        </div>

        {/* RIGHT SLIDER */}
        <div className="explore-slider">
          <div className="collections-grid" ref={collectionsGridRef}>
            
            {/* CARD 1: Spa Core */}
            <div className="explore-collection-card spa-core">
              <div className="explore-card-inner">
                <div className="explore-collection-image">
                  <img
                    src="https://methodproducts.com/cdn/shop/collections/gradient-are-so-spa-core_a7d0978b-dc8a-4161-9150-885b9841c5be.jpg?v=1744909488"
                    alt="are so spa core"
                  />
                </div>
                <div className="explore-collection-content">
                  <h3>are so spa core</h3>
                  <Link to="/products" className="explore-card-btn">
                    view products
                  </Link>
                </div>
              </div>
            </div>

            {/* CARD 2: Earthy Surfy */}
            <div className="explore-collection-card earthy-surfy">
              <div className="explore-card-inner">
                <div className="explore-collection-image">
                  <img
                    src="https://methodproducts.com/cdn/shop/collections/gradient-shower-me-earthy_908cbed8-81fe-4f63-b5d1-0adb7b3c7247.jpg?v=1742455043"
                    alt="shower me earthy + surfy"
                  />
                </div>
                <div className="explore-collection-content">
                  <h3>shower me earthy + surfy</h3>
                  <Link to="/products" className="explore-card-btn">
                    view products
                  </Link>
                </div>
              </div>
            </div>

            {/* CARD 3: Smell like Vacation */}
            <div className="explore-collection-card vacation">
              <div className="explore-card-inner">
                <div className="explore-collection-image">
                  <img
                    src="https://methodproducts.com/cdn/shop/collections/gradient-smells-like-a-vacation_7825f5e5-2d54-4c9a-b6e8-60f649714aeb.jpg?v=1744909573"
                    alt="smell like vacation"
                  />
                </div>
                <div className="explore-collection-content">
                  <h3>smell like vacation</h3>
                  <Link to="/products" className="explore-card-btn">
                    view products
                  </Link>
                </div>
              </div>
            </div>

            {/* CARD 4: Tickle me Pink */}
            <div className="explore-collection-card pink">
              <div className="explore-card-inner">
                <div className="explore-collection-image">
                  <img
                    src="https://methodproducts.com/cdn/shop/collections/gradient-tickle-me-pink_fb5343bc-dae0-4748-8251-928d002f935b.jpg?v=1744909601"
                    alt="tickle me pink"
                  />
                </div>
                <div className="explore-collection-content">
                  <h3>tickle me pink</h3>
                  <Link to="/products" className="explore-card-btn">
                    view products
                  </Link>
                </div>
              </div>
            </div>

            {/* CARD 5: Pump with Purpose */}
            <div className="explore-collection-card pump">
              <div className="explore-card-inner">
                <div className="explore-collection-image">
                  <img
                    src="https://methodproducts.com/cdn/shop/collections/gradient-pump-with-purpose_b2f99c1c-6cbd-4138-a25e-51441f3a84b9.jpg?v=1744909623"
                    alt="pump with purpose"
                  />
                </div>
                <div className="explore-collection-content">
                  <h3>pump with purpose</h3>
                  <Link to="/products" className="explore-card-btn">
                    view products
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Custom Pill Scrollbar */}
          <div className="explore-slider-bar-container">
            <div className="explore-slider-bar">
              <div className="explore-slider-thumb" ref={thumbRef}></div>
            </div>
          </div>
        </div>
      </section>

    </section>
  )
}

export default HomePage