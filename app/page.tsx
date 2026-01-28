'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-right">
                BookIt
              </h1>
            </div>
            <div className="flex gap-3 md:gap-4">
              {user ? (
                <>
                  <span className="text-gray-300 self-center text-sm md:text-base hidden sm:inline">
                    Welcome, <span className="text-blue-400 font-semibold">{user.name}</span>
                  </span>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="btn-primary-dark text-sm md:text-base animate-fade-in"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary-dark text-sm md:text-base animate-fade-in"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="btn-secondary-dark text-sm md:text-base animate-fade-in"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="btn-primary-dark text-sm md:text-base animate-fade-in"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="parallax absolute inset-0" style={{
            backgroundImage: 'url(data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23334155" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E)',
          }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="animate-slide-up">
            <h1 className="heading-primary mb-6 font-bold">
              Your Professional <span className="text-gradient">Service Booking</span> Platform
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Connect with trusted service providers. Book with confidence. Manage with ease.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {!user && (
              <>
                <button
                  onClick={() => router.push('/register')}
                  className="btn-primary-dark text-lg hover:scale-105 transform transition-transform duration-300"
                >
                  Get Started Now
                </button>
                <button
                  onClick={() => router.push('/services')}
                  className="btn-secondary-dark text-lg hover:scale-105 transform transition-transform duration-300"
                >
                  Browse Services
                </button>
              </>
            )}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="card-dark p-6 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">500+</div>
              <p className="text-gray-400">Active Providers</p>
            </div>
            <div className="card-dark p-6 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">2K+</div>
              <p className="text-gray-400">Happy Customers</p>
            </div>
            <div className="card-dark p-6 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">100%</div>
              <p className="text-gray-400">Secure & Safe</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-secondary text-center mb-16 animate-slide-up">
            Why Choose <span className="text-gradient">BookIt</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'For Users',
                description: 'Browse and book services from verified providers in your area. Real-time booking confirmations and easy payment methods.',
                icon: '👥',
                delay: '0s',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                title: 'For Providers',
                description: 'Manage your services, accept bookings, and grow your business. Dedicated tools to handle all your appointments.',
                icon: '⭐',
                delay: '0.2s',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                title: 'Secure & Reliable',
                description: 'End-to-end encryption, verified payments, and customer support available 24/7 to ensure peace of mind.',
                icon: '🔒',
                delay: '0.4s',
                gradient: 'from-green-500 to-teal-500',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="card-dark p-8 border-l-4 border-blue-500 hover:scale-105 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: feature.delay }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center card-dark p-12 border-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 border border-blue-500/30 animate-slide-up">
          <h2 className="heading-secondary mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied users and providers. Your next great service is just a click away.
          </p>
          {!user && (
            <button
              onClick={() => router.push('/register')}
              className="btn-accent-dark text-lg hover:scale-105 transform transition-transform duration-300"
            >
              Create Your Account Today
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">BookIt</h3>
              <p className="text-gray-400">Your trusted platform for professional service bookings.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Users</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition">Browse Services</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">My Bookings</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition">List Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Manage Bookings</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-gray-500">
            <p>&copy; 2024 BookIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
