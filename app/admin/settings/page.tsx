'use client';

import { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Goodluck Fashion',
    siteDescription: 'Premium clothing and accessories',
    contactEmail: 'contact@goodluckfashion.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Fashion Street, New York, NY 10001',
    gstNumber: 'GSTIN: 22AAAAA0000A1Z5',
    enableNotifications: true,
    maintenanceMode: false,
    taxRate: 8.5,
    shippingFee: 5.99
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://clothing-website-backend-g7te.onrender.com/api';
        const response = await fetch(`${API_BASE}/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSettings(prevSettings => ({ ...prevSettings, ...data.data }));
        } else {
          // Fallback to localStorage
          const savedSettings = localStorage.getItem('storeSettings');
          if (savedSettings) {
            try {
              const parsedSettings = JSON.parse(savedSettings);
              setSettings(prevSettings => ({ ...prevSettings, ...parsedSettings }));
            } catch (error) {
              console.error('Error parsing saved settings:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // Fallback to localStorage
        const savedSettings = localStorage.getItem('storeSettings');
        if (savedSettings) {
          try {
            const parsedSettings = JSON.parse(savedSettings);
            setSettings(prevSettings => ({ ...prevSettings, ...parsedSettings }));
          } catch (error) {
            console.error('Error parsing saved settings:', error);
          }
        }
      }
    };

    loadSettings();
  }, []);

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

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://clothing-website-backend-g7te.onrender.com/api';
      console.log('Saving settings to:', `${API_BASE}/settings`);
      console.log('Settings data:', settings);
      const response = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to update settings');
      }

      const responseData = await response.json();
      console.log('Settings saved successfully:', responseData);

      // Also save to localStorage as backup
      localStorage.setItem('storeSettings', JSON.stringify(settings));
      
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

      {/* Debug section to show current settings */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Current Settings Preview:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Store Name:</strong> {settings.siteName}</div>
            <div><strong>Description:</strong> {settings.siteDescription}</div>
            <div><strong>Email:</strong> {settings.contactEmail}</div>
            <div><strong>Phone:</strong> {settings.phoneNumber}</div>
            <div><strong>Address:</strong> {settings.address}</div>
            <div><strong>GST Number:</strong> {settings.gstNumber}</div>
            <div className={`mt-2 px-2 py-1 rounded text-xs font-medium ${settings.maintenanceMode ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              <strong>Maintenance Mode:</strong> {settings.maintenanceMode ? 'ENABLED' : 'DISABLED'}
            </div>
          </div>
      </div>

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

      {settings.maintenanceMode && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <strong>Maintenance Mode is ENABLED!</strong> Your store is currently offline for customers. 
              Only admin users can access the site. Disable maintenance mode to make your store live again.
            </div>
          </div>
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
                  GST/Tax ID
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  id="gstNumber"
                  value={settings.gstNumber}
                  onChange={handleChange}
                  placeholder="GSTIN: 22AAAAA0000A1Z5"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
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