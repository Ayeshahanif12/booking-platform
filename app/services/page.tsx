'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Services() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [bookingModal, setBookingModal] = useState<any>(null);
  const [bookingData, setBookingData] = useState({ date: '', time: '' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data.services);
    } catch (error) {
      console.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (serviceId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId,
          date: bookingData.date,
          time: bookingData.time,
        }),
      });

      if (res.ok) {
        alert('Booking created successfully!');
        setBookingModal(null);
        setBookingData({ date: '', time: '' });
      } else {
        alert('Failed to create booking');
      }
    } catch (error) {
      alert('Error creating booking');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-indigo-600">BookIt</h1>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-700 hover:text-indigo-600"
              >
                Home
              </button>
              {user && (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Available Services
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service: any) => (
              <div key={service._id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-2xl font-bold text-indigo-600 mb-4">
                  ${service.price}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Provider: {service.providerId?.name || 'Unknown'}
                </p>
                {user && user.role === 'user' && (
                  <button
                    onClick={() => setBookingModal(service)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Book Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {bookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Book {bookingModal.title}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={bookingData.time}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, time: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleBook(bookingModal._id)}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setBookingModal(null);
                    setBookingData({ date: '', time: '' });
                  }}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
