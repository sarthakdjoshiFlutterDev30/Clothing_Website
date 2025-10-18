'use client';

import ProductForm from '../../components/ProductForm';

export default function EditProduct({
  params
}: {
  params: { id: string }
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
      <div className="bg-white shadow rounded-lg text-gray-900">
        <div className="px-4 py-5 sm:p-6 text-gray-900">
          <ProductForm productId={params.id} />
        </div>
      </div>
    </div>
  );
}