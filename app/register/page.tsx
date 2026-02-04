'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden flex items-center justify-center px-4 py-8 relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 text-gray-400 hover:text-blue-400 transition-colors duration-300 z-10"
      >
        ← Back Home
      </button>

      <div className="relative z-10 w-full max-w-md">
        <div className="card-dark p-8 md:p-10 border border-slate-700 animate-scale-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-down">
              Join BookIt
            </h1>
            <p className="text-gray-400">Create your account in seconds</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg mb-6 animate-slide-down">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <label className="block text-gray-300 font-medium mb-3">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-dark w-full"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-gray-300 font-medium mb-3">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-dark w-full"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <label className="block text-gray-300 font-medium mb-3">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-dark w-full"
                placeholder="Enter a strong password"
                required
              />
              <p className="text-gray-500 text-sm mt-2">At least 8 characters recommended</p>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <label className="block text-gray-300 font-medium mb-3">I am a</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="input-dark w-full"
              >
                <option value="user" className="bg-slate-800 text-white">
                  Service Customer
                </option>
                <option value="provider" className="bg-slate-800 text-white">
                  Service Provider
                </option>
              </select>
              <p className="text-gray-500 text-sm mt-2">
                {formData.role === 'user'
                  ? 'Browse and book services from providers'
                  : 'List your services and manage bookings'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-accent-dark mt-8 animate-slide-up disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ animationDelay: '0.5s' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-white rounded-full spinner"></span>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <p className="text-gray-400 text-sm">
              <span className="font-semibold text-green-400">✓ Secure</span> - Your data is encrypted
            </p>
            <p className="text-gray-400 text-sm mt-2">
              <span className="font-semibold text-green-400">✓ Verified</span> - All providers are verified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
