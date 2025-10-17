'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import AddToCartButton from '../../components/AddToCartButton'

interface Product {
  _id: string
  name: string
  description: string
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
}

export default function ProductDetail() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const API_BASE: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/products/${params.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setProduct(data.data)
      } else {
        setError('Product not found')
      }
    } catch (error) {
      setError('Failed to fetch product')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/collections" className="btn-primary">
            Back to Collections
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-gray-400 hover:text-gray-500">Home</Link>
            </li>
            <li>
              <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <Link href="/collections" className="text-gray-400 hover:text-gray-500">Collections</Link>
            </li>
            <li>
              <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-500">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No Image Available</span>
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.brand}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-lg text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                      <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded ml-2">
                        {product.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.ratings) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.numOfReviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const inStock = (product.sizes || []).filter(s => s.stock > 0)
                  const display = inStock.length ? inStock : (product.sizes || [])
                  return display.map((sizeOption) => (
                    <span
                      key={sizeOption.size}
                      className={"px-3 py-2 border rounded-md text-sm font-medium border-gray-300 text-gray-700 hover:border-orange-500"}
                    >
                      {sizeOption.size}
                    </span>
                  ))
                })()}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <div
                    key={color.name}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <AddToCartButton
                productId={product._id}
                productName={product.name}
                price={product.price}
                className="btn-primary w-full py-4 text-lg"
                availableSizes={(() => { const inStock = (product.sizes || []).filter(s => s.stock > 0).map(s => s.size); return inStock.length ? inStock : (product.sizes || []).map(s => s.size) })()}
                availableColors={(product.colors || []).map(c => c.name)}
              />
            </div>

            <div className="flex space-x-4">
              <button className="flex-1 btn-secondary py-3">
                Add to Wishlist
              </button>
              <button className="flex-1 btn-secondary py-3">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
