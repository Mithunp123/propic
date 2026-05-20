import { useEffect, useMemo, useState } from 'react'
import SectionHeading from '../components/common/SectionHeading'
import ProductGrid from '../components/products/ProductGrid'
import { requestJson } from '../utils/api'

function ProductsPage({ addToCart }) {
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    requestJson('/api/products').then(setProducts).catch(() => setProducts([]))
  }, [])

  const categories = useMemo(() => {
    const preferredOrder = [
      'New Launches',
      'New Launches of Experts',
      'Mega Value Packs',
      'Cleaning',
      'Personal Care',
      'Essentials',
      'Kitchen',
      'Bathroom',
      'Laundry',
    ]
    const available = Array.from(new Set(products.map((product) => product.category).filter(Boolean)))
    const ordered = [
      ...preferredOrder.filter((category) => available.includes(category)),
      ...available.filter((category) => !preferredOrder.includes(category)).sort(),
    ]
    return ['All', ...ordered]
  }, [products])

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((product) => product.category === selectedCategory)

  return (
    <section>
      <SectionHeading title="Products" subtitle="Explore the PROPIC cleaning collection" />
      <div className="product-filter-bar">
        <label className="filter-label" htmlFor="product-category-filter">Filter by category</label>
        <select
          id="product-category-filter"
          className="field compact"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <span className="filter-count">{filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}</span>
      </div>
      <ProductGrid products={filteredProducts} addToCart={addToCart} />
    </section>
  )
}

export default ProductsPage