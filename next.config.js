/** @type {import('next').NextConfig} */
  const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'http', hostname: 'res.cloudinary.com' }
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' 'inline-speculation-rules' chrome-extension: http://localhost:8097; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com http://res.cloudinary.com https://images.unsplash.com; font-src 'self' data:; connect-src 'self' https://clothing-website-backend-g7te.onrender.com https://cdn.jsdelivr.net http://localhost:8097 ws://localhost:8097;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
