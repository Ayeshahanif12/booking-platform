'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProviderServices() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    pricePerHour: '',
    duration: '60',
  });

  const categories = [
    'Cleaning',
    'Repair',
    'Tutoring',
    'Photography',
    'Plumbing',
    'Electrical',
    'Gardening',
    'Cooking',
    'Music',
    'Fitness',
    'Other',
  ];

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
    fetchServices();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router]);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/services', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setServices(data.services);
    } catch (error) {
      console.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!formData.title || !formData.description || !formData.pricePerHour) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const url = editService
        ? `/api/services/${editService._id}`
        : '/api/services';
      const method = editService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          pricePerHour: parseFloat(formData.pricePerHour),
          price: parseFloat(formData.pricePerHour),
          duration: parseInt(formData.duration),
        }),
      });

      if (res.ok) {
        await fetchServices();
        setShowModal(false);
        setEditService(null);
        setFormData({
          title: '',
          description: '',
          category: 'Other',
          pricePerHour: '',
          duration: '60',
        });
      } else {
        alert('Failed to save service');
      }
    } catch (error) {
      alert('Error saving service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchServices();
      }
    } catch (error) {
      alert('Failed to delete service');
    }
  };

  const openEditModal = (service: any) => {
    setEditService(service);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category || 'Other',
      pricePerHour: service.pricePerHour.toString(),
      duration: (service.duration || 60).toString(),
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
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
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/provider/analytics')}
                className="btn-secondary-dark text-sm"
              >
                Analytics
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-primary-dark"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-slide-down flex justify-between items-start">
            <div>
              <h1 className="heading-secondary mb-2">
                My <span className="text-gradient">Services</span>
              </h1>
              <p className="text-xl text-gray-300">Create and manage your service offerings</p>
            </div>
            <button
              onClick={() => {
                setEditService(null);
                setFormData({
                  title: '',
                  description: '',
                  category: 'Other',
                  pricePerHour: '',
                  duration: '60',
                });
                setShowModal(true);
              }}
              className="btn-primary-dark"
            >
              + Add Service
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-emerald-500 rounded-full spinner mb-4"></div>
              <p className="text-gray-400">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="card-dark p-12 text-center border border-slate-700 animate-scale-in">
              <p className="text-5xl mb-4">⭐</p>
              <p className="text-2xl font-bold mb-4">No Services Yet</p>
              <p className="text-gray-400 mb-6">Create your first service to start accepting bookings</p>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary-dark"
              >
                Create Service
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {services.map((service: any, idx: number) => (
                <div
                  key={service._id}
                  className="card-dark border border-slate-700 p-6 hover:border-slate-600 transition-all duration-300 animate-slide-up group"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-blue-400 transition">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {service.category}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/30 text-emerald-300">
                      {service.available ? '✅ Available' : '🔒 Unavailable'}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-800/50 rounded-lg p-3">
                    <div>
                      <p className="text-gray-400 text-xs">Price/Hour</p>
                      <p className="font-bold text-emerald-400">${service.pricePerHour}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Duration</p>
                      <p className="font-bold text-blue-400">{service.duration} min</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Rating</p>
                      <p className="font-bold text-yellow-400">⭐ {service.rating || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-smooth text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-600/30 py-2 rounded-lg font-semibold transition-smooth text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card-dark border border-slate-700 p-8 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <h2 className="heading-secondary mb-6">
              {editService ? 'Edit Service' : 'Create Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">
                  Service Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., House Cleaning"
                  className="input-dark w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your service..."
                  className="input-dark w-full h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-dark w-full"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-medium">
                    Price/Hour ($) *
                  </label>
                  <input
                    type="number"
                    name="pricePerHour"
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    placeholder="50"
                    className="input-dark w-full"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-medium">
                    Duration (min) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="60"
                    className="input-dark w-full"
                    min="15"
                    step="15"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary-dark font-semibold"
                >
                  {editService ? 'Update Service' : 'Create Service'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditService(null);
                    setFormData({
                      title: '',
                      description: '',
                      category: 'Other',
                      pricePerHour: '',
                      duration: '60',
                    });
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg font-semibold transition-smooth"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            Services Dashboard | Total Services: {services.length}
          </p>
        </div>
      </footer>
    </div>
  );
}
