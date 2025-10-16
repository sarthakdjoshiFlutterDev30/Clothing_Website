'use client';

import ProductForm from '../components/ProductForm';

export default function NewProduct() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}