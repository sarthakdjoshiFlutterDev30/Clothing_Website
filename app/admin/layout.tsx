'use client';

import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminProfile from '../components/AdminProfile';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for static admin authentication or regular authentication
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      router.push('/auth/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      
      if (userData.role !== 'admin') {
        router.push('/auth/login');
        return;
      }
      
      setUser(userData);
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // This will never render as we redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/admin" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                  Dashboard
                </Link>
                <Link href="/admin/products" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                  Products
                </Link>
                <Link href="/admin/orders" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                  Orders
                </Link>
                <Link href="/admin/users" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                  Users
                </Link>
                <Link href="/admin/profile" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                  Profile
                </Link>
                <Link href="/admin/settings" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                  Settings
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <AdminProfile user={{
                name: user?.name || 'Admin',
                email: user?.email || 'admin@example.com',
                role: user?.role || 'admin'
              }} />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}