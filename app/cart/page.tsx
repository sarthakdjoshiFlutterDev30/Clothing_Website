'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, loading, error, updateCartItem, removeFromCart, clearCart } = useCart()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const router = useRouter()

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setIsUpdating(itemId)
    await updateCartItem(itemId, newQuantity)
    setIsUpdating(null)
  }

  const handleRemoveItem = async (itemId: string) => {
    setIsUpdating(itemId)
    await removeFromCart(itemId)
    setIsUpdating(null)
  }

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart()
    }
  }

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) return
    router.push('/checkout')
  }

  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/collections" className="btn-primary text-lg px-8 py-4">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="heading-hero">Shopping Cart</h1>
          <p className="text-body">Review your items before checkout</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="card-modern p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Cart Items ({cart.totalItems})
                </h2>
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={isUpdating === item._id || item.quantity <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <span className="w-12 text-center font-medium">
                        {isUpdating === item._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mx-auto"></div>
                        ) : (
                          item.quantity
                        )}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={isUpdating === item._id}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      disabled={isUpdating === item._id}
                      className="text-red-600 hover:text-red-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating === item._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="card-modern p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${cart.totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {cart.totalPrice > 100 ? 'Free' : '$10.00'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${(cart.totalPrice * 0.1).toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${(cart.totalPrice + (cart.totalPrice > 100 ? 0 : 10) + (cart.totalPrice * 0.1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary w-full mt-6 py-4 text-lg"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/collections"
                className="block text-center text-orange-600 hover:text-orange-700 mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
