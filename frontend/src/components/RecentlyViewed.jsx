import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, X, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RecentlyViewed = ({ limit = 5, showClearAll = true }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentlyViewed();
  }, []);

  const fetchRecentlyViewed = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
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
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center mb-4">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          <h3 className="text-lg font-semibold">Recently Viewed</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3">
                <div className="w-24 h-20 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center mb-4">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          <h3 className="text-lg font-semibold">Recently Viewed</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No recently viewed properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          <h3 className="text-lg font-semibold">Recently Viewed</h3>
        </div>
        {showClearAll && properties.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {properties.map((item) => (
          <div
            key={item.id}
            className="group relative border border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
          >
            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            >
              <X className="w-3 h-3 text-red-600" />
            </button>

            <div
              onClick={() => navigate(`/properties/${item.property_id}`)}
              className="flex gap-3"
            >
              <div className="w-24 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                {item.property?.images?.[0]?.image_url ? (
                  <img
                    src={item.property.images[0].image_url}
                    alt={item.property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                  {item.property?.title || 'Property'}
                </h4>
                <p className="text-xs text-gray-600 mb-1 truncate">
                  {item.property?.locality}, {item.property?.city}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-600">
                    {formatPrice(item.property?.price || 0)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {getTimeAgo(item.viewed_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {properties.length >= limit && (
        <button
          onClick={() => navigate('/recently-viewed')}
          className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All History
        </button>
      )}
    </div>
  );
};

export default RecentlyViewed;
