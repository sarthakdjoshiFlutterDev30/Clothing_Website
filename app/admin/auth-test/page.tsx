'use client';

import { useState } from 'react';

export default function AuthTest() {
  const [authStatus, setAuthStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'EXISTS' : 'NOT FOUND');
      
      if (!token) {
        setAuthStatus({ error: 'No token found in localStorage' });
        return;
      }

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://clothing-website-backend-g7te.onrender.com/api';
      
      // Test authentication by trying to get settings
      const response = await fetch(`${API_BASE}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Auth test response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        setAuthStatus({ 
          success: true, 
          message: 'Authentication successful',
          settings: data.data 
        });
      } else {
        const errorText = await response.text();
        console.error('Auth error response:', errorText);
        setAuthStatus({ 
          error: `Authentication failed: ${response.status}`,
          details: errorText
        });
      }
    } catch (error) {
      console.error('Auth test error:', error);
      setAuthStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testMaintenanceToggle = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in first.');
        return;
      }

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://clothing-website-backend-g7te.onrender.com/api';
      
      // Get current settings
      console.log('Getting current settings...');
      const getResponse = await fetch(`${API_BASE}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!getResponse.ok) {
        const errorText = await getResponse.text();
        throw new Error(`Failed to get settings: ${getResponse.status} - ${errorText}`);
      }

      const settingsData = await getResponse.json();
      console.log('Current settings:', settingsData);
      
      const currentSettings = settingsData.data;
      const newMaintenanceMode = !currentSettings.maintenanceMode;
      
      // Update settings
      const updatedSettings = {
        ...currentSettings,
        maintenanceMode: newMaintenanceMode
      };

      console.log('Updating settings to:', updatedSettings);

      const updateResponse = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedSettings)
      });

      console.log('Update response status:', updateResponse.status);

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to update settings: ${updateResponse.status} - ${errorText}`);
      }

      const updateData = await updateResponse.json();
      console.log('Update successful:', updateData);

      // Verify the change
      const verifyResponse = await fetch(`${API_BASE}/settings/maintenance`);
      const verifyData = await verifyResponse.json();
      console.log('Verification:', verifyData);

      alert(`Maintenance mode ${newMaintenanceMode ? 'ENABLED' : 'DISABLED'} successfully!`);
      
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication & Maintenance Mode Test</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={checkAuth}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Authentication'}
        </button>
        
        <button
          onClick={testMaintenanceToggle}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
        >
          {loading ? 'Toggling...' : 'Toggle Maintenance Mode'}
        </button>
      </div>

      {authStatus && (
        <div className={`p-4 rounded-lg ${authStatus.error ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'}`}>
          <h3 className="font-semibold mb-2">
            {authStatus.error ? '❌ Authentication Failed' : '✅ Authentication Success'}
          </h3>
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(authStatus, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Make sure you're logged in as admin at <code>/admin/login</code></li>
          <li>Click "Test Authentication" to verify your token works</li>
          <li>If authentication works, click "Toggle Maintenance Mode"</li>
          <li>Open a new tab and go to the main site to see the maintenance page</li>
          <li>Check browser console (F12) for detailed logs</li>
        </ol>
        
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 font-medium">🔒 STRICT Maintenance Mode:</p>
          <p className="text-red-700 text-xs mt-1">
            <strong>NO CUSTOMER ACCESS:</strong> All customer panels are completely blocked. 
            Only admin login (<code>/auth/login</code>) and admin pages (<code>/admin/*</code>) 
            are accessible. Profile, products, cart, checkout - everything is blocked.
          </p>
        </div>
      </div>
    </div>
  );
}
