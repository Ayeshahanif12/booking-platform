'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

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

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setStats(data.statistics);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Platform Management & Analytics</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 font-semibold ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`pb-3 px-4 font-semibold ${
              activeTab === 'providers'
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Providers
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 font-semibold ${
              activeTab === 'users'
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-3 px-4 font-semibold ${
              activeTab === 'services'
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-4 font-semibold ${
              activeTab === 'bookings'
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Bookings
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Users" value={stats.totalUsers} color="blue" />
            <StatCard title="Total Providers" value={stats.totalProviders} color="green" />
            <StatCard title="Total Services" value={stats.totalServices} color="purple" />
            <StatCard title="Total Bookings" value={stats.totalBookings} color="orange" />
            <StatCard title="Completed Bookings" value={stats.completedBookings} color="emerald" />
            <StatCard title="Pending Bookings" value={stats.pendingBookings} color="yellow" />
            <StatCard title="Total Revenue" value={`Rs. ${stats.totalRevenue?.toLocaleString()}`} color="indigo" />
          </div>
        )}

        {activeTab === 'providers' && <ProvidersTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'bookings' && <BookingsTab />}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: any) {
  const colorMap: any = {
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800',
    purple: 'from-purple-600 to-purple-800',
    orange: 'from-orange-600 to-orange-800',
    emerald: 'from-emerald-600 to-emerald-800',
    yellow: 'from-yellow-600 to-yellow-800',
    indigo: 'from-indigo-600 to-indigo-800',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color] || 'from-gray-700 to-gray-800'} p-6 rounded-lg`}>
      <p className="text-gray-200 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function ProvidersTab() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/providers-list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProviders(data.providers);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch providers');
      setLoading(false);
    }
  };

  const deleteProvider = async (providerId: string, providerName: string) => {
    if (!confirm(`Are you sure you want to delete provider "${providerName}" and all their services?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/providers-list', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ providerId }),
      });

      if (res.ok) {
        alert('Provider deleted successfully');
        fetchProviders();
      } else {
        alert('Failed to delete provider');
      }
    } catch (error) {
      console.error('Failed to delete provider');
    }
  };

  if (loading) return <div>Loading providers...</div>;

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400 mb-4">Total Providers: {providers.length}</div>
      {providers.map((provider) => (
        <div key={provider._id} className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{provider.name}</h3>
              <p className="text-gray-400">{provider.email}</p>
              <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Services:</span>
                  <p className="text-white font-semibold">{provider.totalServices}</p>
                </div>
                <div>
                  <span className="text-gray-400">Bookings:</span>
                  <p className="text-white font-semibold">{provider.totalBookings}</p>
                </div>
                <div>
                  <span className="text-gray-400">Completed:</span>
                  <p className="text-white font-semibold">{provider.completedBookings}</p>
                </div>
                <div>
                  <span className="text-gray-400">Earnings:</span>
                  <p className="text-white font-semibold">Rs. {provider.totalEarnings?.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-gray-400">Rating:</span>
                <p className="text-white font-semibold">{provider.averageRating}/5</p>
              </div>
            </div>
            <button
              onClick={() => deleteProvider(provider._id, provider.name)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data.users.filter((u: any) => u.role === 'user'));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch users');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400 mb-4">Total Users: {users.length}</div>
      {users.map((user) => (
        <div key={user._id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          <div className="text-sm text-gray-400">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function ServicesTab() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/services-list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setServices(data.services);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch services');
      setLoading(false);
    }
  };

  const deleteService = async (serviceId: string, serviceName: string) => {
    if (!confirm(`Delete service "${serviceName}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/services-list', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceId }),
      });

      if (res.ok) {
        alert('Service deleted');
        fetchServices();
      }
    } catch (error) {
      console.error('Failed to delete service');
    }
  };

  if (loading) return <div>Loading services...</div>;

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400 mb-4">Total Services: {services.length}</div>
      {services.map((service) => (
        <div key={service._id} className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{service.description}</p>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Provider:</span>
                  <p className="text-white">{service.providerId?.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Category:</span>
                  <p className="text-white">{service.category}</p>
                </div>
                <div>
                  <span className="text-gray-400">Price:</span>
                  <p className="text-white">Rs. {service.price}</p>
                </div>
                <div>
                  <span className="text-gray-400">Rating:</span>
                  <p className="text-white">{service.rating}/5</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => deleteService(service._id, service.title)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white ml-4"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BookingsTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/bookings-list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBookings(data.bookings);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (!confirm('Delete this booking?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/bookings-list', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });

      if (res.ok) {
        alert('Booking deleted');
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to delete booking');
    }
  };

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400 mb-4">Total Bookings: {bookings.length}</div>
      {bookings.map((booking) => (
        <div key={booking._id} className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold">{booking.serviceName}</h3>
              <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                <div>
                  <span className="text-gray-400">Customer:</span>
                  <p className="text-white">{booking.userId?.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Provider:</span>
                  <p className="text-white">{booking.providerId?.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className={`font-semibold ${booking.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {booking.status}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                <div>
                  <span className="text-gray-400">Date:</span>
                  <p className="text-white">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Price:</span>
                  <p className="text-white">Rs. {booking.totalPrice}</p>
                </div>
                <div>
                  <span className="text-gray-400">Payment:</span>
                  <p className={`font-semibold ${booking.paymentStatus === 'paid' ? 'text-green-400' : 'text-red-400'}`}>
                    {booking.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => deleteBooking(booking._id)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white ml-4"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
