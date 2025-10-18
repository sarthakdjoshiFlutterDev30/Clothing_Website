'use client';

import { useState, useEffect } from 'react';

export default function MaintenanceTest() {
  const [maintenanceStatus, setMaintenanceStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://clothing-website-backend-g7te.onrender.com/api';
        console.log('Checking maintenance from:', `${API_BASE}/settings/maintenance`);
        
        const response = await fetch(`${API_BASE}/settings/maintenance`);
        const data = await response.json();
        
        console.log('Maintenance response:', data);
        setMaintenanceStatus(data);
      } catch (error) {
        console.error('Error checking maintenance:', error);
        setMaintenanceStatus({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
      } finally {
        setLoading(false);
      }
    };

    checkMaintenance();
  }, []);

  const toggleMaintenance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in as admin first');
        return;
      }

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://clothing-website-backend-g7te.onrender.com/api';
      
      // Get current settings
      const getResponse = await fetch(`${API_BASE}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!getResponse.ok) {
        throw new Error('Failed to get settings');
      }
      
      const settingsData = await getResponse.json();
      const currentSettings = settingsData.data;
      
      // Toggle maintenance mode
      const updatedSettings = {
        ...currentSettings,
        maintenanceMode: !currentSettings.maintenanceMode
      };
      
      console.log('Updating settings:', updatedSettings);
      
      // Update settings
      const updateResponse = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedSettings)
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update settings');
      }
      
      // Refresh maintenance status
      const maintenanceResponse = await fetch(`${API_BASE}/settings/maintenance`);
      const maintenanceData = await maintenanceResponse.json();
      setMaintenanceStatus(maintenanceData);
      
      alert(`Maintenance mode ${updatedSettings.maintenanceMode ? 'ENABLED' : 'DISABLED'}`);
      
    } catch (error) {
      console.error('Error toggling maintenance:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'An unknown error occurred'));
    }
  };

  if (loading) {
    return <div className="p-8">Loading maintenance status...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Maintenance Mode Test</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Current Status:</h2>
        <pre className="text-sm">{JSON.stringify(maintenanceStatus, null, 2)}</pre>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={toggleMaintenance}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Toggle Maintenance Mode
        </button>
        
        <div className="text-sm text-gray-600">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Make sure you&apos;re logged in as admin</li>
            <li>Click &quot;Toggle Maintenance Mode&quot; above</li>
            <li>Open a new tab and go to the main site</li>
            <li>You should see the maintenance page if enabled</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
