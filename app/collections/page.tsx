'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AddToCartButton from '../components/AddToCartButton'
import { formatINR } from '../utils/auth'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  images: Array<{ url: string; public_id: string }>
  category: string
  subcategory: string
  brand: string
  sizes: Array<{ size: string; stock: number }>
  colors: Array<{ name: string; hex: string }>
  ratings: number
  numOfReviews: number
  stock: number
  isActive: boolean
  // isFeatured removed
}

export default function Collections() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('men')
  const [priceRange, setPriceRange] = useState([0, 500])
  const [maxPrice, setMaxPrice] = useState(500)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const API_BASE: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL || 'https://clothing-website-backend-g7te.onrender.com/api'

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory.toLowerCase())
      params.append('limit', '12')
      params.append('page', '1')
      params.append('_t', String(Date.now()))
      const response = await fetch(`${API_BASE}/products?${params.toString()}`, {
        cache: 'no-store'
      })
      
      const data = await response.json().catch(() => ({}))
      if (response.ok && (data?.success ?? true)) {
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
        setProducts(list)
        // Update price slider max dynamically based on fetched products
        const computedMax = list.length ? Math.max(...list.map((p: any) => Number(p.price) || 0)) : 500
        const normalizedMax = Math.max(500, Math.ceil(computedMax / 100) * 100)
        setMaxPrice(normalizedMax)
        setPriceRange(([min]) => [0, normalizedMax])
      } else {
        setError(data?.message || 'Failed to fetch products')
      }
    } catch (error) {
      console.error('Collections fetch error', error)
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false
    if (selectedSize && !product.sizes.some(s => s.size === selectedSize)) return false
    if (selectedColor && !product.colors.some(c => c.name === selectedColor)) return false
    return true
  })

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="heading-hero mb-4">
            Our <span className="gradient-text">Collections</span>
          </h1>
          <p className="text-body max-w-2xl mx-auto">
            Discover our carefully curated selection of premium fashion items
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center space-x-2 mb-12">
          {['men', 'women', 'kids'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-4 rounded-full text-lg font-semibold capitalize transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 transform scale-105'
                  : 'bg-white text-gray-600 hover:text-orange-500 hover:bg-orange-50 border border-gray-200 hover:border-orange-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="card-modern p-8 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filters
              </h2>

              {/* Price Filter */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Price Range</h3>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg pointer-events-none"></div>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full">₹{priceRange[0]}</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full">₹{priceRange[1]}+</span>
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Category</h3>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
                <select className="form-input">
                  <option>All Categories</option>
                  <option>Shirts</option>
                  <option>Pants</option>
                  <option>Accessories</option>
                </select>
              </div>

              {/* Size Filter */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Size</h3>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
                <select 
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="form-input"
                >
                  <option value="">All Sizes</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>

              {/* Color Filter */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Color</h3>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
                <select 
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="form-input"
                >
                  <option value="">All Colors</option>
                  <option value="Blue">Blue</option>
                  <option value="Brown">Brown</option>
                  <option value="Gray">Gray</option>
                  <option value="Navy">Navy</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-2/3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 transition"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-600">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={product.images && product.images[0] ? product.images[0].url : ''}
                        alt={product.name}
                        className="w-full h-60 object-cover"
                      />
                      {product.discount > 0 && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{product.brand} • {product.category}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xl font-bold text-gray-900">{formatINR(product.price)}</span>
                        {product.originalPrice && product.discount > 0 && (
                          <span className="ml-2 text-gray-400 line-through text-sm">{formatINR(product.originalPrice)}</span>
                        )}
                      </div>
                      <AddToCartButton
                        productId={product._id}
                        productName={product.name}
                        price={product.price}
                        className="mt-4 bg-orange-500 text-white w-full py-2 rounded-lg font-medium hover:bg-orange-600 transition"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
