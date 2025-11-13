import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  X,
  Plus,
  Home,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  DollarSign,
  Download,
  Share2,
  Search
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PropertyComparisonPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const ids = searchParams.get('ids');
    if (ids) {
      fetchProperties(ids.split(','));
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchProperties = async (ids) => {
    try {
      const promises = ids.map(id =>
        axios.get(`${API_URL}/properties/${id}`)
      );
      const responses = await Promise.all(promises);
      const props = responses
        .filter(r => r.data.success)
        .map(r => r.data.data);
      setProperties(props);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProperties = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/properties?search=${query}&limit=5`);
      if (response.data.success) {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error('Error searching properties:', error);
    }
  };

  const addProperty = (property) => {
    if (properties.length >= 4) {
      alert('You can compare up to 4 properties at a time');
      return;
    }
    if (properties.find(p => p.id === property.id)) {
      alert('This property is already in comparison');
      return;
    }
    setProperties([...properties, property]);
    setShowAddModal(false);
    setSearchQuery('');
    setSearchResults([]);
    updateURL([...properties, property]);
  };

  const removeProperty = (id) => {
    const updated = properties.filter(p => p.id !== id);
    setProperties(updated);
    updateURL(updated);
  };

  const updateURL = (props) => {
    const ids = props.map(p => p.id).join(',');
    navigate(`/compare?ids=${ids}`, { replace: true });
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const comparisonFields = [
    { key: 'price', label: 'Price', type: 'price' },
    { key: 'property_type', label: 'Property Type', type: 'text' },
    { key: 'transaction_type', label: 'For', type: 'text' },
    { key: 'bedrooms', label: 'Bedrooms', type: 'number', suffix: ' BHK' },
    { key: 'bathrooms', label: 'Bathrooms', type: 'number' },
    { key: 'built_up_area', label: 'Built-up Area', type: 'number', suffix: ' sq.ft' },
    { key: 'carpet_area', label: 'Carpet Area', type: 'number', suffix: ' sq.ft' },
    { key: 'floor_number', label: 'Floor', type: 'text' },
    { key: 'total_floors', label: 'Total Floors', type: 'number' },
    { key: 'furnishing', label: 'Furnishing', type: 'text' },
    { key: 'parking', label: 'Parking', type: 'number', suffix: ' spaces' },
    { key: 'facing', label: 'Facing', type: 'text' },
    { key: 'possession_status', label: 'Possession', type: 'text' },
    { key: 'age_of_property', label: 'Property Age', type: 'number', suffix: ' years' },
    { key: 'locality', label: 'Locality', type: 'text' },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'amenities', label: 'Amenities', type: 'array' },
    { key: 'balconies', label: 'Balconies', type: 'number' },
    { key: 'water_supply', label: 'Water Supply', type: 'text' },
    { key: 'power_backup', label: 'Power Backup', type: 'boolean' },
    { key: 'security', label: 'Security', type: 'boolean' },
    { key: 'created_at', label: 'Listed On', type: 'date' }
  ];

  const exportComparison = () => {
    // Create simple text export
    let exportText = 'Property Comparison\n\n';

    properties.forEach((prop, index) => {
      exportText += `\n=== Property ${index + 1}: ${prop.title} ===\n`;
      comparisonFields.forEach(field => {
        const value = prop[field.key];
        if (value !== null && value !== undefined && value !== '') {
          exportText += `${field.label}: ${formatValue(value, field)}\n`;
        }
      });
    });

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'property-comparison.txt';
    a.click();
  };

  const shareComparison = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Property Comparison',
        text: 'Check out this property comparison',
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const formatValue = (value, field) => {
    if (value === null || value === undefined || value === '') return '-';

    switch (field.type) {
      case 'price':
        return formatPrice(value);
      case 'number':
        return `${value}${field.suffix || ''}`;
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'date':
        return formatDate(value);
      case 'array':
        return Array.isArray(value) ? value.join(', ') : value;
      case 'text':
        return value.toString().charAt(0).toUpperCase() + value.toString().slice(1);
      default:
        return value;
    }
  };

  const getCellColor = (field, properties, currentValue, propIndex) => {
    if (field.type === 'price' || field.type === 'number') {
      const values = properties
        .map(p => p[field.key])
        .filter(v => v !== null && v !== undefined && v !== '');

      if (values.length === 0) return '';

      const numValues = values.map(v => parseFloat(v));
      const max = Math.max(...numValues);
      const min = Math.min(...numValues);

      if (field.key === 'price' || field.key === 'age_of_property') {
        // Lower is better
        if (currentValue === min) return 'bg-green-50 border-green-200';
        if (currentValue === max) return 'bg-red-50 border-red-200';
      } else {
        // Higher is better
        if (currentValue === max) return 'bg-green-50 border-green-200';
        if (currentValue === min) return 'bg-yellow-50 border-yellow-200';
      }
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Comparison</h1>
            <p className="text-gray-600">
              Compare up to 4 properties side-by-side
            </p>
          </div>
          {properties.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={exportComparison}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
              <button
                onClick={shareComparison}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          )}
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Home className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Properties to Compare</h3>
            <p className="text-gray-500 mb-6">
              Add properties to start comparing their features and prices
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Property
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="sticky left-0 bg-gray-50 p-4 text-left font-semibold text-gray-700 min-w-[200px]">
                      Features
                    </th>
                    {properties.map((property) => (
                      <th key={property.id} className="bg-gray-50 p-4 min-w-[280px]">
                        <div className="relative">
                          <button
                            onClick={() => removeProperty(property.id)}
                            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div
                            className="cursor-pointer"
                            onClick={() => navigate(`/properties/${property.id}`)}
                          >
                            {property.images && property.images[0] ? (
                              <img
                                src={property.images[0].image_url}
                                alt={property.title}
                                className="w-full h-40 object-cover rounded-lg mb-3"
                              />
                            ) : (
                              <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                                <Home className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                              {property.title}
                            </h3>
                            <p className="text-xs text-gray-600 flex items-center gap-1 justify-center">
                              <MapPin className="w-3 h-3" />
                              {property.locality}, {property.city}
                            </p>
                          </div>
                        </div>
                      </th>
                    ))}
                    {properties.length < 4 && (
                      <th className="bg-gray-50 p-4 min-w-[280px]">
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                        >
                          <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                          <span className="text-gray-600 group-hover:text-blue-600 font-medium">
                            Add Property
                          </span>
                        </button>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFields.map((field, index) => (
                    <tr key={field.key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="sticky left-0 p-4 font-medium text-gray-700 border-r border-gray-200 bg-inherit">
                        {field.label}
                      </td>
                      {properties.map((property) => {
                        const value = property[field.key];
                        const cellColor = getCellColor(field, properties, value, 0);
                        return (
                          <td
                            key={property.id}
                            className={`p-4 text-center border-r border-gray-200 ${cellColor}`}
                          >
                            <span className="text-gray-900">
                              {formatValue(value, field)}
                            </span>
                          </td>
                        );
                      })}
                      {properties.length < 4 && (
                        <td className="p-4 text-center border-r border-gray-200 bg-gray-50"></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {properties.length > 0 && properties.length < 4 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Another Property
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Legend:</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
              <span className="text-gray-600">Best Value</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
              <span className="text-gray-600">Good Value</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
              <span className="text-gray-600">Higher Value</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add Property to Compare</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchProperties(e.target.value);
                  }}
                  placeholder="Search properties..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((property) => (
                    <div
                      key={property.id}
                      onClick={() => addProperty(property)}
                      className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      {property.images && property.images[0] ? (
                        <img
                          src={property.images[0].image_url}
                          alt={property.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                          <Home className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 truncate">
                          {property.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {property.locality}, {property.city}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {formatPrice(property.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className="text-center py-8 text-gray-500">
                  No properties found
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Start typing to search properties
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyComparisonPage;
