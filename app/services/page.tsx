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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchServices();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleBook = async (serviceId: string, service: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    if (!bookingData.date || !bookingData.time) {
      alert('Please select date and time');
      return;
    }

    const duration = service.duration || 60;
    const pricePerHour = service.pricePerHour || 0;
    const totalPrice = (duration / 60) * pricePerHour;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId,
          serviceName: service.title,
          category: service.category,
          date: bookingData.date,
          time: bookingData.time,
          duration: duration,
          totalPrice: totalPrice,
          description: `Booking for ${service.title}`,
        }),
      });

      if (res.ok) {
        alert('Booking created successfully! Amount: $' + totalPrice.toFixed(2));
        setBookingModal(null);
        setBookingData({ date: '', time: '' });
        fetchServices();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating booking');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
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
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Home
              </button>
              {user && (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn-primary-dark text-sm md:text-base"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16 animate-slide-down">
            <h1 className="heading-secondary mb-4">
              Discover <span className="text-gradient">Amazing Services</span>
            </h1>
            <p className="text-xl text-gray-300">
              Browse from our collection of trusted service providers
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full spinner mb-4"></div>
              <p className="text-gray-400">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 animate-slide-up">
              <p className="text-2xl text-gray-400 mb-4">No services available yet</p>
              <button
                onClick={() => router.push('/')}
                className="btn-primary-dark"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {services.map((service: any, idx: number) => (
                <div
                  key={service._id}
                  className="card-dark p-6 border border-slate-700 hover:border-blue-500/50 group overflow-hidden relative h-full animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-transparent to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all duration-300"></div>

                  <div className="relative z-10 flex flex-col h-full">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 mb-4 flex-grow">
                      {service.description}
                    </p>

                    {/* Price and Provider */}
                    <div className="space-y-3 mb-6 py-4 border-t border-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Price</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          ${service.price}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Provider</span>
                        <p className="text-gray-300 font-semibold">
                          {service.providerId?.name || 'Unknown Provider'}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    {user && user.role === 'user' && (
                      <button
                        onClick={() => setBookingModal(service)}
                        className="w-full btn-primary-dark mt-auto group-hover:scale-105 transition-transform duration-300"
                      >
                        Book Now →
                      </button>
                    )}

                    {!user && (
                      <button
                        onClick={() => router.push('/login')}
                        className="w-full btn-secondary-dark mt-auto"
                      >
                        Login to Book
                      </button>
                    )}

                    {user && user.role !== 'user' && (
                      <div className="mt-auto pt-4 border-t border-slate-700 text-gray-400 text-sm">
                        Available for all customers
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card-dark p-8 max-w-md w-full border border-slate-700 animate-scale-in">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">
                Book <span className="text-gradient">{bookingModal.title}</span>
              </h2>
              <p className="text-gray-400">Schedule your service booking</p>
            </div>

            <div className="space-y-5 mb-6">
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <label className="block text-gray-300 font-medium mb-3">Select Date</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, date: e.target.value })
                  }
                  className="input-dark w-full"
                  required
                />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <label className="block text-gray-300 font-medium mb-3">Select Time</label>
                <input
                  type="time"
                  value={bookingData.time}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, time: e.target.value })
                  }
                  className="input-dark w-full"
                  required
                />
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-slate-800/50 p-4 rounded-lg mb-6 border border-slate-700 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-gray-400 text-sm mb-2">Total Cost</p>
              <p className="text-2xl font-bold text-blue-400">
                ${bookingModal.price}
              </p>
            </div>

            <div className="flex gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => handleBook(bookingModal._id, bookingModal)}
                className="flex-1 btn-primary-dark"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => {
                  setBookingModal(null);
                  setBookingData({ date: '', time: '' });
                }}
                className="flex-1 btn-secondary-dark"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
