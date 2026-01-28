'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Bookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-yellow-900/30', border: 'border-yellow-600', text: 'text-yellow-200' };
      case 'accepted':
        return { bg: 'bg-green-900/30', border: 'border-green-600', text: 'text-green-200' };
      case 'rejected':
        return { bg: 'bg-red-900/30', border: 'border-red-600', text: 'text-red-200' };
      default:
        return { bg: 'bg-gray-700/30', border: 'border-gray-600', text: 'text-gray-200' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'completed':
        return '🎉';
      case 'cancelled':
        return '🚫';
      default:
        return '📋';
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings?id=${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (res.ok) {
        alert('Booking cancelled successfully');
        fetchBookings();
      }
    } catch (error) {
      alert('Error cancelling booking');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={() => router.push('/')}
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition"
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-slide-down">
            <h1 className="heading-secondary mb-4">
              Your <span className="text-gradient">Bookings</span>
            </h1>
            <p className="text-xl text-gray-300">
              Track and manage all your service reservations
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full spinner mb-4"></div>
              <p className="text-gray-400">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="card-dark p-12 text-center border border-slate-700 animate-scale-in">
              <p className="text-3xl mb-4">📋</p>
              <p className="text-2xl font-bold mb-4">No Bookings Yet</p>
              <p className="text-gray-400 mb-6">
                You haven't made any bookings. Explore services and create your first booking!
              </p>
              <button
                onClick={() => router.push('/services')}
                className="btn-primary-dark"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {bookings.map((booking: any, idx: number) => {
                const statusColor = getStatusColor(booking.status);
                const statusIcon = getStatusIcon(booking.status);

                return (
                  <div
                    key={booking._id}
                    className="card-dark p-6 border border-slate-700 hover:border-blue-500/50 group transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      {/* Service Info */}
                      <div className="flex-grow">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-grow">
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                              {booking.serviceId?.title}
                            </h3>
                            <p className="text-gray-400 mb-3">
                              {booking.serviceId?.description}
                            </p>

                            {/* Meta Information */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-700">
                              <div>
                                <p className="text-gray-500 text-sm">Date</p>
                                <p className="text-white font-semibold">
                                  {new Date(booking.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
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
                                <p className="text-blue-400 font-bold text-lg">
                                  ${booking.serviceId?.price}
                                </p>
                              </div>
                            </div>

                            {/* Provider Info */}
                            <div className="mt-4 p-3 bg-slate-800/50 rounded border border-slate-700">
                              <p className="text-gray-500 text-sm">Provider</p>
                              <p className="text-white font-semibold">
                                {booking.serviceId?.providerId?.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex flex-col items-end justify-between md:items-end">
                        <div
                          className={`${statusColor.bg} border ${statusColor.border} ${statusColor.text} px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 animate-pulse`}
                        >
                          <span className="text-lg">{statusIcon}</span>
                          <span className="capitalize">{booking.status}</span>
                        </div>

                        {/* Status Message */}
                        <div className="text-right mt-4">
                          {booking.status === 'pending' && (
                            <p className="text-yellow-400 text-sm">
                              ⏳ Awaiting provider response
                            </p>
                          )}
                          {booking.status === 'accepted' && (
                            <p className="text-green-400 text-sm">
                              ✅ Ready to go!
                            </p>
                          )}
                          {booking.status === 'rejected' && (
                            <p className="text-red-400 text-sm">
                              ❌ Provider declined
                            </p>
                          )}
                          {booking.status === 'cancelled' && (
                            <p className="text-gray-400 text-sm">
                              🚫 Booking cancelled
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-2 flex-wrap justify-end">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="btn-secondary-dark text-sm hover:bg-red-600"
                            >
                              Cancel
                            </button>
                          )}
                          {booking.status === 'accepted' && (
                            <>
                              <button className="btn-primary-dark text-sm">⭐ Rate</button>
                              <button className="btn-secondary-dark text-sm">💬 Message</button>
                            </>
                          )}
                        </div>
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
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500">
            Need help with a booking? <a href="#" className="text-blue-400 hover:text-blue-300 transition">Contact Support</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
