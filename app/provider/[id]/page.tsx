'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const providerId = params.id as string | undefined;
    if (!providerId) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/providers/${providerId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load provider profile');
        }

        setProvider(data.provider);
        setServices(data.services || []);
        setReviews(data.reviews || []);
        setStats(data.stats || null);
      } catch (err: any) {
        setError(err.message || 'Failed to load provider profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  const formatDate = (value: string) => {
    try {
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const handleCopyId = async () => {
    if (!provider?._id) return;
    try {
      await navigator.clipboard.writeText(provider._id);
      showToast('Provider ID copied', 'success');
    } catch {
      showToast('Unable to copy Provider ID', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={() => router.push('/search')}
              className="text-3xl font-bold bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              BookIt
            </button>
            <button
              onClick={() => router.push('/search')}
              className="btn-primary-dark"
            >
              Back to Search
            </button>
          </div>
        </div>
      </nav>

      <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full spinner mb-4"></div>
              <p className="text-gray-400">Loading provider profile...</p>
            </div>
          ) : error ? (
            <div className="card-dark p-10 border border-slate-700 text-center">
              <p className="text-xl text-red-300 mb-2">Unable to load provider</p>
              <p className="text-gray-400">{error}</p>
            </div>
          ) : provider ? (
            <div className="space-y-10">
              {/* Provider Header */}
              <div className="card-dark p-8 border border-slate-700 animate-slide-down">
                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-slate-800">
                    {provider.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold">{provider.name}</h1>
                      {provider.verified && (
                        <span className="bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400">{provider.email}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-300">
                      <span>Active since {formatDate(provider.createdAt)}</span>
                      <span>Last active {formatDate(provider.updatedAt)}</span>
                      <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                        Rating {stats?.averageRating ?? 0}/5
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span className="bg-slate-900/60 px-3 py-1 rounded-full border border-slate-700">
                        Provider ID: {provider._id}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="btn-secondary-dark px-3 py-1 text-xs"
                      >
                        Copy ID
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <p className="text-gray-400 text-sm mb-1">Total Services</p>
                    <p className="text-2xl font-bold text-blue-300">{stats?.totalServices ?? 0}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <p className="text-gray-400 text-sm mb-1">Total Reviews</p>
                    <p className="text-2xl font-bold text-emerald-300">{stats?.totalReviews ?? 0}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <p className="text-gray-400 text-sm mb-1">Completed Bookings</p>
                    <p className="text-2xl font-bold text-indigo-300">{stats?.completedBookings ?? 0}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <p className="text-gray-400 text-sm mb-1">Response Rate</p>
                    <p className="text-2xl font-bold text-yellow-300">{stats?.responseRate ?? 0}%</p>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Services</h2>
                {services.length === 0 ? (
                  <div className="card-dark p-8 border border-slate-700 text-center text-gray-400">
                    <p className="mb-4">No services available from this provider.</p>
                    <button
                      onClick={() => router.push('/search')}
                      className="btn-primary-dark"
                    >
                      Browse Services
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {services.map((service, idx) => (
                      <div
                        key={service._id}
                        className="card-dark p-6 border border-slate-700 hover:border-blue-500/50 transition animate-slide-up"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold">{service.title}</h3>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                            service.available
                              ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300'
                              : 'bg-red-500/10 border-red-400/30 text-red-300'
                          }`}>
                            {service.available ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-gray-500 text-xs">Price/Hour</p>
                            <p className="text-blue-300 font-semibold">${service.pricePerHour}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Duration</p>
                            <p className="text-emerald-300 font-semibold">{service.duration || 60} mins</p>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/services/${service._id}`)}
                          className="btn-primary-dark w-full"
                        >
                          View & Book
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {reviews.length === 0 ? (
                  <div className="card-dark p-8 border border-slate-700 text-center text-gray-400">
                    <p className="mb-4">No reviews yet.</p>
                    <button
                      onClick={() => router.push('/search')}
                      className="btn-secondary-dark"
                    >
                      Explore Services
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="card-dark p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">{review.userId?.name || 'Customer'}</p>
                          <span className="text-sm text-gray-400">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <div className="text-yellow-300 text-sm mb-2">
                          Rating: {review.rating ?? 'N/A'}
                        </div>
                        {review.review ? (
                          <p className="text-gray-300">{review.review}</p>
                        ) : (
                          <p className="text-gray-500 text-sm">No written review.</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card-dark p-10 border border-slate-700 text-center text-gray-400">
              Provider not found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
