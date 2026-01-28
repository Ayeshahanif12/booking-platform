'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProviderBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
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

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        await fetchBookings();
      }
    } catch (error) {
      console.error('Failed to update booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-yellow-900/30', border: 'border-yellow-600', text: 'text-yellow-200', icon: '⏳' };
      case 'accepted':
        return { bg: 'bg-green-900/30', border: 'border-green-600', text: 'text-green-200', icon: '✅' };
      case 'rejected':
        return { bg: 'bg-red-900/30', border: 'border-red-600', text: 'text-red-200', icon: '❌' };
      default:
        return { bg: 'bg-gray-700/30', border: 'border-gray-600', text: 'text-gray-200', icon: '📋' };
    }
  };

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    revenue: bookings.filter(b => b.status === 'accepted').reduce((sum, b) => sum + (b.totalPrice || 0), 0),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={() => router.push('/')}
              className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition"
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
              Booking <span className="text-gradient">Requests</span>
            </h1>
            <p className="text-xl text-gray-300">Manage and respond to customer booking requests</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-dark p-6 border-0 border-l-4 border-blue-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Total Requests</p>
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
            <div className="card-dark p-6 border-0 border-l-4 border-purple-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Revenue</p>
              <p className="text-3xl font-bold text-purple-400">${stats.revenue}</p>
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
              <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full spinner mb-4"></div>
              <p className="text-gray-400">Loading booking requests...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="card-dark p-12 text-center border border-slate-700 animate-scale-in">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-2xl font-bold mb-4">
                {filterStatus === 'all' ? 'No Bookings Yet' : `No ${filterStatus} Bookings`}
              </p>
              <p className="text-gray-400">
                {filterStatus === 'all'
                  ? 'You will see booking requests here when customers book your services.'
                  : `No bookings with ${filterStatus} status at the moment.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {filteredBookings.map((booking: any, idx: number) => {
                const statusInfo = getStatusColor(booking.status);

                return (
                  <div
                    key={booking._id}
                    className="card-dark p-6 border border-slate-700 hover:border-orange-500/50 group animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      {/* Booking Info */}
                      <div className="flex-grow">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-grow">
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-300 transition-colors">
                              {booking.serviceName || booking.serviceId?.title}
                            </h3>
                            <p className="text-gray-400 mb-3">
                              📧 {booking.userId?.email}
                            </p>

                            {/* Customer Info */}
                            <div className="bg-slate-800/50 p-3 rounded border border-slate-700 mb-4">
                              <p className="text-gray-400 text-sm">Customer</p>
                              <p className="text-white font-semibold">{booking.userId?.name}</p>
                            </div>

                            {/* Booking Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
                              <div>
                                <p className="text-gray-500 text-sm">Date</p>
                                <p className="text-white font-semibold">
                                  {new Date(booking.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-sm">Time</p>
                                <p className="text-white font-semibold">{booking.time}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-sm">Price</p>
                                <p className="text-orange-400 font-bold text-lg">
                                  ${booking.totalPrice || booking.serviceId?.price}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-sm">Duration</p>
                                <p className="text-white font-semibold">
                                  {booking.duration || booking.serviceId?.duration || 60} min
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end justify-between md:items-end">
                        {/* Status Badge */}
                        <div
                          className={`${statusInfo.bg} border ${statusInfo.border} ${statusInfo.text} px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 mb-4`}
                        >
                          <span className="text-lg">{statusInfo.icon}</span>
                          <span className="capitalize">{booking.status}</span>
                        </div>

                        {/* Action Buttons */}
                        {booking.status === 'pending' && (
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-smooth font-semibold flex items-center gap-2"
                            >
                              <span>✓</span> Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                              className="bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-600/30 px-6 py-2 rounded-lg transition-smooth font-semibold"
                            >
                              Decline
                            </button>
                          </div>
                        )}

                        {booking.status === 'accepted' && (
                          <div className="bg-green-900/30 border border-green-600/50 text-green-300 px-4 py-2 rounded-lg text-sm font-semibold">
                            ✅ Confirmed with customer
                          </div>
                        )}

                        {booking.status === 'rejected' && (
                          <div className="bg-red-900/30 border border-red-600/50 text-red-300 px-4 py-2 rounded-lg text-sm font-semibold">
                            ❌ Request declined
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            Respond to booking requests within 24 hours to maintain a good rating
          </p>
        </div>
      </footer>
    </div>
  );
}
