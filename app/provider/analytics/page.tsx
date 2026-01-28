'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProviderAnalytics() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(user);
    if (userData.role !== 'provider') {
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
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    totalEarnings: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    completedBookings: bookings.filter(b => b.status === 'accepted').length,
    averageRating: 4.5,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    completionRate: '98%',
    monthlyGrowth: '+15%',
  };

  // Mock revenue data for chart
  const revenueData = [
    { day: 'Mon', revenue: 120 },
    { day: 'Tue', revenue: 280 },
    { day: 'Wed', revenue: 200 },
    { day: 'Thu', revenue: 420 },
    { day: 'Fri', revenue: 350 },
    { day: 'Sat', revenue: 580 },
    { day: 'Sun', revenue: 290 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

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
              onClick={() => router.push('/dashboard')}
              className="text-3xl font-bold bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              BookIt
            </button>
            <button
              onClick={() => router.push('/provider/services')}
              className="btn-primary-dark"
            >
              Back to Services
            </button>
          </div>
        </div>
      </nav>

      <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-slide-down">
            <h1 className="heading-secondary mb-2">
              Analytics & <span className="text-gradient">Performance</span>
            </h1>
            <p className="text-xl text-gray-300">Track your earnings and service performance</p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-3 mb-8 flex-wrap animate-slide-up">
            {['week', 'month', 'year'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 capitalize ${
                  selectedPeriod === period
                    ? 'btn-primary-dark'
                    : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                }`}
              >
                Last {period}
              </button>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-dark p-6 border-0 border-l-4 border-emerald-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Total Earnings</p>
              <p className="text-4xl font-bold text-emerald-400 mb-2">${stats.totalEarnings.toFixed(2)}</p>
              <p className="text-green-300 text-sm">{stats.monthlyGrowth} from last month</p>
            </div>
            <div className="card-dark p-6 border-0 border-l-4 border-blue-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Completed Bookings</p>
              <p className="text-4xl font-bold text-blue-400 mb-2">{stats.completedBookings}</p>
              <p className="text-gray-400 text-sm">Pending: {stats.pendingBookings}</p>
            </div>
            <div className="card-dark p-6 border-0 border-l-4 border-yellow-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Average Rating</p>
              <p className="text-4xl font-bold text-yellow-400 mb-2">⭐ {stats.averageRating}</p>
              <p className="text-gray-400 text-sm">Completion: {stats.completionRate}</p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="card-dark border border-slate-700 p-8 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold mb-6">Weekly Revenue</h2>
            <div className="h-64 flex items-end gap-2 bg-slate-800/30 rounded-lg p-4">
              {revenueData.map((data, idx) => (
                <div
                  key={data.day}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-600"
                    style={{
                      height: `${(data.revenue / maxRevenue) * 100}%`,
                    }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center h-full pb-2">
                      <span className="text-white text-xs font-bold">${data.revenue}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {/* Booking Trends */}
            <div className="card-dark border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-6">📈 Booking Trends</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">This Month</p>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">15 bookings</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Last Month</p>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">12 bookings</p>
                </div>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="card-dark border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-6">😊 Customer Feedback</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Very Satisfied (5★)</span>
                  <span className="text-emerald-400 font-bold">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Satisfied (4★)</span>
                  <span className="text-blue-400 font-bold">12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Neutral (3★)</span>
                  <span className="text-yellow-400 font-bold">3%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-purple-500 rounded-full spinner mb-4"></div>
              <p className="text-gray-400">Loading analytics...</p>
            </div>
          ) : (
            <div className="card-dark border border-slate-700 p-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-xl font-bold mb-6">Recent Completed Bookings</h3>
              {bookings.filter(b => b.status === 'accepted').length === 0 ? (
                <p className="text-gray-400 text-center py-8">No completed bookings yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700 bg-slate-800/50">
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Customer</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Service</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Date</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Amount</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {bookings
                        .filter(b => b.status === 'accepted')
                        .slice(0, 5)
                        .map((booking: any) => (
                          <tr key={booking._id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3">{booking.userId?.name}</td>
                            <td className="px-4 py-3">{booking.serviceName}</td>
                            <td className="px-4 py-3">{new Date(booking.date).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-emerald-400 font-bold">${booking.totalPrice?.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-900/30 text-green-300">
                                ✅ Completed
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            Provider Analytics • Period: {selectedPeriod} • Updated Real-time
          </p>
        </div>
      </footer>
    </div>
  );
}
