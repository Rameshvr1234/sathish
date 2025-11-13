import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

const AdvancedFilters = ({ onApplyFilters, initialFilters = {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    details: false,
    amenities: false,
    features: false
  });

  const [filters, setFilters] = useState({
    property_type: initialFilters.property_type || [],
    listing_type: initialFilters.listing_type || 'any',
    min_price: initialFilters.min_price || '',
    max_price: initialFilters.max_price || '',
    min_bedrooms: initialFilters.min_bedrooms || '',
    max_bedrooms: initialFilters.max_bedrooms || '',
    min_bathrooms: initialFilters.min_bathrooms || '',
    regions: initialFilters.regions || [],
    locations: initialFilters.locations || [],
    furnishing_status: initialFilters.furnishing_status || [],
    property_age: initialFilters.property_age || [],
    parking_type: initialFilters.parking_type || [],
    facing_direction: initialFilters.facing_direction || [],
    possession_status: initialFilters.possession_status || [],
    posted_by: initialFilters.posted_by || [],
    transaction_type: initialFilters.transaction_type || [],
    amenities: initialFilters.amenities || [],
    min_area: initialFilters.min_area || '',
    max_area: initialFilters.max_area || '',
    verified_only: initialFilters.verified_only || false
  });

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'independent_house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'plot', label: 'Plot' },
    { value: 'office', label: 'Office' },
    { value: 'shop', label: 'Shop' }
  ];

  const regions = ['coimbatore', 'salem', 'tirupur'];

  const furnishingOptions = [
    { value: 'furnished', label: 'Furnished' },
    { value: 'semi_furnished', label: 'Semi-Furnished' },
    { value: 'unfurnished', label: 'Unfurnished' }
  ];

  const propertyAgeOptions = [
    { value: '0-1', label: '0-1 years' },
    { value: '1-5', label: '1-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' }
  ];

  const parkingOptions = [
    { value: 'covered', label: 'Covered' },
    { value: 'open', label: 'Open' },
    { value: 'both', label: 'Both' }
  ];

  const facingOptions = [
    { value: 'north', label: 'North' },
    { value: 'south', label: 'South' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
    { value: 'north_east', label: 'North-East' },
    { value: 'north_west', label: 'North-West' },
    { value: 'south_east', label: 'South-East' },
    { value: 'south_west', label: 'South-West' }
  ];

  const possessionOptions = [
    { value: 'ready_to_move', label: 'Ready to Move' },
    { value: 'under_construction', label: 'Under Construction' },
    { value: 'new_launch', label: 'New Launch' }
  ];

  const postedByOptions = [
    { value: 'owner', label: 'Owner' },
    { value: 'builder', label: 'Builder' },
    { value: 'agent', label: 'Agent' }
  ];

  const amenitiesList = [
    'gym', 'swimming_pool', 'clubhouse', 'power_backup', 'lift',
    'security', 'garden', 'play_area', 'parking', 'water_supply',
    'intercom', 'gas_pipeline', 'wifi', 'fire_safety'
  ];

  const toggleArrayFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName].includes(value)
        ? prev[filterName].filter(v => v !== value)
        : [...prev[filterName], value]
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      property_type: [],
      listing_type: 'any',
      min_price: '',
      max_price: '',
      min_bedrooms: '',
      max_bedrooms: '',
      min_bathrooms: '',
      regions: [],
      locations: [],
      furnishing_status: [],
      property_age: [],
      parking_type: [],
      facing_direction: [],
      possession_status: [],
      posted_by: [],
      transaction_type: [],
      amenities: [],
      min_area: '',
      max_area: '',
      verified_only: false
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.property_type.length > 0) count++;
    if (filters.listing_type !== 'any') count++;
    if (filters.min_price || filters.max_price) count++;
    if (filters.min_bedrooms || filters.max_bedrooms) count++;
    if (filters.regions.length > 0) count++;
    if (filters.furnishing_status.length > 0) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.verified_only) count++;
    return count;
  };

  return (
    <div>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Filter size={20} />
        <span>Advanced Filters</span>
        {getActiveFiltersCount() > 0 && (
          <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
            {getActiveFiltersCount()}
          </span>
        )}
      </button>

      {/* Filters Panel */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Advanced Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Filters Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Filters */}
              <div className="border rounded-lg">
                <button
                  onClick={() => toggleSection('basic')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900">Basic Filters</span>
                  {expandedSections.basic ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.basic && (
                  <div className="p-4 space-y-4 border-t">
                    {/* Property Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {propertyTypes.map(type => (
                          <button
                            key={type.value}
                            onClick={() => toggleArrayFilter('property_type', type.value)}
                            className={`px-4 py-2 rounded-lg border ${
                              filters.property_type.includes(type.value)
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Listing Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Looking For
                      </label>
                      <div className="flex gap-2">
                        {['any', 'sale', 'rent', 'lease'].map(type => (
                          <button
                            key={type}
                            onClick={() => setFilters({ ...filters, listing_type: type })}
                            className={`flex-1 px-4 py-2 rounded-lg border capitalize ${
                              filters.listing_type === type
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Min Price (₹)
                        </label>
                        <input
                          type="number"
                          value={filters.min_price}
                          onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 2500000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Price (₹)
                        </label>
                        <input
                          type="number"
                          value={filters.max_price}
                          onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 5000000"
                        />
                      </div>
                    </div>

                    {/* Bedrooms */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Min Bedrooms
                        </label>
                        <select
                          value={filters.min_bedrooms}
                          onChange={(e) => setFilters({ ...filters, min_bedrooms: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Any</option>
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num} BHK</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Bedrooms
                        </label>
                        <select
                          value={filters.max_bedrooms}
                          onChange={(e) => setFilters({ ...filters, max_bedrooms: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Any</option>
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num} BHK</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Regions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Regions
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {regions.map(region => (
                          <button
                            key={region}
                            onClick={() => toggleArrayFilter('regions', region)}
                            className={`px-4 py-2 rounded-lg border capitalize ${
                              filters.regions.includes(region)
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {region}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="border rounded-lg">
                <button
                  onClick={() => toggleSection('details')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900">Property Details</span>
                  {expandedSections.details ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.details && (
                  <div className="p-4 space-y-4 border-t">
                    {/* Furnishing Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Furnishing Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {furnishingOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => toggleArrayFilter('furnishing_status', option.value)}
                            className={`px-4 py-2 rounded-lg border ${
                              filters.furnishing_status.includes(option.value)
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Property Age */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Age
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {propertyAgeOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => toggleArrayFilter('property_age', option.value)}
                            className={`px-4 py-2 rounded-lg border ${
                              filters.property_age.includes(option.value)
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Parking */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parking
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {parkingOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => toggleArrayFilter('parking_type', option.value)}
                            className={`px-4 py-2 rounded-lg border ${
                              filters.parking_type.includes(option.value)
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Facing Direction */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facing Direction
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {facingOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => toggleArrayFilter('facing_direction', option.value)}
                            className={`px-3 py-2 rounded-lg border text-sm ${
                              filters.facing_direction.includes(option.value)
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Possession Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Possession Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {possessionOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => toggleArrayFilter('possession_status', option.value)}
                            className={`px-4 py-2 rounded-lg border ${
                              filters.possession_status.includes(option.value)
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Posted By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Posted By
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {postedByOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => toggleArrayFilter('posted_by', option.value)}
                            className={`px-4 py-2 rounded-lg border ${
                              filters.posted_by.includes(option.value)
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className="border rounded-lg">
                <button
                  onClick={() => toggleSection('amenities')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900">Amenities</span>
                  {expandedSections.amenities ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.amenities && (
                  <div className="p-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {amenitiesList.map(amenity => (
                        <button
                          key={amenity}
                          onClick={() => toggleArrayFilter('amenities', amenity)}
                          className={`px-3 py-2 rounded-lg border text-sm capitalize ${
                            filters.amenities.includes(amenity)
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {amenity.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Verification */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verified_only"
                  checked={filters.verified_only}
                  onChange={(e) => setFilters({ ...filters, verified_only: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="verified_only" className="ml-2 text-sm font-medium text-gray-700">
                  Show only verified properties
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Clear All
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Apply Filters ({getActiveFiltersCount()})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
