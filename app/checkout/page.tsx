'use client'
// removed INR formatting

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authFetch } from '../utils/staticAuth'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const router = useRouter()
  const { cart, fetchCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const cartItems = cart?.items || []

  const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal >= 500 ? 0 : 100
  const taxes = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + taxes

  // Enforce numeric-only for card fields
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep only digits, max 19 digits to support some card types (incl. spaces removal)
    const digits = e.target.value.replace(/\D/g, '').slice(0, 19)
    setFormData(prev => ({ ...prev, cardNumber: digits }))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Digits only, format as MM/YY
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    const formatted = digits.length >= 3 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits
    setFormData(prev => ({ ...prev, expiryDate: formatted }))
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    setFormData(prev => ({ ...prev, cvv: digits }))
  }

  const placeCodOrder = async () => {
    try {
      // Build minimal order payload for backend
      const orderItems = cartItems.map((i: any) => ({
        product: i.product?._id,
        quantity: i.quantity,
        size: i.size,
        color: i.color
      }))
      const shippingInfo = {
        firstName: formData.fullName.split(' ')[0] || formData.fullName,
        lastName: formData.fullName.split(' ').slice(1).join(' ') || '-',
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: 'N/A',
          zipCode: formData.postalCode,
          country: formData.country
        }
      }
      const paymentInfo = { id: 'cod', status: 'pending', method: 'cash_on_delivery' }
      // Use real user token so order ties to the logged-in user
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const API_BASE: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL || '/api'
      const resp = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ orderItems, shippingInfo, paymentInfo })
      })
      if (resp.ok) {
        try { await fetchCart() } catch {}
        router.push('/payment-success')
      } else {
        console.error('Order failed')
      }
    } catch (e) {
      console.error('Order error', e)
    }
  }

  const placeCardOrder = async () => {
    try {
      const orderItems = cartItems.map((i: any) => ({
        product: i.product?._id,
        quantity: i.quantity,
        size: i.size,
        color: i.color
      }))
      const shippingInfo = {
        firstName: formData.fullName.split(' ')[0] || formData.fullName,
        lastName: formData.fullName.split(' ').slice(1).join(' ') || '-',
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: 'N/A',
          zipCode: formData.postalCode,
          country: formData.country
        }
      }
      const paymentInfo = { id: 'card', status: 'paid', method: 'card' }
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const API_BASE: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL || '/api'
      const resp = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ orderItems, shippingInfo, paymentInfo })
      })
      if (resp.ok) {
        try { await fetchCart() } catch {}
        router.push('/payment-success')
      } else {
        console.error('Order failed')
      }
    } catch (e) {
      console.error('Order error', e)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/collections" className="text-orange-500 hover:text-orange-600">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-gray-500">Checkout</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            {/* Shipping Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your postal code"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    id="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              
              {/* Payment Method Selection (COD only) */}
              <div className="mb-6">
                <div className="flex space-x-4">
                  <div 
                    className={`border rounded-md p-4 flex items-center cursor-pointer ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mr-2"
                    />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                </div>
              </div>
              
              {/* Credit/Debit removed */}
              
              {paymentMethod === 'cod' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-md text-sm text-gray-700">
                    You chose Cash on Delivery. Please ensure your shipping details are correct. Payment will be collected at delivery.
                  </div>
                  <button
                    type="button"
                    onClick={placeCodOrder}
                    className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
                  >
                    Place Order (COD)
                  </button>
                </div>
              )}
              
              
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item: any) => (
                  <div key={item._id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      {item.product?.images?.[0]?.url ? (
                        <img src={item.product.images[0].url} alt={item.product?.name || 'Product'} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-500 text-xs">No Image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.product?.name || 'Product'}</h3>
                      <p className="text-sm text-gray-500">Size {item.size}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-900">₹{taxes.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Complete Purchase Button (only shown for card payment) */}
              {/* Card button removed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
