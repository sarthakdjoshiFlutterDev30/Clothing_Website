export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-orange-500 font-semibold mb-4">TRUSTED SINCE YEARS IN RAJKOT FASHION MARKET</p>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Goodluck Fashion</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Goodluck Fashion has been a trusted name in the Rajkot fashion market for years, offering 
            carefully curated selections for men, women, and kids. We are committed to excellence and 
            customer satisfaction in everything we do.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
          <p className="text-lg text-gray-600 max-w-4xl">
            Goodluck Fashion was founded with a passion for fashion and a vision to bring the latest 
            trends to our customers. What started as a small boutique has grown into one of the leading 
            fashion retailers in Rajkot. We believe in timeless elegance and quality craftsmanship, 
            ensuring that every piece in our collection meets the highest standards.
          </p>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality</h3>
              <p className="text-gray-600">
                We are committed to sourcing the finest materials and working with skilled artisans 
                to create clothing that not only looks great but also stands the test of time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Satisfaction</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We strive to provide a 
                personalized and enjoyable shopping experience that exceeds expectations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Style</h3>
              <p className="text-gray-600">
                We offer a diverse range of styles, from contemporary to classic, ensuring that 
                every customer can find pieces that express their unique personality and taste.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Commitment */}
      <div className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Commitment</h2>
          <p className="text-lg text-gray-600 max-w-4xl">
            At Goodluck Fashion, we are committed to providing the best possible shopping experience 
            for our customers. From our carefully curated collections to our friendly and knowledgeable 
            staff, we believe that fashion should be accessible, enjoyable, and empowering. We continue 
            to evolve and grow, always keeping our customers&apos; needs and preferences at the forefront 
            of everything we do.
          </p>
        </div>
      </div>
    </div>
  )
}
