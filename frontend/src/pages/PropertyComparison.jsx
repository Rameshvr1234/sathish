import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, Home, MapPin, IndianRupee, Bed, Bath, Maximize, Calendar, Compass, Car, Check, AlertCircle } from 'lucide-react';

const PropertyComparison = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const propertyIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
    if (propertyIds.length === 0) {
      navigate('/properties');
      return;
    }
    fetchProperties(propertyIds);
  }, [searchParams]);

  const fetchProperties = async (ids) => {
    setLoading(true);
    try {
      const requests = ids.map(id =>
        axios.get(`${import.meta.env.VITE_API_URL}/properties/${id}`)
      );
      const responses = await Promise.all(requests);
      setProperties(responses.map(res => res.data.data));
    } catch (error) {
      console.error('Error fetching properties:', error);
      alert('Error loading properties for comparison');
    } finally {
      setLoading(false);
    }
  };

  const removeProperty = (propertyId) => {
    const currentIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
    const newIds = currentIds.filter(id => id !== propertyId.toString());

    if (newIds.length === 0) {
      navigate('/properties');
    } else {
      navigate(`/compare?ids=${newIds.join(',')}`);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatPropertyType = (type) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatFurnishing = (status) => {
    if (!status) return 'N/A';
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatFacing = (direction) => {
    if (!direction) return 'N/A';
    return direction.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No properties to compare</p>
          <button
            onClick={() => navigate('/properties')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Comparison</h1>
          <p className="text-gray-600">Compare up to 4 properties side by side</p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10">
                    Feature
                  </th>
                  {properties.map((property) => (
                    <th key={property.id} className="px-6 py-4 text-center min-w-[300px]">
                      <div className="relative">
                        <button
                          onClick={() => removeProperty(property.id)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                        <div className="w-full h-48 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0].image_url}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home size={48} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-left mb-1">{property.title}</h3>
                        <p className="text-sm text-gray-600 text-left flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {property.location}, {property.region}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Price */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    <IndianRupee className="inline mr-2" size={18} />
                    Price
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(property.price)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Property Type */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    <Home className="inline mr-2" size={18} />
                    Property Type
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center text-gray-900">
                      {formatPropertyType(property.property_type)}
                    </td>
                  ))}
                </tr>

                {/* Bedrooms */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    <Bed className="inline mr-2" size={18} />
                    Bedrooms
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center text-gray-900">
                      {property.bedrooms || 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Bathrooms */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    <Bath className="inline mr-2" size={18} />
                    Bathrooms
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center text-gray-900">
                      {property.bathrooms || 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Area */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    <Maximize className="inline mr-2" size={18} />
                    Built-up Area
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center text-gray-900">
                      {property.built_up_area ? `${property.built_up_area} sq.ft` :
                       property.area ? `${property.area} sq.ft` : 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Carpet Area */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    <Maximize className="inline mr-2" size={18} />
                    Carpet Area
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center text-gray-900">
                      {property.carpet_area ? `${property.carpet_area} sq.ft` : 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Price per sq.ft */}
                <tr className="hover:bg-gray-50 bg-blue-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-blue-50">
                    <IndianRupee className="inline mr-2" size={18} />
                    Price per sq.ft
                  </td>
                  {properties.map((property) => {
                    const area = property.carpet_area || property.built_up_area || property.area;
                    const pricePerSqft = area ? (property.price / area).toFixed(0) : 'N/A';
                    return (
                      <td key={property.id} className="px-6 py-4 text-center">
                        <span className="font-semibold text-blue-600">
                          {pricePerSqft !== 'N/A' ? `₹${pricePerSqft}` : 'N/A'}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Furnishing */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    Furnishing Status
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center text-gray-900">
                      {formatFurnishing(property.furnishing_status)}
                    </td>
                  ))}
                </tr>

                {/* Floor */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    Floor
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center text-gray-900">
                      {property.floor_number && property.total_floors
                        ? `${property.floor_number} of ${property.total_floors}`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Facing */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    <Compass className="inline mr-2" size={18} />
                    Facing
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center text-gray-900">
                      {formatFacing(property.facing_direction)}
                    </td>
                  ))}
                </tr>

                {/* Parking */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    <Car className="inline mr-2" size={18} />
                    Parking
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center text-gray-900">
                      {property.parking_count
                        ? `${property.parking_count} ${property.parking_type || 'spots'}`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Property Age */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    <Calendar className="inline mr-2" size={18} />
                    Property Age
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center text-gray-900">
                      {property.property_age ? `${property.property_age} years` : 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Possession Status */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    Possession
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center text-gray-900">
                      {property.possession_status
                        ? formatFurnishing(property.possession_status)
                        : 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Amenities */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white align-top">
                    Amenities
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      {property.amenities && property.amenities.length > 0 ? (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {property.amenities.map((amenity, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
                            >
                              <Check size={12} className="mr-1" />
                              {amenity}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500">No amenities listed</p>
                      )}
                    </td>
                  ))}
                </tr>

                {/* RERA Verified */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    RERA Verified
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center">
                      {property.rera_verified ? (
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          <Check size={16} className="mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-gray-500">Not Verified</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Owner Verified */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                    Owner Verified
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center">
                      {property.owner_verified ? (
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          <Check size={16} className="mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-gray-500">Not Verified</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Description */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white align-top">
                    Description
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      <p className="text-sm text-gray-600 text-left line-clamp-4">
                        {property.description || 'No description available'}
                      </p>
                    </td>
                  ))}
                </tr>

                {/* Action Buttons */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-gray-50">
                    Actions
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-center">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => navigate(`/properties/${property.id}`)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {/* Contact owner logic */}}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                        >
                          Contact Owner
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Message */}
        {properties.length < 4 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              💡 You can compare up to 4 properties. Add more properties from the property listing page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyComparison;
