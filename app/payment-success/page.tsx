"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Order {
  _id: string
  totalPrice: number
  orderStatus: string
  paymentInfo: { method: string; status: string; id: string }
}

export default function PaymentSuccess() {
  const [creating, setCreating] = useState(true)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const createOrder = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('You are not logged in.')
          setCreating(false)
          return
        }

        // Fetch cart to build order items/pricing
        const cartRes = await fetch('https://clothing-website-backend-g7te.onrender.com/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const cartJson = await cartRes.json()
        if (!cartRes.ok) {
          setError(cartJson.message || 'Failed to load cart')
          setCreating(false)
          return
        }
        const cart = cartJson.data
        if (!cart || !cart.items || cart.items.length === 0) {
          setError('Cart is empty. Nothing to order.')
          setCreating(false)
          return
        }

        // Minimal shipping info (adjust to your checkout data)
        const shippingInfo = {
          firstName: 'Customer',
          lastName: 'Name',
          email: 'customer@example.com',
          phone: '0000000000',
          address: { street: 'N/A', city: 'N/A', state: 'N/A', zipCode: '000000', country: 'N/A' }
        }

        // Payment info from gateway would go here; using success defaults
        const paymentInfo = { id: 'payment_success', status: 'succeeded', method: 'card' }

        const orderRes = await fetch('https://clothing-website-backend-g7te.onrender.com/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            orderItems: cart.items.map((i: any) => ({
              product: i.product._id || i.product,
              name: i.product.name,
              price: i.price,
              quantity: i.quantity,
              size: i.size,
              color: i.color,
              image: i.product.images?.[0]?.url || ''
            })),
            shippingInfo,
            paymentInfo
          })
        })
        const orderJson = await orderRes.json()
        if (!orderRes.ok) {
          setError(orderJson.message || 'Failed to create order')
          setCreating(false)
          return
        }
        setOrder(orderJson.data)

        // Clear cart
        await fetch('https://clothing-website-backend-g7te.onrender.com/api/cart', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
      } catch (e) {
        setError('Network error while creating order')
      } finally {
        setCreating(false)
      }
    }
    createOrder()
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        {creating && <p className="text-gray-600 mb-8">Finalizing your order...</p>}
        {error && <p className="text-red-600 mb-8">{error}</p>}

        {!creating && !error && order && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number</span>
                <span className="font-semibold text-gray-900">#{order._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-900">{order.paymentInfo?.method || 'COD'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Status</span>
                <span className="font-semibold text-gray-900">{order.orderStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-semibold text-orange-500">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Link
            href="/order-status"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg block transition-colors duration-200"
          >
            View Order Status
          </Link>
          <Link
            href="/collections"
            className="w-full bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-3 px-6 rounded-lg block transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
