'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AddToCartButton from '../components/AddToCartButton'

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
  isFeatured: boolean
}

export default function Collections() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('men')
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/products')
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data)
      } else {
        setError('Failed to fetch products')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) return false
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
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg pointer-events-none"></div>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full">${priceRange[0]}</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full">${priceRange[1]}+</span>
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
          <div className="lg:w-3/4">
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
                <button onClick={fetchProducts} className="btn-primary">
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 grid-modern">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product._id} 
                    className="card-modern overflow-hidden group hover-lift"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center relative z-10">
                          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white text-2xl">👔</span>
                          </div>
                          <span className="text-gray-500 text-sm font-medium">No Image</span>
                        </div>
                      )}
                      {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{product.brand} • {product.category}</p>
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.ratings) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-xs text-gray-500">({product.numOfReviews})</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold text-gray-900">${product.price}</span>
                          {product.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                          )}
                        </div>
                        <AddToCartButton
                          productId={product._id}
                          productName={product.name}
                          price={product.price}
                          className="btn-primary text-sm px-6 py-2"
                        />
                      </div>
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
