import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { CartProvider } from './context/CartContext'
import CartIcon from './components/CartIcon'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Goodluck Fashion',
  description: 'Discover the latest trends in fashion. Shop our new arrivals and seasonal collections.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="text-xl font-bold text-gray-900">Goodluck Fashion</span>
              </Link>

              {/* Navigation */}
              <div className="flex items-center space-x-6 md:space-x-8">
                <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors">New Arrivals</Link>
                <Link href="/collections" className="text-gray-700 hover:text-orange-500 transition-colors">Collections</Link>
                <Link href="/sale" className="text-orange-500 font-medium">Sale</Link>
              </div>

              {/* Icons */}
              <div className="flex items-center space-x-4">
                <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <Link href="/profile" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                <CartIcon />
              </div>
            </div>
          </nav>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4 md:mb-0">
                <Link href="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
                <Link href="/collections" className="text-gray-600 hover:text-gray-900">Collections</Link>
                <Link href="/sale" className="text-orange-600 hover:text-orange-700">Sale</Link>
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                <Link href="/auth/register" className="text-gray-600 hover:text-gray-900">Register</Link>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</Link>
              </div>
              <div className="flex space-x-4 mb-4 md:mb-0">
                <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </button>
                <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>
              <p className="text-gray-500 text-sm">&copy;2024 Goodluck Fashion. All rights reserved.</p>
            </div>
          </div>
        </footer>
        </CartProvider>
      </body>
    </html>
  )
}
