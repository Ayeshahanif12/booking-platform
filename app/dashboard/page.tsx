'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  const dashboardItems = {
    user: [
      {
        title: 'Browse Services',
        description: 'Explore and discover amazing services',
        icon: '🔍',
        path: '/search',
        gradient: 'from-blue-600 to-blue-500',
        delay: '0s',
      },
      {
        title: 'My Bookings',
        description: 'View and manage your reservations',
        icon: '📅',
        path: '/bookings',
        gradient: 'from-purple-600 to-purple-500',
        delay: '0.1s',
      },
      {
        title: 'My Profile',
        description: 'Edit your account settings',
        icon: '👤',
        path: '/profile',
        gradient: 'from-emerald-600 to-emerald-500',
        delay: '0.2s',
      },
    ],
    provider: [
      {
        title: 'My Services',
        description: 'Create and manage your services',
        icon: '⭐',
        path: '/provider/services',
        gradient: 'from-emerald-600 to-emerald-500',
        delay: '0s',
      },
      {
        title: 'Booking Requests',
        description: 'Accept or reject service bookings',
        icon: '🎯',
        path: '/provider/bookings',
        gradient: 'from-orange-600 to-orange-500',
        delay: '0.1s',
      },
      {
        title: 'Analytics',
        description: 'Track your earnings & performance',
        icon: '📈',
        path: '/provider/analytics',
        gradient: 'from-pink-600 to-pink-500',
        delay: '0.2s',
      },
    ],
    admin: [
      {
        title: 'Manage Users',
        description: 'View and manage user accounts',
        icon: '👥',
        path: '/admin/users',
        gradient: 'from-red-600 to-red-500',
        delay: '0s',
      },
      {
        title: 'All Bookings',
        description: 'Monitor all platform bookings',
        icon: '📊',
        path: '/admin/bookings',
        gradient: 'from-blue-600 to-blue-500',
        delay: '0.1s',
      },
      {
        title: 'Browse Services',
        description: 'View all platform services',
        icon: '🔍',
        path: '/search',
        gradient: 'from-green-600 to-green-500',
        delay: '0.2s',
      },
    ],
  };

  const items = dashboardItems[user.role as keyof typeof dashboardItems] || [];

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
              onClick={() => router.push('/')}
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              BookIt
            </button>
            <div className="flex gap-3 md:gap-4 items-center">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-white font-semibold">{user.name}</span>
                <span className="text-gray-400 text-sm capitalize">{user.role}</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => router.push('/')}
                className="btn-secondary-dark text-sm md:text-base"
              >
                Home
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-smooth text-sm md:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-16 animate-slide-down">
            <h1 className="heading-secondary mb-4">
              Welcome back, <span className="text-gradient">{user.name}</span>
            </h1>
            <p className="text-xl text-gray-300">
              {user.role === 'user' && '✨ Explore amazing services and book with confidence'}
              {user.role === 'provider' && '⭐ Manage your services and grow your business'}
              {user.role === 'admin' && '🛡️ Monitor platform activity and manage users'}
            </p>
          </div>

          {/* Dashboard Cards Grid */}
          <div className={`grid ${items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => router.push(item.path)}
                className={`group card-dark p-8 border-l-4 border-blue-500 hover:scale-105 transition-all duration-300 animate-slide-up overflow-hidden relative`}
                style={{ animationDelay: item.delay }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-blue-400 group-hover:gap-4 transition-all">
                    <span>Explore</span>
                    <span className="text-xl">→</span>
                  </div>
                </div>

                {/* Animated border */}
                <div className="absolute inset-0 border border-transparent group-hover:border-blue-500/50 rounded-xl transition-all duration-300"></div>
              </button>
            ))}
          </div>

          {/* Quick Stats Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="card-dark p-6 border-0 border-t-2 border-blue-500">
              <p className="text-gray-400 mb-2">Account Status</p>
              <p className="text-3xl font-bold text-blue-400">Active</p>
            </div>
            <div className="card-dark p-6 border-0 border-t-2 border-purple-500">
              <p className="text-gray-400 mb-2">Member Since</p>
              <p className="text-xl font-bold text-purple-400">
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <div className="card-dark p-6 border-0 border-t-2 border-pink-500">
              <p className="text-gray-400 mb-2">Role</p>
              <p className="text-2xl font-bold text-pink-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            Need help? <a href="#" className="text-blue-400 hover:text-blue-300 transition">Contact Support</a>
          </p>
          <p className="text-gray-600 text-sm mt-4">&copy; 2024 BookIt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
