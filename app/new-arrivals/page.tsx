'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
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
  brand: string
  sizes: Array<{ size: string; stock: number }>
  colors: Array<{ name: string; hex: string }>
  createdAt: string
}

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const API_BASE: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL || '/api'

  useEffect(() => {
    fetchProducts()
  }, [page])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('sort', 'newest')
      params.append('page', String(page))
      params.append('limit', '12')
      params.append('_t', String(Date.now()))
      const res = await fetch(`${API_BASE}/products?${params.toString()}`, { cache: 'no-store' })
      const data = await res.json().catch(() => ({}))
      if (res.ok && (data?.success ?? true)) {
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
        setProducts(list)
        setTotalPages(Number(data?.totalPages || 1))
      } else {
        setError(data?.message || 'Failed to fetch products')
      }
    } catch (e) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="heading-hero mb-4">
            New <span className="gradient-text">Arrivals</span>
          </h1>
          <p className="text-body max-w-2xl mx-auto">
            Fresh styles just in — discover the latest products added to our store
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading new arrivals...</p>
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
              {products.map((product, index) => (
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
  )
}


