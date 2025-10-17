'use client'

import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'

interface AddToCartButtonProps {
  productId: string
  productName: string
  price: number
  className?: string
  size?: string
  color?: string
  availableSizes?: string[]
  availableColors?: string[]
}

export default function AddToCartButton({ 
  productId, 
  productName, 
  price, 
  className = "btn-primary",
  size = "M",
  color = "Default",
  availableSizes,
  availableColors
}: AddToCartButtonProps) {
  const { addToCart, loading } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const computedSizes = Array.isArray(availableSizes) ? availableSizes : []
  const computedColors = Array.isArray(availableColors) ? availableColors : []
  const [optionsSizes, setOptionsSizes] = useState<string[]>(computedSizes)
  const [optionsColors, setOptionsColors] = useState<string[]>(computedColors)
  const [selectedSize, setSelectedSize] = useState<string>(computedSizes[0] || size)
  const [selectedColor, setSelectedColor] = useState<string>(computedColors[0] || color)
  const API_BASE: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL || 'https://clothing-website-backend-g7te.onrender.com/api'
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

  // Only show options provided by admin for this product
  const sizes = optionsSizes
  const colors = optionsColors

  // When opening options on listing cards, fetch full product if options were not supplied
  useEffect(() => {
    const shouldFetch = showOptions && (sizes.length === 0 || colors.length === 0)
    if (!shouldFetch) return

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/products/${productId}`, { cache: 'no-store' })
        if (!res.ok) return
        const json = await res.json()
        const product = json?.data ?? json
        const fetchedSizes: string[] = Array.isArray(product?.sizes) ? product.sizes.map((s: any) => s.size) : []
        const fetchedColors: string[] = Array.isArray(product?.colors) ? product.colors.map((c: any) => c.name) : []
        if (!cancelled) {
          setOptionsSizes(fetchedSizes)
          setOptionsColors(fetchedColors)
          if (fetchedSizes.length && !selectedSize) setSelectedSize(fetchedSizes[0])
          if (fetchedColors.length && !selectedColor) setSelectedColor(fetchedColors[0])
        }
      } catch {}
    })()

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOptions])

  if (showOptions) {
    return (
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-white">
        {sizes.length > 0 && (
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
        )}

        {colors.length > 0 && (
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
        )}

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
