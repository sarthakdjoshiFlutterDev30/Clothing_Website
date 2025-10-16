'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminProfile({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative ml-3">
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center max-w-xs text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          id="user-menu-button"
          aria-expanded="false"
          aria-haspopup="true"
        >
          <span className="sr-only">Open user menu</span>
          <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          tabIndex={-1}
        >
          <div className="px-4 py-2 text-xs text-gray-500">
            Signed in as <span className="font-medium">{user?.email || 'admin@example.com'}</span>
          </div>
          <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
            Your Profile
          </Link>
          <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
            Settings
          </Link>
          <button
            onClick={() => {
              // Handle logout logic here
              if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
              }
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}