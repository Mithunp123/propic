import { useState } from 'react'

const BLOG_ARTICLES = [
  {
    id: 1,
    title: 'The Art of Scent: How Fragrance Transforms Daily Cleaning',
    category: 'Fragrance',
    date: 'May 15, 2026',
    readTime: '4 min read',
    excerpt: 'Cleaning is no longer a chore—it is an olfactory ritual. Discover how botanical notes of Lavender, Citrus, and Sandalwood scientifically elevate focus, reduce stress, and establish long-lasting household tranquility.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    content: [
      'Have you ever wondered why entering a freshly cleaned room instantly alters your breathing? It is not just the absence of dust; it is the presence of olfactory molecules that interact directly with our brain’s limbic system—the seat of emotion and memory.',
      'For decades, standard household cleaning brands relied on heavy chemical masking agents or aggressive synthetic chlorine smells. Propic rejects this approach. We believe that cleaning your home or business should be a therapeutic sensory experience rather than a chemical endurance test.',
      'Each of our signature fragrances (from Lavender Mist to Scent-Sational Citrus) is layered like a fine perfume. We start with bright top notes that disperse during spraying to lift your mood, progress to rich heart notes that sustain throughout scrubbing, and settle into warm botanical base notes that linger gracefully on your floors and countertops for up to 12 hours.',
      'Next time you cut through grease on your kitchen counter or mop down your vitrified tiles, pay close attention to the aroma rising in the warm vapors. You are not just cleaning; you are setting a subconscious mood of protection, tranquility, and refined domestic hospitality.'
    ]
  },
  {
    id: 2,
    title: 'Spring Clean, Reimagined: The Non-Toxic Guide to Sparkling Floors',
    category: 'Home Care',
    date: 'May 10, 2026',
    readTime: '5 min read',
    excerpt: 'Vitrified tiles, Italian marble, and natural hardwood require highly specialized, non-corrosive daily maintenance. Learn how to clean deeper without stripping protective coatings or exposing children to toxic films.',
    imageUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=800',
    content: [
      'Your floor is the largest contact surface in your home. Toddlers crawl on it, pets sleep on it, and family members walk barefoot. Yet, traditional floor cleaners are loaded with harsh chemicals that leave behind invisible, toxic residues that transfer directly to skin.',
      'Maintaining a sparkling shine on premium vitrified tiles or marble doesn’t require industrial-strength acids. In fact, high-acidity formulas slowly strip away the natural sealants, leaving your tiles looking dull, porous, and increasingly prone to deep staining over time.',
      'Our floor care experts recommend three golden rules for maintaining premium floors:',
      '1. ALWAYS USE PH-NEUTRAL FORMULAS: A balanced formulation handles dirt and food spills through gentle surfactant action rather than corrosive chemical burning.',
      '2. USE MICROFIBER MOPS: Traditional string mops simply push dirty water into grout lines. Microfiber holds dust particles magnetically and uses 80% less water, allowing floors to dry instantly without streaks.',
      '3. AVOID SYNTHETIC WAXES: While wax seems to offer instant gloss, it builds up a yellowing layer that traps dust underneath. A true clean comes from clean, residue-free surfaces that reflect natural sunlight.',
      'At Propic, we engineer our floor liquids to be entirely biodegradable, safe for children and pets, and completely neutral on delicate grout, vitrified glazes, and sealed natural stones.'
    ]
  },
  {
    id: 3,
    title: 'Microbiome vs. Dirt: Demystifying Gentle Daily Sanitizers',
    category: 'Eco-Living',
    date: 'April 28, 2026',
    readTime: '6 min read',
    excerpt: 'Sterilization does not equal health. Discover why annihilating 100% of household bacteria actually weakens immunity, and how balanced daily cleaning supports a robust, family-safe microbial home ecosystem.',
    imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=800',
    content: [
      'In recent years, the consumer mindset has been trained to fear all microbes. Aerosol sprays and harsh disinfectant chemicals boast of "annihilating 99.9% of germs." But science is telling a very different story: a sterile home is not a healthy home.',
      'Just like our gut, our living spaces possess a natural microbiome. When we flood our rooms with powerful antibacterial agents, we kill off the weak, beneficial bacteria. This leaves behind a blank slate where highly resistant pathogens can rapidly multiply without biological competition.',
      'A smart home sanitation protocol focuses on balance, not destruction. Dirt, kitchen grease, and bathroom humidity should be thoroughly washed away using high-efficacy soaps that trap dirt, rather than chemical poisons that disinfect everything but leave toxins behind.',
      'We call this "Bio-Balanced Hygiene". By washing surfaces with plant-based cleaning solutions, you lift away grease, dust mites, and harmful bacteria, while leaving behind a healthy baseline of environmental microbes that naturally train the human immune system.',
      'Propic cleaning formulations focus on structural soil removal. We don’t poison your environment; we pull dirt and grease off your countertops, leaving them clean, safe, and balanced.'
    ]
  }
]

