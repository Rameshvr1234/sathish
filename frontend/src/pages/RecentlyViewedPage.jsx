import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Trash2, Eye, MapPin, Home } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RecentlyViewedPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentlyViewed();
  }, [limit]);

  const fetchRecentlyViewed = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/recently-viewed?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setProperties(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching recently viewed:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all browsing history?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/recently-viewed/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setProperties([]);
      }
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/recently-viewed/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setProperties(properties.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4">
                  <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recently Viewed Properties</h1>
              <p className="text-gray-600 mt-1">
                {properties.length} {properties.length === 1 ? 'property' : 'properties'} in your history
              </p>
            </div>
          </div>

          {properties.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Clear All History
            </button>
          )}
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Eye className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Viewing History</h3>
            <p className="text-gray-500 mb-6">
              Properties you view will appear here for easy access
            </p>
            <button
              onClick={() => navigate('/properties')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              Browse Properties
            </button>
          </div>
        ) : (
          <>
            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {properties.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group relative"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>

                  {/* Image */}
                  <div
                    onClick={() => navigate(`/properties/${item.property_id}`)}
                    className="cursor-pointer"
                  >
                    <div className="relative w-full h-48 bg-gray-100">
                      {item.property?.images?.[0]?.image_url ? (
                        <img
                          src={item.property.images[0].image_url}
                          alt={item.property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Home className="w-12 h-12" />
                        </div>
                      )}

                      {/* Property Type Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                        {item.property?.property_type}
                      </div>

                      {/* Viewed Time Badge */}
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                        {getTimeAgo(item.viewed_at)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {item.property?.title || 'Property Title'}
                      </h3>

                      <div className="flex items-start gap-1 text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p className="text-sm line-clamp-2">
                          {item.property?.locality}, {item.property?.city}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatPrice(item.property?.price || 0)}
                          </p>
                          {item.property?.built_up_area && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.property.built_up_area} sq.ft
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/properties/${item.property_id}`);
                          }}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {properties.length >= limit && (
              <div className="text-center">
                <button
                  onClick={() => setLimit(limit + 20)}
                  className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Load More Properties
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewedPage;
