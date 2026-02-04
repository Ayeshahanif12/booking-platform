'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
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
    fetchBookings();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
    revenue: bookings
      .filter(b => b.status === 'accepted')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-300 border border-yellow-600/30';
      case 'accepted':
        return 'bg-green-900/30 text-green-300 border border-green-600/30';
      case 'rejected':
        return 'bg-red-900/30 text-red-300 border border-red-600/30';
      default:
        return 'bg-slate-700 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '';
      case 'accepted':
        return '';
      case 'rejected':
        return '';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
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
              Booking <span className="text-gradient">Management</span>
            </h1>
            <p className="text-xl text-gray-300">Monitor all platform bookings and transactions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-5 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-dark p-6 border-0 border-l-4 border-blue-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Total Bookings</p>
              <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
            </div>
            <div className="card-dark p-6 border-0 border-l-4 border-yellow-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Pending</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="card-dark p-6 border-0 border-l-4 border-green-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Accepted</p>
              <p className="text-3xl font-bold text-green-400">{stats.accepted}</p>
            </div>
            <div className="card-dark p-6 border-0 border-l-4 border-red-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Rejected</p>
              <p className="text-3xl font-bold text-red-400">{stats.rejected}</p>
            </div>
            <div className="card-dark p-6 border-0 border-l-4 border-emerald-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Revenue</p>
              <p className="text-3xl font-bold text-emerald-400">${stats.revenue.toFixed(2)}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 mb-8 flex-wrap animate-slide-up">
            {['all', 'pending', 'accepted', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  filterStatus === status
                    ? 'btn-primary-dark'
                    : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                } capitalize`}
              >
                {status === 'all' ? 'All Bookings' : status}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-purple-500 rounded-full spinner mb-4"></div>
              <p className="text-gray-400">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="card-dark p-12 text-center border border-slate-700 animate-scale-in">
              <p className="text-xl mb-4">No bookings</p>
              <p className="text-2xl font-bold mb-4">No Bookings Found</p>
              <p className="text-gray-400">No bookings match your filter criteria</p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {filteredBookings.map((booking: any, idx: number) => (
                <div
                  key={booking._id}
                  className="card-dark border border-slate-700 p-6 hover:border-slate-600 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Section */}
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{booking.serviceName}</h3>
                          <p className="text-gray-400 text-sm">Booking ID: {booking._id.slice(-8)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                        <p className="text-gray-400 text-sm">
                          <strong>Customer:</strong> {booking.userId?.name || 'Unknown'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          <strong>Provider:</strong> {booking.providerId?.name || 'Unknown'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          <strong>Category:</strong> {booking.category}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p className="text-white font-semibold">
                            {new Date(booking.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Time</p>
                          <p className="text-white font-semibold">{booking.time}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <p className="text-gray-400 text-sm mb-1">Duration</p>
                          <p className="text-xl font-bold text-blue-400">{booking.duration} mins</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <p className="text-gray-400 text-sm mb-1">Price</p>
                          <p className="text-xl font-bold text-emerald-400">${booking.totalPrice?.toFixed(2)}</p>
                        </div>
                      </div>

                      {booking.description && (
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <p className="text-gray-400 text-sm mb-2">Description</p>
                          <p className="text-gray-300">{booking.description}</p>
                        </div>
                      )}

                      <div className="pt-2">
                        <p className="text-gray-500 text-xs">
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination summary */}
          {filteredBookings.length > 0 && (
            <div className="text-center mt-8 text-gray-400">
              <p>Showing {filteredBookings.length} of {stats.total} bookings</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            Platform Booking Dashboard | Total Revenue: ${stats.revenue.toFixed(2)}
          </p>
        </div>
      </footer>
    </div>
  );
}
