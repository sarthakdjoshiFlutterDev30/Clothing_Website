"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AddToCartButton from '../components/AddToCartButton'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  images: Array<{ url: string }>
  brand: string
  category: string
}

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const API_BASE: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL || '/api'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/products?_t=${Date.now()}` , {
          cache: 'no-store'
        })
        const json = await res.json()
        if (!res.ok) {
          setError(json.message || 'Failed to load sale products')
          setLoading(false)
          return
        }
        const discounted = (json.data || []).filter((p: Product) => (p.discount || 0) > 0)
        setProducts(discounted)
      } catch (e) {
        setError('Network error while loading products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Discount Banner */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
            Limited Time
          </span>
          <h1 className="heading-hero mb-4">
            Mega <span className="gradient-text">Sale</span>
          </h1>
          <p className="text-body max-w-2xl mx-auto">
            Save big on top styles. Extra discounts already applied — no code needed.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="#sale-grid" className="btn-primary px-8 py-3">Shop Discounts</Link>
            <Link href="/collections" className="btn-secondary px-8 py-3">Browse All</Link>
          </div>
        </div>
        {/* Decorative banners */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Promo Strips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 -mt-4 md:-mt-8 relative z-10">
        <div className="card-modern p-6 flex items-center justify-between bg-gradient-to-r from-orange-50 to-white">
          <div>
            <p className="text-sm text-orange-600 font-semibold">Extra 10% Off</p>
            <h3 className="text-lg font-bold text-gray-900">Orders over ₹150</h3>
          </div>
          <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs">AUTO APPLIED</span>
        </div>
        <div className="card-modern p-6 flex items-center justify-between bg-gradient-to-r from-yellow-50 to-white">
          <div>
            <p className="text-sm text-orange-600 font-semibold">Flash Deals</p>
            <h3 className="text-lg font-bold text-gray-900">New markdowns daily</h3>
          </div>
          <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs">TODAY</span>
        </div>
        <div className="card-modern p-6 flex items-center justify-between bg-gradient-to-r from-rose-50 to-white">
          <div>
            <p className="text-sm text-orange-600 font-semibold">Free Shipping</p>
            <h3 className="text-lg font-bold text-gray-900">On orders over ₹500</h3>
          </div>
          <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs">POPULAR</span>
        </div>
      </section>

      {/* Sale Grid */}
      <section id="sale-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <h2 className="heading-section">Discounted Products</h2>
          <p className="text-sm text-gray-500">{products.length} items</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading sale items...</p>
            </div>
          </div>
        ) : error ? (
          <div className="card-modern p-6 text-center text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="card-modern p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No discounted items right now</h3>
            <p className="text-gray-500 mb-6">Check back soon for fresh deals.</p>
            <Link href="/collections" className="btn-primary">Browse All</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((p) => (
              <div key={p._id} className="card-modern overflow-hidden group hover-lift">
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {p.images?.[0]?.url ? (
                    <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  {p.discount > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{p.discount}%
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{p.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{p.brand} • {p.category}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900">₹{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">₹{p.originalPrice}</span>
                      )}
                    </div>
                    <AddToCartButton
                      productId={p._id}
                      productName={p.name}
                      price={p.price}
                      className="btn-primary text-sm px-6 py-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}


