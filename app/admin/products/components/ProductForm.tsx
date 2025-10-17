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
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  brand: string;
  stock: number;
  images: string[];
  sizes?: { size: string; stock: number }[];
  colors?: { name: string; hex: string }[];
  shippingInfo?: { freeShipping: boolean; estimatedDelivery: string };
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const CATEGORY_OPTIONS = ['men', 'women', 'kids'];
  const SUBCATEGORY_OPTIONS: Record<string, string[]> = {
    men: ['t-shirts', 'shirts', 'jeans', 'trousers', 'shorts', 'ethnic'],
    women: ['kurtis', 'sarees', 'tops', 'jeans', 'dresses', 'ethnic'],
    kids: ['boys wear', 'girls wear', 'infant']
  };
  const COLOR_OPTIONS: { name: string; hex: string }[] = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Navy', hex: '#001f3f' },
    { name: 'Blue', hex: '#0074D9' },
    { name: 'Sky Blue', hex: '#87CEEB' },
    { name: 'Teal', hex: '#39CCCC' },
    { name: 'Green', hex: '#2ECC40' },
    { name: 'Olive', hex: '#3D9970' },
    { name: 'Lime', hex: '#01FF70' },
    { name: 'Yellow', hex: '#FFDC00' },
    { name: 'Orange', hex: '#FF851B' },
    { name: 'Red', hex: '#FF4136' },
    { name: 'Maroon', hex: '#85144b' },
    { name: 'Purple', hex: '#B10DC9' },
    { name: 'Pink', hex: '#F012BE' },
    { name: 'Brown', hex: '#8B4513' },
    { name: 'Beige', hex: '#F5F5DC' }
  ];
  const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const API_BASE: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL || 'https://clothing-website-backend-g7te.onrender.com/api';
  const CLOUD_NAME: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  const UPLOAD_PRESET: string = (globalThis as any)?.process?.env?.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
  
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    brand: 'Goodluck Fashion',
    stock: 0,
    images: [],
    originalPrice: undefined,
    discount: undefined,
    subcategory: '',
    sizes: [],
    colors: [],
    shippingInfo: { freeShipping: false, estimatedDelivery: '3-5 business days' }
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Ensure subcategory remains valid for selected category
  useEffect(() => {
    if (!formData.category) return;
    const allowed = SUBCATEGORY_OPTIONS[formData.category] || [];
    if (formData.subcategory && !allowed.includes(String(formData.subcategory).toLowerCase())) {
      setFormData(prev => ({ ...prev, subcategory: '' }));
    }
  }, [formData.category]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await response.json();
      const product = json?.data ?? json;
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        category: product.category,
        subcategory: product.subcategory,
        brand: 'Goodluck Fashion',
        stock: product.stock,
        images: (product.images || []).map((img: any) => img.url),
        sizes: product.sizes && product.sizes.length ? product.sizes : [{ size: 'M', stock: product.stock ?? 0 }],
        colors: product.colors && product.colors.length ? product.colors : [{ name: 'Default', hex: '#000000' }],
        shippingInfo: product.shippingInfo || { freeShipping: false, estimatedDelivery: '3-5 business days' }
      });
      setImageUrls((product.images || []).map((img: any) => img.url));
    } catch (error) {
      setError('Failed to fetch product');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'price' || name === 'stock' || name === 'originalPrice' || name === 'discount') ? Number(value) : value
    }));
  };

  // Auto-calculate price based on originalPrice and discount percentage
  useEffect(() => {
    setFormData(prev => {
      const base = Number(prev.originalPrice) || 0;
      const pct = Number(prev.discount) || 0;
      const computed = base * (1 - Math.min(Math.max(pct, 0), 100) / 100);
      const rounded = Number.isFinite(computed) ? Number(computed.toFixed(2)) : 0;
      if (rounded === prev.price) return prev;
      return { ...prev, price: rounded };
    });
  }, [formData.originalPrice, formData.discount]);

  // Removed isActive toggle; active state is not editable here

  const addSize = () => {
    setFormData(prev => ({ ...prev, sizes: [...(prev.sizes || []), { size: '', stock: 0 }] }));
  };
  const updateSize = (index: number, field: 'size' | 'stock', value: string) => {
    setFormData(prev => {
      const next = [...(prev.sizes || [])];
      next[index] = { ...next[index], [field]: field === 'stock' ? Number(value) : value };
      return { ...prev, sizes: next };
    });
  };
  const removeSize = (index: number) => {
    setFormData(prev => {
      const next = [...(prev.sizes || [])];
      next.splice(index, 1);
      return { ...prev, sizes: next };
    });
  };

  const addColor = () => {
    setFormData(prev => ({ ...prev, colors: [...(prev.colors || []), { name: '', hex: '#000000' }] }));
  };
  const updateColor = (index: number, field: 'name' | 'hex', value: string) => {
    setFormData(prev => {
      const next = [...(prev.colors || [])];
      const v = field === 'hex' ? (value || '#000000') : value;
      next[index] = { ...next[index], [field]: v };
      return { ...prev, colors: next };
    });
  };
  const removeColor = (index: number) => {
    setFormData(prev => {
      const next = [...(prev.colors || [])];
      next.splice(index, 1);
      return { ...prev, colors: next };
    });
  };

  const isColorSelected = (hex: string) => (formData.colors || []).some(c => (c.hex || '').toLowerCase() === hex.toLowerCase());
  const toggleColor = (option: { name: string; hex: string }) => {
    setFormData(prev => {
      const current = prev.colors || [];
      const exists = current.findIndex(c => (c.hex || '').toLowerCase() === option.hex.toLowerCase());
      if (exists >= 0) {
        const next = [...current];
        next.splice(exists, 1);
        return { ...prev, colors: next };
      }
      return { ...prev, colors: [...current, { name: option.name, hex: option.hex }] };
    });
  };

  

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    // If Cloudinary config is present, upload immediately and use secure URLs for preview
    if (CLOUD_NAME && UPLOAD_PRESET) {
      try {
        setLoading(true);
        for (const file of files) {
          const form = new FormData();
          form.append('file', file);
          form.append('upload_preset', UPLOAD_PRESET);

          const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: form
          });
          const data = await res.json();
          if (data && data.secure_url) {
            setImageUrls(prev => [...prev, data.secure_url]);
            setFormData(prev => ({ ...prev, images: [...prev.images, data.secure_url] }));
          }
        }
        // We uploaded already, no need to keep local files for submit
        setImageFiles([]);
      } catch (err) {
        setError('Image upload failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Fallback: show local previews; files will be sent to backend on submit
      setImageFiles(prev => [...prev, ...files]);
      const urls = files.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...urls]);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const uploadedUrls = [];
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET || '');

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
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
      // Front-end required-field validation with alert
      const missing: string[] = [];
      if (!String(formData.name).trim()) missing.push('Product Name');
      if (!String(formData.description).trim()) missing.push('Description');
      if (!String(formData.category).trim()) missing.push('Category');
      if (!String(formData.subcategory || '').trim()) missing.push('Subcategory');
      if (!(Number(formData.originalPrice) > 0)) missing.push('Original Price');
      if (!(Number(formData.price) > 0)) missing.push('Price');
      if (!(Number(formData.stock) >= 0)) missing.push('Stock');
      const hasImages = (imageFiles && imageFiles.length > 0) || (formData.images && formData.images.length > 0);
      if (!hasImages) missing.push('Product Images');
      if ((formData.sizes || []).length > 0) {
        const invalidSize = (formData.sizes || []).some(s => !String(s.size).trim() || !(Number(s.stock) >= 0));
        if (invalidSize) missing.push('Sizes (size and stock)');
      }
      if (missing.length > 0) {
        window.alert(`Please fill the following required fields before submitting:\n- ${missing.join('\n- ')}`);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');

      const hasNewFiles = imageFiles.length > 0;
      const url = productId
        ? `${API_BASE}/products/${productId}`
        : `${API_BASE}/products`;

      let response: Response;

      if (hasNewFiles) {
        // Send multipart/form-data directly to backend which will upload to Cloudinary
        const form = new FormData();
        form.append('name', formData.name);
        form.append('description', formData.description);
        form.append('price', String(formData.price));
        if (formData.originalPrice != null && formData.originalPrice !== undefined && formData.originalPrice !== ('' as any)) form.append('originalPrice', String(formData.originalPrice));
        if (formData.discount != null && formData.discount !== undefined && formData.discount !== ('' as any)) form.append('discount', String(formData.discount));
        form.append('category', formData.category);
        if (formData.subcategory) form.append('subcategory', formData.subcategory);
        form.append('brand', 'Goodluck Fashion');
        form.append('stock', String(formData.stock));
        // isActive removed from form submission
        if (formData.sizes) form.append('sizes', JSON.stringify(formData.sizes));
        if (formData.colors) form.append('colors', JSON.stringify(formData.colors));
        if (formData.shippingInfo) form.append('shippingInfo', JSON.stringify(formData.shippingInfo));
        formData.images.forEach((url) => form.append('images', url));
        imageFiles.forEach((file) => form.append('images', file));

        response = await fetch(url, {
          method: productId ? 'PUT' : 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form
        });
      } else {
        // JSON update when not adding new files
        const payload = {
          ...formData,
          brand: 'Goodluck Fashion'
        };
        response = await fetch(url, {
          method: productId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

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

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            id="category"
            required
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>Select a category</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Subcategory</label>
          <select
            name="subcategory"
            id="subcategory"
            required
            disabled={!formData.category}
            value={formData.subcategory || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="" disabled>{formData.category ? 'Select a subcategory' : 'Select category first'}</option>
            {(SUBCATEGORY_OPTIONS[formData.category] || []).map((sc) => (
              <option key={sc} value={sc}>{sc.charAt(0).toUpperCase() + sc.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">Original Price</label>
          <input
            type="number"
            name="originalPrice"
            id="originalPrice"
            required
            min="0"
            step="0.01"
            value={formData.originalPrice ?? ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%)</label>
          <input
            type="number"
            name="discount"
            id="discount"
            min="0"
            max="100"
            value={formData.discount ?? ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
        <input
          type="text"
          name="brand"
          id="brand"
          value={formData.brand}
          readOnly
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-700"
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
            readOnly
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
            value={Number.isFinite(Number(formData.stock)) ? formData.stock : ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      

      {/* Removed Active toggle UI */}

      <div>
        <label className="block text-sm font-medium text-gray-700">Sizes</label>
        <div className="space-y-2 mt-2">
          {(formData.sizes || []).map((s, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 items-end">
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={s.size}
                onChange={(e) => updateSize(i, 'size', e.target.value)}
              >
                <option value="" disabled>Select size</option>
                {SIZE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <input type="number" placeholder="Stock" value={s.stock} onChange={(e) => updateSize(i, 'stock', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
              <button type="button" onClick={() => removeSize(i)} className="px-3 py-2 bg-red-50 text-red-700 rounded-md border border-red-200">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addSize} className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">Add Size</button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Colors</label>
        <div className="mt-3 grid grid-cols-6 gap-3">
          {COLOR_OPTIONS.map(opt => (
            <button
              type="button"
              key={opt.hex}
              onClick={() => toggleColor(opt)}
              className={`relative h-10 rounded border ${isColorSelected(opt.hex) ? 'ring-2 ring-offset-2 ring-indigo-500' : 'border-gray-300'}`}
              title={opt.name}
              aria-pressed={isColorSelected(opt.hex)}
              style={{ backgroundColor: opt.hex }}
            >
              <span className="sr-only">{opt.name}</span>
            </button>
          ))}
        </div>
        {(formData.colors && formData.colors.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.colors.map((c, i) => (
              <span key={`${c.hex}-${i}`} className="inline-flex items-center space-x-2 px-2 py-1 text-sm border border-gray-300 rounded">
                <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: c.hex }} />
                <span>{c.name}</span>
                <button type="button" className="text-red-600" onClick={() => removeColor(i)}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      

      <div>
        <label className="block text-sm font-medium text-gray-700">Shipping Info</label>
        <div className="grid grid-cols-2 gap-6 mt-2">
          <div className="flex items-center space-x-2">
            <input id="freeShipping" type="checkbox" checked={!!formData.shippingInfo?.freeShipping} onChange={(e) => setFormData(prev => ({ ...prev, shippingInfo: { ...(prev.shippingInfo || { estimatedDelivery: '' }), freeShipping: e.target.checked } }))} className="h-4 w-4" />
            <label htmlFor="freeShipping" className="text-sm font-medium text-gray-700">Free Shipping</label>
          </div>
          <div>
            <input type="text" placeholder="Estimated delivery" value={formData.shippingInfo?.estimatedDelivery || ''} onChange={(e) => setFormData(prev => ({ ...prev, shippingInfo: { ...(prev.shippingInfo || { freeShipping: false }), estimatedDelivery: e.target.value } }))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          </div>
        </div>
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
              <div key={index} className="relative group">
                <img src={url} alt={`Product ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs hidden group-hover:block"
                  aria-label="Remove image"
                >
                  ×
                </button>
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