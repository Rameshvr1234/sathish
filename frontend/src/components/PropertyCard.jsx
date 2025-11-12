import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Phone,
  Share2,
  Eye,
  ArrowRight,
  Building,
  Home,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PropertyCard = ({ property, onScheduleVisit, viewMode = 'grid' }) => {
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (date) => {
    const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const handleShortlist = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (isShortlisted) {
        // Remove from shortlist (assuming we have the shortlist ID)
        return;
      }

      const response = await axios.post(
        `${API_URL}/shortlist`,
        {
          property_id: property.id,
          folder: 'default',
          priority: 'medium'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setIsShortlisted(true);
      }
    } catch (error) {
      console.error('Error toggling shortlist:', error);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/properties/${property.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: url
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleContact = (e) => {
    e.stopPropagation();
    // Track contact view
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(
        `${API_URL}/leads`,
        {
          property_id: property.id,
          lead_type: 'contact',
          message: 'Interested in property'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(err => console.error('Error tracking contact:', err));
    }
    // Show contact details or modal
    alert(`Contact: ${property.owner?.phone || 'Contact information not available'}`);
  };

  const getPropertyTypeIcon = () => {
    const type = property.property_type?.toLowerCase();
    if (type?.includes('apartment') || type?.includes('flat')) return <Building className="w-4 h-4" />;
    if (type?.includes('house') || type?.includes('villa')) return <Home className="w-4 h-4" />;
    return <Building className="w-4 h-4" />;
  };

  // Grid View (Default)
  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* Image */}
        <div
          className="relative h-52 bg-gray-100 cursor-pointer overflow-hidden"
          onClick={() => navigate(`/properties/${property.id}`)}
        >
          {property.images && property.images.length > 0 && !imageError ? (
            <img
              src={property.images[0].image_url}
              alt={property.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Home className="w-16 h-16" />
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
              {property.property_type}
            </span>
            {property.is_featured && (
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleShortlist}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isShortlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Posted Date */}
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-black/70 text-white text-xs rounded flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(property.created_at)}
            </span>
          </div>

          {/* View Count */}
          {property.views > 0 && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2 py-1 bg-black/70 text-white text-xs rounded flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {property.views}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-2xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </h3>
            {property.built_up_area && (
              <span className="text-sm text-gray-600">
                ₹{Math.round(property.price / property.built_up_area).toLocaleString()}/sq.ft
              </span>
            )}
          </div>

          {/* Title */}
          <h4
            className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate(`/properties/${property.id}`)}
          >
            {property.title}
          </h4>

          {/* Location */}
          <div className="flex items-start gap-1 text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
            <p className="text-sm line-clamp-1">
              {property.locality}, {property.city}
            </p>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 py-3 border-t border-gray-100 text-sm text-gray-600">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            {property.built_up_area > 0 && (
              <div className="flex items-center gap-1">
                <Maximize className="w-4 h-4" />
                <span>{property.built_up_area} sq.ft</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={handleContact}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Phone className="w-4 h-4" />
              Contact
            </button>
            <button
              onClick={() => navigate(`/properties/${property.id}`)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div
          className="relative w-full md:w-80 h-52 bg-gray-100 cursor-pointer overflow-hidden flex-shrink-0"
          onClick={() => navigate(`/properties/${property.id}`)}
        >
          {property.images && property.images.length > 0 && !imageError ? (
            <img
              src={property.images[0].image_url}
              alt={property.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Home className="w-16 h-16" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
              {property.property_type}
            </span>
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleShortlist}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isShortlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-2xl font-bold text-blue-600 mb-1">
                {formatPrice(property.price)}
              </h3>
              {property.built_up_area && (
                <span className="text-sm text-gray-600">
                  ₹{Math.round(property.price / property.built_up_area).toLocaleString()}/sq.ft
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(property.created_at)}
            </span>
          </div>

          <h4
            className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate(`/properties/${property.id}`)}
          >
            {property.title}
          </h4>

          <div className="flex items-start gap-1 text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
            <p className="text-sm">
              {property.locality}, {property.city}
            </p>
          </div>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
            )}
            {property.built_up_area > 0 && (
              <div className="flex items-center gap-1">
                <Maximize className="w-4 h-4" />
                <span>{property.built_up_area} sq.ft</span>
              </div>
            )}
          </div>

          {/* Description */}
          {property.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {property.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleContact}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Phone className="w-4 h-4" />
              Contact Owner
            </button>
            <button
              onClick={() => navigate(`/properties/${property.id}`)}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
