'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authFetch, getAuthHeaders, STATIC_TOKEN } from '../utils/staticAuth'

interface CartItem {
  _id: string
  product: {
    _id: string
    name: string
    price: number
    images: Array<{ url: string }>
  }
  quantity: number
  size: string
  color: string
  price: number
}

interface Cart {
  _id: string
  user: string
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

interface CartContextType {
  cart: Cart | null
  loading: boolean
  error: string
  addToCart: (productId: string, quantity: number, size: string, color: string) => Promise<void>
  updateCartItem: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  fetchCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Using static authentication headers from staticAuth utility
  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await authFetch('/api/cart')

      if (response.ok) {
        const data = await response.json()
        setCart(data.data)
      } else if (response.status === 401) {
        // User not authenticated, clear cart
        setCart(null)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number, size: string, color: string) => {
    try {
      setLoading(true)
      setError('')
      
      const response = await authFetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId,
          quantity,
          size,
          color
        })
      })

      const data = await response.json()

      if (response.ok) {
        setCart(data.data)
      } else {
        setError(data.message || 'Failed to add item to cart')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      setLoading(true)
      setError('')
      
      const response = await authFetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      })

      const data = await response.json()

      if (response.ok) {
        setCart(data.data)
      } else {
        setError(data.message || 'Failed to update cart item')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true)
      setError('')
      
      const response = await authFetch(`/api/cart/${itemId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setCart(data.data)
      } else {
        setError(data.message || 'Failed to remove item from cart')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await authFetch('/api/cart', {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setCart(data.data)
      } else {
        setError(data.message || 'Failed to clear cart')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
