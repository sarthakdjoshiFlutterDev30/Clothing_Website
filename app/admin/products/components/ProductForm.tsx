'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  productId?: string;
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    images: []
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setFormData(data);
      setImageUrls(data.images);
    } catch (error) {
      setError('Failed to fetch product');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);

      // Create preview URLs
      const urls = files.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...urls]);
    }
  };

  const uploadImages = async () => {
    const uploadedUrls = [];
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'clothing_store'); // Set your Cloudinary upload preset

      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      } catch (error) {
        throw new Error('Failed to upload images');
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      let uploadedImageUrls = [];

      if (imageFiles.length > 0) {
        uploadedImageUrls = await uploadImages();
      }

      const productData = {
        ...formData,
        images: [...formData.images, ...uploadedImageUrls]
      };

      const url = productId
        ? `http://localhost:5000/api/products/${productId}`
        : 'http://localhost:5000/api/products';

      const response = await fetch(url, {
        method: productId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) throw new Error('Failed to save product');

      router.push('/admin/products');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          id="description"
          required
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            id="stock"
            required
            min="0"
            value={formData.stock}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          id="category"
          required
          value={formData.category}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Product Images</label>
        <div className="mt-2">
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        {imageUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Product ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {loading ? 'Saving...' : (productId ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
}