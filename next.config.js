/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' 'inline-speculation-rules' chrome-extension: http://localhost:8097; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' http://localhost:5000 https://cdn.jsdelivr.net http://localhost:8097 ws://localhost:8097;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
