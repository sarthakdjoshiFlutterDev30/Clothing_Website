'use client';

import { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Goodluck Fashion',
    siteDescription: 'Premium clothing and accessories',
    contactEmail: 'contact@goodluckfashion.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Fashion Street, New York, NY 10001',
    enableNotifications: true,
    maintenanceMode: false,
    taxRate: 8.5,
    shippingFee: 5.99
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseFloat(value)
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // In a real application, you would send this to your backend
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(settings)
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to update settings');
      // }

      // Simulate API call success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSuccess('Settings updated successfully');
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Store Settings</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">General Settings</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Basic store information</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                  Store Name
                </label>
                <input
                  type="text"
                  name="siteName"
                  id="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                  Store Description
                </label>
                <input
                  type="text"
                  name="siteDescription"
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={settings.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Store Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Store Configuration</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Advanced settings</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="taxRate"
                  id="taxRate"
                  value={settings.taxRate}
                  onChange={handleNumberChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="shippingFee" className="block text-sm font-medium text-gray-700">
                  Default Shipping Fee ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="shippingFee"
                  id="shippingFee"
                  value={settings.shippingFee}
                  onChange={handleNumberChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enableNotifications"
                      name="enableNotifications"
                      type="checkbox"
                      checked={settings.enableNotifications}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enableNotifications" className="font-medium text-gray-700">
                      Enable Email Notifications
                    </label>
                    <p className="text-gray-500">Send notifications for new orders and customer inquiries</p>
                  </div>
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="maintenanceMode"
                      name="maintenanceMode"
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
                      Maintenance Mode
                    </label>
                    <p className="text-gray-500">Temporarily disable the store for maintenance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}