// Test script to enable maintenance mode
const API_BASE = 'https://clothing-website-backend-g7te.onrender.com/api';

async function enableMaintenanceMode() {
  try {
    // First, get current settings
    console.log('Getting current settings...');
    const getResponse = await fetch(`${API_BASE}/settings`);
    
    if (!getResponse.ok) {
      throw new Error('Failed to get settings');
    }
    
    const settingsData = await getResponse.json();
    console.log('Current settings:', settingsData);
    
    // Update maintenance mode to true
    const updatedSettings = {
      ...settingsData.data,
      maintenanceMode: true
    };
    
    console.log('Updating settings with maintenance mode enabled...');
    const updateResponse = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // You'll need to replace this with a valid token
      },
      body: JSON.stringify(updatedSettings)
    });
    
    if (!updateResponse.ok) {
      throw new Error('Failed to update settings');
    }
    
    const result = await updateResponse.json();
    console.log('Settings updated successfully:', result);
    
    // Test maintenance mode endpoint
    console.log('Testing maintenance mode endpoint...');
    const maintenanceResponse = await fetch(`${API_BASE}/settings/maintenance`);
    const maintenanceData = await maintenanceResponse.json();
    console.log('Maintenance mode status:', maintenanceData);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the test
enableMaintenanceMode();
