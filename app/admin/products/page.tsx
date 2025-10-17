'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authFetch } from '../../utils/staticAuth';
import { formatINR } from '../../utils/auth';

interface ProductImage { public_id: string; url: string }
interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  images?: ProductImage[];
  isActive: boolean;
  createdAt: string;
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const API_BASE: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    void fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/products?_t=${Date.now()}` , {
        cache: 'no-store'
      });
      const json: any = await response.json();
      const list: Product[] = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
      setProducts(list);
    } catch (e) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const res = await authFetch(`${API_BASE}/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (e) {
      setError('Failed to delete product');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const res = await authFetch(`${API_BASE}/products/${product._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !product.isActive })
      });
      if (!res.ok) throw new Error('Update failed');
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: !p.isActive } : p));
    } catch (e) {
      setError('Failed to update product');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <Link href="/admin/products/new" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Product</Link>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-3">
                        {product.images && product.images[0]?.url ? (
                          <img src={product.images[0].url} alt={product.name} className="h-10 w-10 rounded object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200" />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-gray-500 text-xs">{product.category}{product.brand ? ` • ${product.brand}` : ''}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatINR(product.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium space-x-3">
                        <button onClick={() => router.push(`/admin/products/edit/${product._id}`)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Inactive products card removed as active/deactive is not used */}
    </div>
  );
}
