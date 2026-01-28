'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden flex items-center justify-center px-4 relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
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
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-down">
              Welcome Back
            </h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg mb-6 animate-slide-down">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
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

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-gray-300 font-medium mb-3">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-dark w-full"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-dark mt-8 animate-slide-up disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ animationDelay: '0.3s' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-white rounded-full spinner"></span>
                  Logging in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
              >
                Create one
              </button>
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-400 transition-colors duration-300 text-sm"
            >
              Continue as guest
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>Your security is our priority. We use industry-standard encryption.</p>
        </div>
      </div>
    </div>
  );
}
