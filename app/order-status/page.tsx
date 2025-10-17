"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  totalPrice: number
  orderStatus: string
  createdAt: string
  orderItems: OrderItem[]
}

export default function OrderStatus() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('You are not logged in.')
          setLoading(false)
          return
        }

        const API_BASE: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL || '/api'
        const res = await fetch(`${API_BASE}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const json = await res.json()
        if (!res.ok) {
          setError(json.message || 'Failed to load orders')
          setLoading(false)
          return
        }
        setOrders(json.data || [])
      } catch (e) {
        setError('Network error while loading orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="heading-section">Order Status</h1>
          <p className="text-body">Track your recent orders and their current status</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="card-modern p-6 text-center text-red-600">{error}</div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="card-modern p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">When you place an order it will appear here</p>
            <Link href="/collections" className="btn-primary">Start Shopping</Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o._id} className="card-modern p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order</p>
                    <p className="font-semibold text-gray-900">#{o._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Placed</p>
                    <p className="font-semibold text-gray-900">{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold text-gray-900">{o.orderStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold text-orange-600">₹{o.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
                {o.orderItems?.length > 0 && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <ul className="text-sm text-gray-700 space-y-1">
                      {o.orderItems.slice(0, 4).map((it, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{it.name}</span>
                          <span>x{it.quantity} • ₹{it.price}</span>
                        </li>
                      ))}
                      {o.orderItems.length > 4 && (
                        <li className="text-gray-500">+ {o.orderItems.length - 4} more items</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}


