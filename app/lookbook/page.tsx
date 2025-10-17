'use client'

import Link from 'next/link'

const IMAGES: { src: string; alt: string }[] = [
  { src: 'https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1600&auto=format&fit=crop', alt: 'Modern fashion boutique exterior' },
  { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop', alt: 'Assorted clothing on rack' },
  { src: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=1600&auto=format&fit=crop', alt: 'Streetwear denim wall' },
  { src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop', alt: 'Minimal storefront with mannequins' },
  { src: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop', alt: 'Clean shop interior' },
  { src: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1600&auto=format&fit=crop', alt: 'Accessories and bags display' },
]

export default function Lookbook() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lookbook</h1>
          <Link href="/collections" className="btn-secondary">Back to Collections</Link>
        </div>

        <p className="text-gray-600 mb-8">A curated gallery of shop vibes and outfit inspiration.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {IMAGES.map((img, i) => (
            <div key={i} className="group overflow-hidden rounded-xl shadow-sm bg-white">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-700">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


