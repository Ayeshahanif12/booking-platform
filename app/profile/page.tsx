'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    setFormData(JSON.parse(userData));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    const oldPassword = prompt('Enter current password:');
    const newPassword = prompt('Enter new password:');
    const confirmPassword = prompt('Confirm new password:');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Password changed successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to change password');
      }
    } catch (error) {
      setMessage('Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-red-500 rounded-full spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-3xl font-bold bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              BookIt
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
              }}
              className="btn-primary-dark"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-slide-down">
            <h1 className="heading-secondary mb-2">
              My <span className="text-gradient">Profile</span>
            </h1>
            <p className="text-xl text-gray-300">Manage your account settings and information</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg animate-slide-down ${
              message.includes('success')
                ? 'bg-green-900/30 text-green-300 border border-green-600/30'
                : 'bg-red-900/30 text-red-300 border border-red-600/30'
            }`}>
              {message}
            </div>
          )}

          {/* Profile Card */}
          <div className="card-dark border border-slate-700 p-8 mb-8 animate-fade-in">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-700">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                <p className="text-gray-400 mb-2">{user.email}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  user.role === 'provider'
                    ? 'bg-emerald-900/30 text-emerald-300'
                    : user.role === 'admin'
                    ? 'bg-red-900/30 text-red-300'
                    : 'bg-blue-900/30 text-blue-300'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>

            {!isEditing ? (
              <>
                {/* Profile Info Display */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Email Address</p>
                    <p className="text-white font-semibold">{user.email}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Full Name</p>
                    <p className="text-white font-semibold">{user.name}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Account Type</p>
                    <p className="text-white font-semibold capitalize">{user.role}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Member Since</p>
                    <p className="text-white font-semibold">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsEditing(true);
                    setFormData(user);
                  }}
                  className="btn-primary-dark"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleChangePassword}
                  className="btn-secondary-dark ml-3"
                >
                  Change Password
                </button>
              </>
            ) : (
              <>
                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2 font-medium">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className="input-dark w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2 font-medium">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className="input-dark w-full"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 btn-primary-dark ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(user);
                      }}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-semibold transition-smooth"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Security Card */}
            <div className="card-dark border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🔒</span> Security
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Keep your account safe by managing your password
              </p>
              <button className="btn-secondary-dark w-full">
                Change Password
              </button>
            </div>

            {/* Account Info Card */}
            <div className="card-dark border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>ℹ️</span> Account Info
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Status:</strong> <span className="text-green-300">Active</span></p>
                <p><strong>Verification:</strong> <span className="text-green-300">Verified</span></p>
                <p><strong>2FA:</strong> <span className="text-yellow-300">Not Enabled</span></p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            Profile • Account Settings • Privacy Policy
          </p>
        </div>
      </footer>
    </div>
  );
}
