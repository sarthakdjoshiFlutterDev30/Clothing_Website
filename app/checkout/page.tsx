'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Checkout() {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
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

  const cartItems = [
    {
      id: 1,
      name: "Classic Cotton T-Shirt",
      size: "M",
      price: 50.00,
      image: "/api/placeholder/80/80"
    },
    {
      id: 2,
      name: "Elegant Silk Blouse",
      size: "S",
      price: 75.00,
      image: "/api/placeholder/80/80"
    },
    {
      id: 3,
      name: "Kids' Denim Overalls",
      size: "5",
      price: 25.00,
      image: "/api/placeholder/80/80"
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const shipping = 10.00
  const taxes = 15.00
  const total = subtotal + shipping + taxes

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
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your card number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      id="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      id="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter CVV"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Image</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">Size {item.size}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-900">${taxes.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Complete Purchase Button */}
              <Link
                href="/payment-success"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg text-center block transition-colors duration-200"
              >
                Complete Purchase
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