function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeArticle, setActiveArticle] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const categories = ['All', 'Fragrance', 'Home Care', 'Eco-Living']

  const filteredArticles = selectedCategory === 'All'
    ? BLOG_ARTICLES
    : BLOG_ARTICLES.filter(article => article.category === selectedCategory)

  const featuredArticle = BLOG_ARTICLES[0]
  const otherArticles = filteredArticles.filter(article => article.id !== featuredArticle.id || selectedCategory !== 'All')

  const openArticle = (article) => {
    setActiveArticle(article)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    // Delayed clearing to allow smooth transition out
    setTimeout(() => setActiveArticle(null), 300)
  }

  return (
    <div className="blogs-page-container">
      {/* 1. Page Header */}
      <div className="blogs-header-section">
        <span className="blogs-badge">PROPIC EDITORIAL</span>
        <h1 className="blogs-title">Clean beyond the surface.</h1>
        <p className="blogs-subtitle">
          Insights, guides, and sensory science directly from the formulators of Gaayathri Enterprises.
        </p>
      </div>

      {/* 2. Featured Editorial Spot (Asymmetric layout, no card outline) */}
      {selectedCategory === 'All' && (
        <section className="featured-blog-spot" onClick={() => openArticle(featuredArticle)}>
          <div className="featured-blog-image-box">
            <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="featured-blog-img" />
            <span className="featured-category-pill">{featuredArticle.category}</span>
          </div>
          <div className="featured-blog-content">
            <div className="featured-blog-meta">
              <span>{featuredArticle.date}</span>
              <span className="meta-sep">•</span>
              <span>{featuredArticle.readTime}</span>
            </div>
            <h2 className="featured-blog-title">{featuredArticle.title}</h2>
            <p className="featured-blog-excerpt">{featuredArticle.excerpt}</p>
            <button className="featured-blog-read-btn">
              <span>Read Full Article</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="read-arrow-icon">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </section>
      )}

      {/* 3. Category Filter Capsules */}
      <div className="blogs-filter-container">
        <div className="filter-capsules-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-capsule ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Elegant Horizontal Row-Based List Index (Replacing Card Grid) */}
      <section className="blogs-list-index">
        {otherArticles.length === 0 ? (
          <div className="empty-blogs-state">
            <p>No articles found under this category yet. Stay tuned for new scent updates!</p>
          </div>
        ) : (
          <div className="blogs-horizontal-list">
            {otherArticles.map((article) => (
              <div
                key={article.id}
                className="blog-row-item"
                onClick={() => openArticle(article)}
              >
                <div className="blog-row-left">
                  <span className="blog-row-number">0{article.id}</span>
                  <div className="blog-row-meta">
                    <span className="blog-row-category">{article.category}</span>
                    <span className="blog-row-date">{article.date}</span>
                  </div>
                </div>

                <div className="blog-row-center">
                  <h3 className="blog-row-title">{article.title}</h3>
                  <p className="blog-row-excerpt">{article.excerpt}</p>
                </div>

                <div className="blog-row-right">
                  <span className="blog-row-readtime">{article.readTime}</span>
                  <span className="blog-row-arrow-icon">→</span>
                </div>

                {/* Floating Preview Image that appears on hover via CSS */}
                <div className="blog-row-hover-preview">
                  <img src={article.imageUrl} alt={article.title} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Slide-Out Quick Reader Drawer */}
      <div className={`blogs-reader-drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={closeDrawer}>
        <div
          className={`blogs-reader-drawer-panel ${isDrawerOpen ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button className="drawer-close-btn" onClick={closeDrawer} aria-label="Close reader">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {activeArticle && (
            <div className="drawer-article-container">
              {/* Header Image */}
              <div className="drawer-hero-image-wrap">
                <img src={activeArticle.imageUrl} alt={activeArticle.title} className="drawer-hero-img" />
                <span className="drawer-category-tag">{activeArticle.category}</span>
              </div>

              {/* Text Area */}
              <div className="drawer-article-body">
                <div className="drawer-article-meta">
                  <span>{activeArticle.date}</span>
                  <span className="meta-sep">•</span>
                  <span>{activeArticle.readTime}</span>
                </div>
                <h2 className="drawer-article-title">{activeArticle.title}</h2>
                <div className="drawer-editorial-author">
                  <strong>By Gaayathri Enterprises Formulators</strong>
                  <span>Tiruchengode, Tamil Nadu</span>
                </div>

                {/* Paragraphs */}
                <div className="drawer-paragraphs">
                  {activeArticle.content.map((p, index) => (
                    <p key={index}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogsPage
