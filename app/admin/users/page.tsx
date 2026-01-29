'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
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
    fetchUsers();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (userId: string, isBlocked: boolean) => {
    const reason = !isBlocked ? prompt('Enter reason for blocking:') : null;
    if (!reason && !isBlocked) {
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
          blocked: !isBlocked,
          blockReason: reason
        }),
      });

      if (res.ok) {
        alert(isBlocked ? 'User unblocked' : 'User blocked successfully');
        await fetchUsers();
      }
    } catch (error) {
      console.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This cannot be undone.`)) {
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
        await fetchUsers();
      }
    } catch (error) {
      console.error('Failed to delete user');
    }
  };

  const filteredUsers = filterRole === 'all'
    ? users
    : users.filter(u => u.role === filterRole);

  const stats = {
    total: users.length,
    providers: users.filter(u => u.role === 'provider').length,
    customers: users.filter(u => u.role === 'user').length,
    blocked: users.filter(u => u.blocked).length,
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
              onClick={() => router.push('/dashboard')}
              className="btn-primary-dark"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-slide-down">
            <h1 className="heading-secondary mb-2">
              User <span className="text-gradient">Management</span>
            </h1>
            <p className="text-xl text-gray-300">Monitor and manage all platform users</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-dark p-6 border-0 border-l-4 border-blue-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Total Users</p>
              <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
            </div>
            <div className="card-dark p-6 border-0 border-l-4 border-green-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Providers</p>
              <p className="text-3xl font-bold text-green-400">{stats.providers}</p>
            </div>
            <div className="card-dark p-6 border-0 border-l-4 border-purple-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Customers</p>
              <p className="text-3xl font-bold text-purple-400">{stats.customers}</p>
            </div>
            <div className="card-dark p-6 border-0 border-l-4 border-red-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Blocked</p>
              <p className="text-3xl font-bold text-red-400">{stats.blocked}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 mb-8 flex-wrap animate-slide-up">
            {['all', 'user', 'provider'].map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  filterRole === role
                    ? 'btn-primary-dark'
                    : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                } capitalize`}
              >
                {role === 'all' ? 'All Users' : role === 'user' ? 'Customers' : 'Providers'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-red-500 rounded-full spinner mb-4"></div>
              <p className="text-gray-400">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="card-dark p-12 text-center border border-slate-700 animate-scale-in">
              <p className="text-5xl mb-4">👥</p>
              <p className="text-2xl font-bold mb-4">No Users Found</p>
              <p className="text-gray-400">No users match your filter criteria</p>
            </div>
          ) : (
            <div className="card-dark border border-slate-700 overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-800/50">
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">User</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Email</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Role</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Joined</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredUsers.map((user: any, idx: number) => (
                      <tr
                        key={user._id}
                        className="hover:bg-slate-800/50 transition-colors animate-slide-up"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            user.role === 'provider'
                              ? 'bg-emerald-900/30 text-emerald-300'
                              : user.role === 'admin'
                              ? 'bg-red-900/30 text-red-300'
                              : 'bg-blue-900/30 text-blue-300'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            user.blocked
                              ? 'bg-red-900/30 text-red-300'
                              : 'bg-green-900/30 text-green-300'
                          }`}>
                            {user.blocked ? '🔒 Blocked' : '✅ Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {user.role !== 'admin' && (
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => router.push(`/admin/users/${user._id}`)}
                                className="px-3 py-1 rounded text-xs font-bold bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 transition-all"
                              >
                                👁️ View
                              </button>
                              <button
                                onClick={() => handleBlockToggle(user._id, user.blocked)}
                                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                  user.blocked
                                    ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50'
                                    : 'bg-red-900/30 text-red-300 hover:bg-red-900/50'
                                }`}
                              >
                                {user.blocked ? '✅ Unblock' : '🚫 Block'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id, user.name)}
                                className="px-3 py-1 rounded text-xs font-bold bg-orange-900/30 text-orange-300 hover:bg-orange-900/50 transition-all"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            Platform Admin Dashboard | Total Users: {stats.total}
          </p>
        </div>
      </footer>
    </div>
  );
}
