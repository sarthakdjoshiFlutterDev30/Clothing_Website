'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('men')
  const [priceRange, setPriceRange] = useState([0, 500])
  const [maxPrice, setMaxPrice] = useState(500)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const searchParams = useSearchParams()
  const API_BASE: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, selectedSize, selectedColor, selectedBrand, selectedType, priceRange, sort, debouncedSearch, page])

  // Debounce search input so we don't fetch on every keystroke
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 500)
    return () => clearTimeout(handle)
  }, [search])

  // Sync search box from URL (?q=)
  useEffect(() => {
    const q = (searchParams.get('q') || '').trim()
    if (q !== search) {
      setSearch(q)
      setPage(1)
    }
  }, [searchParams])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory.toLowerCase())
      if (selectedType) params.append('type', selectedType)
      if (selectedBrand) params.append('brand', selectedBrand)
      if (selectedSize) params.append('size', selectedSize)
      if (selectedColor) params.append('color', selectedColor)
      if (priceRange[0] > 0) params.append('minPrice', String(priceRange[0]))
      if (priceRange[1] > 0) params.append('maxPrice', String(priceRange[1]))
      if (sort) params.append('sort', sort)
      if (debouncedSearch) params.append('q', debouncedSearch)
      params.append('page', String(page))
      params.append('limit', '12')
      params.append('_t', String(Date.now()))
      const response = await fetch(`${API_BASE}/products?${params.toString()}`, {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
        setProducts(list)
        setTotalPages(Number(data?.totalPages || 1))
        const computedMax = list.length ? Math.max(...list.map((p: any) => Number(p.price) || 0)) : 500
        const normalizedMax = Math.max(500, Math.ceil(computedMax / 100) * 100)
        setMaxPrice(normalizedMax)
        setPriceRange(([min]) => [0, normalizedMax])
      } else {
        setError('Failed to fetch products')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="heading-hero mb-4">
            Our <span className="gradient-text">Products</span>
          </h1>
          <p className="text-body max-w-2xl mx-auto">
            Discover our carefully curated selection of premium fashion items
          </p>
        </div>

        <div className="flex justify-center space-x-2 mb-6">
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

        <div className="max-w-3xl mx-auto mb-10 flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products by name, description, brand"
            className="flex-1 form-input"
          />
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="form-input w-56">
            <option value="newest">Newest arrivals</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Top-rated</option>
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="card-modern p-8 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filters
              </h2>

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
                      onChange={(e) => { setPriceRange([priceRange[0], parseInt(e.target.value)]); setPage(1); }}
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

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Size</h3>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
                <select 
                  value={selectedSize}
                  onChange={(e) => { setSelectedSize(e.target.value); setPage(1); }}
                  className="form-input"
                >
                  <option value="">All Sizes</option>
                  {['XS','S','M','L','XL','XXL','3XL'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Color</h3>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
                <select 
                  value={selectedColor}
                  onChange={(e) => { setSelectedColor(e.target.value); setPage(1); }}
                  className="form-input"
                >
                  <option value="">All Colors</option>
                  {['Black','White','Blue','Brown','Gray','Navy','Green','Red','Yellow'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Type</h3>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
                <select 
                  value={selectedType}
                  onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
                  className="form-input"
                >
                  <option value="">All Types</option>
                  {['Shirt','Jacket','Pants','Shoes','Kurta','Tshirt'].map(t => (
                    <option key={t} value={t.toLowerCase()}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="mb-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Brand</h3>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
                <select 
                  value={selectedBrand}
                  onChange={(e) => { setSelectedBrand(e.target.value); setPage(1); }}
                  className="form-input"
                >
                  <option value="">All Brands</option>
                  {['Goodluck Fashion','Nike','Adidas','Puma','Levis','H&M'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

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
                <button onClick={fetchProducts} className="btn-primary">Try Again</button>
              </div>
            ) : (
              <>
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
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        <Link href={`/products/${product._id}`}>{product.name}</Link>
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{product.brand} • {product.category}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold text-gray-900">{formatINR(product.price)}</span>
                          {product.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through ml-2">{formatINR(product.originalPrice)}</span>
                          )}
                        </div>
                        <AddToCartButton
                          productId={product._id}
                          productName={product.name}
                          price={product.price}
                          className="btn-primary text-sm px-6 py-2"
                          availableSizes={(() => { const inStock = (product.sizes || []).filter(s => s.stock > 0).map(s => s.size); return inStock.length ? inStock : (product.sizes || []).map(s => s.size) })()}
                          availableColors={(product.colors || []).map(c => c.name)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex justify-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="btn-secondary disabled:opacity-50">Prev</button>
                <span className="px-4 py-2 text-gray-700">Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="btn-secondary disabled:opacity-50">Next</button>
              </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
