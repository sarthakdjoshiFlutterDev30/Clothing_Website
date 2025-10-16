'use client'

import { useState } from 'react'
import { useCart } from '../context/CartContext'

interface AddToCartButtonProps {
  productId: string
  productName: string
  price: number
  className?: string
  size?: string
  color?: string
}

export default function AddToCartButton({ 
  productId, 
  productName, 
  price, 
  className = "btn-primary",
  size = "M",
  color = "Default"
}: AddToCartButtonProps) {
  const { addToCart, loading } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [selectedSize, setSelectedSize] = useState(size)
  const [selectedColor, setSelectedColor] = useState(color)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addToCart(productId, quantity, selectedSize, selectedColor)
      setShowOptions(false)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Gray', 'Navy', 'Brown']

  if (showOptions) {
    return (
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-white">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="form-input"
          >
            {sizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="form-input"
          >
            {colors.map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || loading}
            className="btn-primary flex-1"
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
          <button
            onClick={() => setShowOptions(false)}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowOptions(true)}
      disabled={loading}
      className={className}
    >
      Add to Cart
    </button>
  )
}
