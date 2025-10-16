'use client'

import Link from 'next/link'
import { useCart } from '../context/CartContext'

export default function CartIcon() {
  const { cart } = useCart()
  const itemCount = cart?.totalItems || 0

  return (
    <Link href="/cart" className="relative w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}
