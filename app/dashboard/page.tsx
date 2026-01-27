'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-indigo-600">BookIt</h1>
            <div className="flex gap-4">
              <span className="text-gray-700 self-center">
                {user.name} ({user.role})
              </span>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Home
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {user.role === 'user' && (
            <>
              <button
                onClick={() => router.push('/services')}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Browse Services
                </h3>
                <p className="text-gray-600">Find and book services</p>
              </button>
              <button
                onClick={() => router.push('/bookings')}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  My Bookings
                </h3>
                <p className="text-gray-600">View your booking history</p>
              </button>
            </>
          )}

          {user.role === 'provider' && (
            <>
              <button
                onClick={() => router.push('/provider/services')}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  My Services
                </h3>
                <p className="text-gray-600">Manage your services</p>
              </button>
              <button
                onClick={() => router.push('/provider/bookings')}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Booking Requests
                </h3>
                <p className="text-gray-600">Accept or reject bookings</p>
              </button>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <button
                onClick={() => router.push('/admin/users')}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Manage Users
                </h3>
                <p className="text-gray-600">View and block users</p>
              </button>
              <button
                onClick={() => router.push('/admin/bookings')}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  All Bookings
                </h3>
                <p className="text-gray-600">View all platform bookings</p>
              </button>
              <button
                onClick={() => router.push('/services')}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  All Services
                </h3>
                <p className="text-gray-600">View all services</p>
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
