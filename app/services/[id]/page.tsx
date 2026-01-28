'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ServiceDetail() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [bookingData, setBookingData] = useState({ date: '', time: '' });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    if (serviceId) {
      fetchService();
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${serviceId}`);
      const data = await res.json();
      if (res.ok) {
        setService(data.service);
      } else {
        setService(null);
      }
    } catch (error) {
      console.error('Failed to fetch service');
      setService(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
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
        setBookingData({ date: '', time: '' });
        router.push('/bookings');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <button onClick={() => router.push('/')} className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                BookIt
              </button>
              <button onClick={() => router.push('/services')} className="btn-primary-dark">
                Back to Services
              </button>
            </div>
          </div>
        </nav>

        <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
            <p className="text-gray-400 text-xl mb-8">The service you're looking for doesn't exist or has been removed.</p>
            <button onClick={() => router.push('/services')} className="btn-primary-dark">
              Browse All Services
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button onClick={() => router.push('/')} className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition">
              BookIt
            </button>
            <button onClick={() => router.push('/services')} className="btn-primary-dark">
              Back to Services
            </button>
          </div>
        </div>
      </nav>

      <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Service Header */}
          <div className="animate-slide-down mb-12">
            <h1 className="heading-secondary mb-4">{service.title}</h1>
            <p className="text-gray-300 text-lg">{service.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8 animate-fade-in">
              {/* Service Details Card */}
              <div className="card-dark border border-slate-700 p-8 animate-slide-up">
                <h2 className="text-2xl font-bold mb-6 text-gradient">Service Details</h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                    <span className="text-gray-400">Category</span>
                    <span className="font-semibold capitalize bg-blue-900/30 text-blue-300 px-3 py-1 rounded">
                      {service.category}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                    <span className="text-gray-400">Duration</span>
                    <span className="font-semibold">{service.duration || 60} minutes</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                    <span className="text-gray-400">Price per Hour</span>
                    <span className="text-2xl font-bold text-blue-400">${service.pricePerHour || 0}</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-semibold ${service.available ? 'text-green-400' : 'text-red-400'}`}>
                      {service.available ? '✅ Available' : '❌ Unavailable'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Rating</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⭐</span>
                      <span className="font-semibold">{service.rating || 0}/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Provider Card */}
              {service.providerId && (
                <div className="card-dark border border-slate-700 p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <h2 className="text-2xl font-bold mb-6 text-gradient">Service Provider</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-2xl font-bold">
                      {service.providerId.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{service.providerId.name}</h3>
                      <p className="text-gray-400">{service.providerId.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="card-dark border border-slate-700 p-8 sticky top-24">
                <h3 className="text-2xl font-bold mb-6">Book Service</h3>

                {service.available ? (
                  <div className="space-y-4">
                    {/* Date Input */}
                    <div>
                      <label className="block text-gray-400 text-sm mb-2 font-medium">Select Date</label>
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        className="input-dark w-full"
                      />
                    </div>

                    {/* Time Input */}
                    <div>
                      <label className="block text-gray-400 text-sm mb-2 font-medium">Select Time</label>
                      <input
                        type="time"
                        value={bookingData.time}
                        onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                        className="input-dark w-full"
                      />
                    </div>

                    {/* Total Price */}
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Total Cost</p>
                      <p className="text-3xl font-bold text-emerald-400">
                        ${((service.duration || 60) / 60 * (service.pricePerHour || 0)).toFixed(2)}
                      </p>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={handleBook}
                      className="btn-primary-dark w-full py-3 text-lg font-bold mt-6"
                    >
                      📅 Book Now
                    </button>

                    {!user && (
                      <p className="text-yellow-400 text-sm text-center">
                        You need to login to book this service
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-4xl mb-4">🚫</p>
                    <p className="text-gray-300 font-semibold">This service is currently unavailable</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
