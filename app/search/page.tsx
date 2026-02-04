'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ServicesSearchPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [topProviders, setTopProviders] = useState<any[]>([]);
  const [topLoading, setTopLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedRating, setSelectedRating] = useState('all');

  const categories = [
    'All',
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
    if (!token) {
      router.push('/login');
      return;
    }

    fetchServices();
    fetchTopProviders();

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
      setFilteredServices(data.services);
    } catch (error) {
      console.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopProviders = async () => {
    try {
      const res = await fetch('/api/providers/top?limit=6');
      const data = await res.json();
      setTopProviders(data.providers || []);
    } catch (error) {
      console.error('Failed to fetch top providers');
    } finally {
      setTopLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, priceRange, selectedRating, services]);

  const applyFilters = () => {
    if (!services || services.length === 0) {
      setFilteredServices([]);
      return;
    }

    let filtered = services;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        s => s.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(s => {
      const price = s.pricePerHour || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Rating filter
    if (selectedRating !== 'all') {
      const minRating = parseInt(selectedRating);
      filtered = filtered.filter(s => {
        const rating = s.rating || 0;
        return rating >= minRating;
      });
    }

    setFilteredServices(filtered);
  };

  const handleBooking = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 1000 });
    setSelectedRating('all');
    setFilteredServices(services);
  };

  const getProviderIdValue = (providerId: any) =>
    typeof providerId === 'string' ? providerId : providerId?._id;

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
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
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary-dark"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-slide-down">
            <h1 className="heading-secondary mb-2">
              Discover <span className="text-gradient">Services</span>
            </h1>
            <p className="text-xl text-gray-300">Find the perfect service for your needs</p>
          </div>

          {/* Top Providers */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Top Providers</h2>
              <button
                onClick={() => router.push('/services')}
                className="btn-secondary-dark text-sm px-4 py-2"
              >
                Browse All
              </button>
            </div>
            {topLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={`provider-skeleton-${idx}`}
                    className="card-dark border border-slate-700 p-5 animate-pulse"
                  >
                    <div className="h-10 w-10 rounded-full bg-slate-700 mb-4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-2/3 mb-4"></div>
                    <div className="h-8 bg-slate-700 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : topProviders.length === 0 ? (
              <div className="card-dark border border-slate-700 p-8 text-center text-gray-400">
                <p className="mb-4">No featured providers yet.</p>
                <button
                  onClick={() => router.push('/services')}
                  className="btn-primary-dark"
                >
                  Explore Services
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topProviders.map((provider: any) => (
                  <div key={provider._id} className="card-dark border border-slate-700 p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center font-bold text-lg">
                        {provider.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{provider.name}</p>
                        <p className="text-xs text-gray-400">{provider.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-300 mb-4">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Rating</p>
                        <p className="font-semibold">{provider.averageRating || 0}/5</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Response Rate</p>
                        <p className="font-semibold">{provider.responseRate || 0}%</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Services</p>
                        <p className="font-semibold">{provider.totalServices || 0}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Completed</p>
                        <p className="font-semibold">{provider.completedBookings || 0}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/provider/${provider._id}`)}
                      className="btn-primary-dark w-full text-sm"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="grid lg:grid-cols-4 gap-6 mb-12">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1 space-y-6 animate-slide-down">
              {/* Search */}
              <div className="card-dark border border-slate-700 p-6">
                <h3 className="font-bold mb-4">Search</h3>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-dark w-full"
                />
              </div>

              {/* Category Filter */}
              <div className="card-dark border border-slate-700 p-6">
                <h3 className="font-bold mb-4">Category</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer hover:text-blue-400 transition">
                      <input
                        type="radio"
                        name="category"
                        value={cat.toLowerCase()}
                        checked={selectedCategory === cat.toLowerCase() || (cat === 'All' && selectedCategory === 'all')}
                        onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="card-dark border border-slate-700 p-6">
                <h3 className="font-bold mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Min Price: ${priceRange.min}</label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Max Price: ${priceRange.max}</label>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="card-dark border border-slate-700 p-6">
                <h3 className="font-bold mb-4">Rating</h3>
                <div className="space-y-2">
                  {['all', '5', '4', '3'].map(rating => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer hover:text-blue-400 transition">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={selectedRating === rating}
                        onChange={(e) => setSelectedRating(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>
                        {rating === 'all' ? 'All Ratings' : `${rating}+ Stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="space-y-4 animate-fade-in">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={`service-skeleton-${idx}`} className="card-dark border border-slate-700 p-6 animate-pulse">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-32 h-32 rounded-lg bg-slate-700"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-5 bg-slate-700 rounded w-1/2"></div>
                          <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                          <div className="h-3 bg-slate-700 rounded w-full"></div>
                          <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                          <div className="grid md:grid-cols-4 gap-4 pt-2">
                            <div className="h-12 bg-slate-700 rounded"></div>
                            <div className="h-12 bg-slate-700 rounded"></div>
                            <div className="h-12 bg-slate-700 rounded"></div>
                            <div className="h-12 bg-slate-700 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !filteredServices || filteredServices.length === 0 ? (
                <div className="card-dark p-12 text-center border border-slate-700 animate-scale-in">
                  <p className="text-2xl font-bold mb-4">No Services Found</p>
                  <p className="text-gray-400">Try adjusting your filters to find more services</p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={resetFilters}
                      className="btn-primary-dark"
                    >
                      Reset Filters
                    </button>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="btn-secondary-dark"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  {/* Results count */}
                  <p className="text-gray-400 text-sm">
                    Showing {filteredServices.length} of {services.length} services
                  </p>

                  {/* Service Cards */}
                  <div className="space-y-4">
                    {filteredServices.map((service: any, idx: number) => (
                      <div
                        key={service._id}
                        className="card-dark border border-slate-700 p-6 hover:border-slate-600 transition-all duration-300 animate-slide-up cursor-pointer group"
                        onClick={() => handleBooking(service._id)}
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Service Image */}
                          <div className="md:w-32 h-32 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform">
                            Service
                          </div>

                          {/* Service Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold group-hover:text-blue-400 transition">{service.title}</h3>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    const providerId = getProviderIdValue(service.providerId);
                                    if (providerId) {
                                      router.push(`/provider/${providerId}`);
                                    }
                                  }}
                                  className="text-gray-400 text-sm hover:text-blue-300 transition text-left"
                                >
                                  by {service.providerId?.name || 'Unknown provider'}
                                </button>
                              </div>
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/30 text-emerald-300 capitalize">
                                {service.category}
                              </span>
                            </div>

                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{service.description}</p>

                            <div className="grid md:grid-cols-4 gap-4 mb-4">
                              <div className="bg-slate-800/50 rounded-lg p-3">
                                <p className="text-gray-400 text-xs mb-1">Price/Hour</p>
                                <p className="text-lg font-bold text-emerald-400">${service.pricePerHour}</p>
                              </div>
                              <div className="bg-slate-800/50 rounded-lg p-3">
                                <p className="text-gray-400 text-xs mb-1">Duration</p>
                                <p className="text-lg font-bold text-blue-400">{service.duration || 60} mins</p>
                              </div>
                              <div className="bg-slate-800/50 rounded-lg p-3">
                                <p className="text-gray-400 text-xs mb-1">Rating</p>
                                <p className="text-lg font-bold text-yellow-400">Rating {service.rating || 'N/A'}</p>
                              </div>
                              <div className="bg-slate-800/50 rounded-lg p-3">
                                <p className="text-gray-400 text-xs mb-1">Availability</p>
                                <p className="text-lg font-bold text-purple-400">
                                  {service.available ? 'Yes' : 'No'}
                                </p>
                              </div>
                            </div>

                            <button className="btn-primary-dark w-full sm:w-auto">
                              View & Book
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            Search Results • Filters Applied • {filteredServices?.length || 0} Services Found
          </p>
        </div>
      </footer>
    </div>
  );
}
