'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProviderServices() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(user);
    fetchServices(userData.id);
  }, [router]);

  const fetchServices = async (providerId: string) => {
    try {
      const res = await fetch(`/api/services?providerId=${providerId}`);
      const data = await res.json();
      setServices(data.services);
    } catch (error) {
      console.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

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
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const user = JSON.parse(localStorage.getItem('user')!);
        await fetchServices(user.id);
        setShowModal(false);
        setEditService(null);
        setFormData({ title: '', description: '', price: '' });
      }
    } catch (error) {
      alert('Failed to save service');
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
        const user = JSON.parse(localStorage.getItem('user')!);
        await fetchServices(user.id);
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
      price: service.price.toString(),
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-indigo-600">BookIt</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Services</h1>
          <button
            onClick={() => {
              setEditService(null);
              setFormData({ title: '', description: '', price: '' });
              setShowModal(true);
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Add Service
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : services.length === 0 ? (
          <p className="text-gray-600">No services yet. Create your first service!</p>
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
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(service)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editService ? 'Edit Service' : 'Add Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditService(null);
                    setFormData({ title: '', description: '', price: '' });
                  }}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
