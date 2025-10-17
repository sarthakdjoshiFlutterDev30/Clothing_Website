import Link from 'next/link'
import AddToCartButton from './components/AddToCartButton'

export default function Home() {
  const LOOKBOOK_IMAGES: { src: string; alt: string }[] = [
    { src: 'https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1200&auto=format&fit=crop', alt: 'Modern fashion boutique exterior' },
    { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop', alt: 'Assorted clothing on rack' },
    { src: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=1200&auto=format&fit=crop', alt: 'Streetwear denim wall' },
    { src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop', alt: 'Minimal storefront with mannequins' },
    { src: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop', alt: 'Clean shop interior' },
    { src: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1200&auto=format&fit=crop', alt: 'Accessories and bags display' }
  ]
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-yellow-500/10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 animate-fade-in">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4 animate-slide-up">
              ✨ New Collection Available
            </span>
          </div>
          <h1 className="heading-hero text-gray-900 mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Style That <span className="gradient-text">Speaks</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.4s'}}>
            Discover the latest trends in fashion. Shop our new arrivals and seasonal collections 
            with premium quality and modern designs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.6s'}}>
            <Link href="/collections" className="btn-primary text-lg px-8 py-4">
              Shop Now
            </Link>
            <Link href="/about" className="btn-secondary text-lg px-8 py-4">
              Learn More
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-orange-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-orange-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Explore Our Collections */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="heading-section animate-fade-in">
              Explore Our <span className="gradient-text">Collections</span>
            </h2>
            <p className="text-body max-w-3xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
              Find the perfect outfit for every occasion. Our curated collections offer a wide range of styles to suit your unique taste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 grid-modern">
            {/* Women's Collection */}
            <Link href="/collections?category=women" className="group relative overflow-hidden rounded-2xl hover-lift">
              <div className="aspect-[4/5] bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent"></div>
                <div className="text-center relative z-10">
                  <div className="w-32 h-40 bg-gradient-to-br from-pink-300 to-pink-400 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-pink-600 text-3xl">👗</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">Women&apos;s</h3>
                  <p className="text-gray-600 mt-2">Elegant & Stylish</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>

            {/* Men's Collection */}
            <Link href="/collections?category=men" className="group relative overflow-hidden rounded-2xl hover-lift">
              <div className="aspect-[4/5] bg-gradient-to-br from-blue-100 via-sky-50 to-blue-200 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                <div className="text-center relative z-10">
                  <div className="w-32 h-40 bg-gradient-to-br from-blue-300 to-blue-400 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-blue-600 text-3xl">👔</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Men&apos;s</h3>
                  <p className="text-gray-600 mt-2">Classic & Modern</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>

            {/* Kids Collection */}
            <Link href="/collections?category=kids" className="group relative overflow-hidden rounded-2xl hover-lift">
              <div className="aspect-[4/5] bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-200 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent"></div>
                <div className="text-center relative z-10">
                  <div className="w-32 h-40 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-yellow-600 text-3xl">👶</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">Kids</h3>
                  <p className="text-gray-600 mt-2">Fun & Comfortable</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Seasonal Offers */}
      <div className="py-24 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500/5 via-transparent to-yellow-500/5"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="heading-section animate-fade-in">
            Seasonal <span className="gradient-text">Offers</span>
          </h2>
          <p className="text-body mb-12 max-w-3xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
            Don&apos;t miss out on our exclusive seasonal offers. Shop now and save on your favorite styles.
          </p>
          <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Link href="/collections?category=sale" className="btn-primary text-lg px-12 py-4">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Lookbook Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading-section text-center animate-fade-in">Lookbook</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 grid-modern">
            {LOOKBOOK_IMAGES.map((img, index) => (
              <div
                key={img.src}
                className="aspect-square rounded-2xl overflow-hidden hover-lift group cursor-pointer bg-white shadow-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500/5 via-transparent to-yellow-500/5"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="heading-section text-center animate-fade-in">
            Customer <span className="gradient-text">Testimonials</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 grid-modern">
            <div className="card-modern p-8 hover-glow">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full mr-4 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Sophia Carter</h4>
                  <p className="text-sm text-gray-500">July 15, 2023</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">&quot;I absolutely love the quality and style of the clothes from Goodluck Fashion. The Urban Chic collection is my favorite!&quot;</p>
            </div>

            <div className="card-modern p-8 hover-glow">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full mr-4 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">E</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Ethan Bennett</h4>
                  <p className="text-sm text-gray-500">June 22, 2023</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-gray-600 leading-relaxed">&quot;The Summer Breeze collection is perfect for the warm weather. The fabrics are light and comfortable.&quot;</p>
            </div>

            <div className="card-modern p-8 hover-glow">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full mr-4 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">O</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Olivia Hayes</h4>
                  <p className="text-sm text-gray-500">May 10, 2023</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">&quot;I wore the Evening Elegance dress to a gala, and I received so many compliments. The fit was perfect!&quot;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

