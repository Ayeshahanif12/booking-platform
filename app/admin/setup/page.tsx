'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);
  const [credentials, setCredentials] = useState<any>(null);

  const createAdmin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok) {
        setCredentials(data.admin.credentials);
        setAdminCreated(true);
      } else {
        alert('Admin already exists or error occurred');
        // Try to login
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to create admin');
      alert('Error creating admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Setup</h1>
        <p className="text-gray-400 mb-8">Initialize the platform administrator account</p>

        {!adminCreated ? (
          <div>
            <p className="text-gray-300 mb-6">
              Click the button below to create the initial admin account. This will set up credentials for platform management.
            </p>
            <button
              onClick={createAdmin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Creating Admin...' : 'Create Admin Account'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-900 border border-green-700 p-4 rounded-lg">
              <p className="text-green-200 font-semibold">✓ Admin created successfully!</p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Admin Credentials</h2>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={credentials?.email}
                  readOnly
                  className="w-full bg-gray-600 text-white p-3 rounded border border-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Password</label>
                <input
                  type="text"
                  value={credentials?.password}
                  readOnly
                  className="w-full bg-gray-600 text-white p-3 rounded border border-gray-500"
                />
              </div>

              <div className="bg-yellow-900 border border-yellow-700 p-3 rounded">
                <p className="text-yellow-200 text-sm">
                  ⚠️ Save these credentials safely. You'll need them to login. Change the password after first login!
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
