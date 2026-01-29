'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function AdminUserProfile() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchUserDetails();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router, userId]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async () => {
    const reason = !user.blocked ? prompt('Enter reason for blocking:') : null;
    if (!reason && !user.blocked) {
      alert('Reason is required');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          blocked: !user.blocked,
          blockReason: reason
        }),
      });

      if (res.ok) {
        alert(user.blocked ? 'User unblocked' : 'User blocked successfully');
        await fetchUserDetails();
      }
    } catch (error) {
      console.error('Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}? This cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('User deleted successfully');
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={() => router.push('/')}
              className="text-3xl font-bold bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              BookIt
            </button>
            <button
              onClick={() => router.push('/admin/users')}
              className="btn-primary-dark"
            >
              ← Back to Users
            </button>
          </div>
        </div>
      </nav>

      <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-red-500 rounded-full spinner mb-4"></div>
              <p className="text-gray-400">Loading user profile...</p>
            </div>
          ) : user ? (
            <>
              {/* Profile Header */}
              <div className="card-dark border border-slate-700 p-8 mb-8 animate-fade-in">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-5xl font-bold shadow-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-grow">
                    <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                    <p className="text-gray-400 text-lg mb-6">{user.email}</p>

                    <div className="flex gap-3 flex-wrap mb-6">
                      <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold ${
                        user.role === 'provider'
                          ? 'bg-emerald-900/30 text-emerald-300'
                          : user.role === 'admin'
                          ? 'bg-red-900/30 text-red-300'
                          : 'bg-blue-900/30 text-blue-300'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                      <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold ${
                        user.blocked
                          ? 'bg-red-900/30 text-red-300'
                          : 'bg-green-900/30 text-green-300'
                      }`}>
                        {user.blocked ? '🔒 BLOCKED' : '✅ ACTIVE'}
                      </span>
                    </div>

                    {user.blocked && user.blockReason && (
                      <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 mb-6">
                        <p className="text-red-300"><strong>Block Reason:</strong> {user.blockReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="grid md:grid-cols-2 gap-8 mb-8 animate-slide-up">
                <div className="card-dark border border-slate-700 p-6">
                  <h2 className="text-xl font-bold mb-6 text-gradient">Account Information</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">User ID</p>
                      <p className="font-mono text-sm break-all">{user._id}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Email</p>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Role</p>
                      <p className="capitalize">{user.role}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Account Status</p>
                      <p className={user.blocked ? 'text-red-400' : 'text-green-400'}>
                        {user.blocked ? 'Blocked' : 'Active'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-dark border border-slate-700 p-6">
                  <h2 className="text-xl font-bold mb-6 text-gradient">Timeline</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Account Created</p>
                      <p>{new Date(user.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Last Updated</p>
                      <p>{new Date(user.updatedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Verification Status</p>
                      <p className={user.verified ? 'text-green-400' : 'text-yellow-400'}>
                        {user.verified ? '✅ Verified' : '⏳ Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info if Provider */}
              {user.role === 'provider' && (
                <div className="card-dark border border-slate-700 p-6 mb-8 animate-slide-up">
                  <h2 className="text-xl font-bold mb-6 text-gradient">Provider Information</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Phone</p>
                      <p>{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Location</p>
                      <p>{user.location || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Bio</p>
                      <p>{user.bio || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="card-dark border border-slate-700 p-6 animate-slide-up">
                <h2 className="text-xl font-bold mb-6 text-gradient">Admin Actions</h2>
                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={handleBlockToggle}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      user.blocked
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {user.blocked ? '✅ Unblock User' : '🚫 Block User'}
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="px-6 py-3 rounded-lg font-bold bg-orange-600 hover:bg-orange-700 text-white transition-all"
                  >
                    🗑️ Delete User
                  </button>
                  <button
                    onClick={() => router.push('/admin/users')}
                    className="px-6 py-3 rounded-lg font-bold bg-slate-700 hover:bg-slate-600 text-white transition-all"
                  >
                    ← Back to Users
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="card-dark p-12 text-center border border-slate-700 animate-scale-in">
              <p className="text-5xl mb-4">❌</p>
              <p className="text-2xl font-bold mb-4">User Not Found</p>
              <button
                onClick={() => router.push('/admin/users')}
                className="btn-primary-dark"
              >
                Back to Users
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            User Profile | Admin Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}
