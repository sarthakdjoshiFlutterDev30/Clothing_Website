'use client';

import { useState, useEffect } from 'react';

export default function MaintenanceMode() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(true); // Start with true to block immediately
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        // Check if we're on an admin page only
        const currentPath = window.location.pathname;
        const isAdminPage = currentPath.startsWith('/admin');
        
        console.log('Current path:', currentPath);
        console.log('Is admin page:', isAdminPage);
        
        // Only allow admin pages during maintenance
        // STRICT MODE: No customer access at all, including auth pages
        if (isAdminPage) {
          console.log('Skipping maintenance check for admin page:', currentPath);
          setIsMaintenanceMode(false);
          setIsLoading(false);
          return;
        }

        // For non-admin pages, we need to check if maintenance mode is actually enabled
        // If maintenance is disabled, we should allow access

        // Check maintenance mode from backend
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://clothing-website-backend-g7te.onrender.com/api';
        console.log('Checking maintenance mode from:', `${API_BASE}/settings/maintenance`);
        const response = await fetch(`${API_BASE}/settings/maintenance`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Maintenance mode response:', data);
          console.log('Setting maintenance mode to:', data.maintenanceMode);
          setIsMaintenanceMode(data.maintenanceMode);
        } else {
          // Fallback to localStorage if backend is unavailable
          const storeSettings = localStorage.getItem('storeSettings');
          if (storeSettings) {
            try {
              const settings = JSON.parse(storeSettings);
              setIsMaintenanceMode(settings.maintenanceMode);
            } catch (error) {
              console.error('Error parsing store settings:', error);
              // If we can't determine maintenance mode, keep it true for non-admin pages
              setIsMaintenanceMode(true);
            }
          } else {
            // No settings found, keep maintenance mode true for non-admin pages
            setIsMaintenanceMode(true);
          }
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
        // Fallback to localStorage
        const storeSettings = localStorage.getItem('storeSettings');
        if (storeSettings) {
          try {
            const settings = JSON.parse(storeSettings);
            setIsMaintenanceMode(settings.maintenanceMode);
          } catch (error) {
            console.error('Error parsing store settings:', error);
            // If we can't determine maintenance mode, keep it true for non-admin pages
            setIsMaintenanceMode(true);
          }
        } else {
          // No settings found, keep maintenance mode true for non-admin pages
          setIsMaintenanceMode(true);
        }
      } finally {
        setIsLoading(false);
        console.log('Final maintenance mode state:', isMaintenanceMode);
      }
    };

    checkMaintenanceMode();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isMaintenanceMode) {
    console.log('Rendering maintenance page for path:', window.location.pathname);
    return (
      <div className="fixed inset-0 z-50 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="mb-8">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Under Maintenance</h1>
            <p className="text-gray-600 mb-6">
              The system is currently undergoing maintenance. All customer services and user authentication are temporarily unavailable. 
              Only administrators can access the system during this time.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What's happening?</h2>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                System updates and improvements
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Database optimization
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Security enhancements
              </li>
            </ul>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Expected completion: Within 30 minutes</p>
            <p className="mt-1">For urgent inquiries, please contact us at support@goodluckfashion.com</p>
          </div>

          <div className="mt-8 space-y-4">
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Page
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Administrator access only</p>
              <a 
                href="/admin" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Admin Panel
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
