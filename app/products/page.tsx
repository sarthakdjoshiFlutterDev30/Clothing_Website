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
  ratings: number
  numOfReviews: number
  stock: number
  isActive: boolean
  isFeatured: boolean
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

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

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Our Products
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Discover our carefully curated collection of clothing and accessories
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            <button 
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-md transition duration-150 ${
                selectedCategory === '' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setSelectedCategory('men')}
              className={`px-4 py-2 rounded-md transition duration-150 ${
                selectedCategory === 'men' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Men&apos;s
            </button>
            <button 
              onClick={() => setSelectedCategory('women')}
              className={`px-4 py-2 rounded-md transition duration-150 ${
                selectedCategory === 'women' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Women&apos;s
            </button>
            <button 
              onClick={() => setSelectedCategory('kids')}
              className={`px-4 py-2 rounded-md transition duration-150 ${
                selectedCategory === 'kids' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Kids
            </button>
            <button 
              onClick={() => setSelectedCategory('accessories')}
              className={`px-4 py-2 rounded-md transition duration-150 ${
                selectedCategory === 'accessories' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Accessories
            </button>
          </div>
        </div>

        {/* Products Grid */}
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group relative">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-80 w-full object-cover"
                    />
                  ) : (
                    <div className="h-80 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">No Image</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href={`/products/${product._id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.brand} • {product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${product.price}</p>
                    {product.discount > 0 && (
                      <p className="text-xs text-gray-500 line-through">${product.originalPrice}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <AddToCartButton
                    productId={product._id}
                    productName={product.name}
                    price={product.price}
                    className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-150"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
