import { useState } from 'react';
import axios from 'axios';
import { Home, TrendingUp, MapPin, Award, IndianRupee, Calendar, Layers } from 'lucide-react';

const PropertyValuation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    property_type: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    region: '',
    location: '',
    property_age: '',
    furnishing_status: '',
    amenities: [],
    floor_number: '',
    total_floors: '',
    facing_direction: '',
    parking_count: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: '🏢' },
    { value: 'independent_house', label: 'Independent House', icon: '🏠' },
    { value: 'villa', label: 'Villa', icon: '🏡' },
    { value: 'plot', label: 'Plot', icon: '📐' }
  ];

  const regions = [
    { value: 'coimbatore', label: 'Coimbatore' },
    { value: 'salem', label: 'Salem' },
    { value: 'tirupur', label: 'Tirupur' }
  ];

  const locations = {
    coimbatore: ['RS Puram', 'Saravanampatti', 'Peelamedu', 'Gandhipuram', 'Singanallur'],
    salem: ['Fairlands', 'Cherry Road', 'Gugai', 'Junction', 'Hasthampatti'],
    tirupur: ['Palladam Road', 'Kumaran Road', 'Velampalayam', 'Kangayam Road']
  };

  const amenitiesList = [
    'gym', 'swimming_pool', 'power_backup', 'lift', 'security',
    'clubhouse', 'parking', 'garden', 'play_area', 'water_supply'
  ];

  const facingDirections = [
    { value: 'north', label: 'North' },
    { value: 'south', label: 'South' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
    { value: 'north_east', label: 'North-East' },
    { value: 'north_west', label: 'North-West' },
    { value: 'south_east', label: 'South-East' },
    { value: 'south_west', label: 'South-West' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityToggle = (amenity) => {
    const amenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities });
  };

  const calculateValuation = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/valuation/calculate`,
        {
          ...formData,
          area: parseFloat(formData.area),
          bedrooms: parseInt(formData.bedrooms) || null,
          bathrooms: parseInt(formData.bathrooms) || null,
          property_age: parseInt(formData.property_age) || 0,
          floor_number: parseInt(formData.floor_number) || null,
          total_floors: parseInt(formData.total_floors) || null,
          parking_count: parseInt(formData.parking_count) || 0
        }
      );
      setResult(response.data.data);
      setStep(4);
    } catch (error) {
      console.error('Error calculating valuation:', error);
      alert('Error calculating valuation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const renderStep1 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Type & Location</h2>

      {/* Property Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Property Type</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {propertyTypes.map(type => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, property_type: type.value })}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                formData.property_type === type.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="font-medium text-sm">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Region & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Region</option>
            {regions.map(region => (
              <option key={region.value} value={region.value}>{region.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={!formData.region}
          >
            <option value="">Select Location</option>
            {formData.region && locations[formData.region]?.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!formData.property_type || !formData.region || !formData.location}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Next Step
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Layers className="inline mr-1" size={16} />
            Area (sq.ft) *
          </label>
          <input
            type="number"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 1200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline mr-1" size={16} />
            Property Age (years)
          </label>
          <input
            type="number"
            name="property_age"
            value={formData.property_age}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing Status</label>
          <select
            name="furnishing_status"
            value={formData.furnishing_status}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option value="furnished">Furnished</option>
            <option value="semi_furnished">Semi-Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Parking</label>
          <input
            type="number"
            name="parking_count"
            value={formData.parking_count}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Number of parking spaces"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!formData.area}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300"
        >
          Next Step
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Floor Number</label>
          <input
            type="number"
            name="floor_number"
            value={formData.floor_number}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors</label>
          <input
            type="number"
            name="total_floors"
            value={formData.total_floors}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 10"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Facing Direction</label>
          <div className="grid grid-cols-4 gap-2">
            {facingDirections.map(dir => (
              <button
                key={dir.value}
                type="button"
                onClick={() => setFormData({ ...formData, facing_direction: dir.value })}
                className={`p-2 border rounded-lg text-sm ${
                  formData.facing_direction === dir.value
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {dir.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Amenities (Select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {amenitiesList.map(amenity => (
            <button
              key={amenity}
              type="button"
              onClick={() => handleAmenityToggle(amenity)}
              className={`p-3 border rounded-lg text-sm capitalize ${
                formData.amenities.includes(amenity)
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {amenity.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
        >
          Back
        </button>
        <button
          onClick={calculateValuation}
          disabled={loading}
          className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300"
        >
          {loading ? 'Calculating...' : 'Get Valuation'}
        </button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div>
      <div className="text-center mb-8">
        <Award className="mx-auto text-green-600 mb-4" size={48} />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Property Valuation</h2>
        <p className="text-gray-600">Based on {result.confidence}% confidence</p>
      </div>

      {/* Main Valuation */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-8 text-white mb-8">
        <div className="text-center">
          <div className="text-sm opacity-90 mb-2">Estimated Market Value</div>
          <div className="text-5xl font-bold mb-4">
            {formatCurrency(result.estimatedValue)}
          </div>
          <div className="text-sm opacity-90">
            Price Range: {formatCurrency(result.valueRange.min)} - {formatCurrency(result.valueRange.max)}
          </div>
          <div className="text-sm opacity-90 mt-2">
            {formatCurrency(result.pricePerSqft)}/sq.ft
          </div>
        </div>
      </div>

      {/* Adjustments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Value Adjustments</h3>
          <div className="space-y-2">
            {Object.entries(result.adjustments).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className={value.startsWith('+') ? 'text-green-600 font-semibold' : value.startsWith('-') ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Rental Information</h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Expected Monthly Rent</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(result.rentalInformation.estimatedMonthlyRent)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Rental Yield</div>
              <div className="text-xl font-semibold text-green-600">
                {result.rentalInformation.rentalYield}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Appreciation */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h3 className="font-bold text-gray-900 mb-4">
          <TrendingUp className="inline mr-2" size={20} />
          Price Appreciation Forecast
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(result.appreciation).map(([period, data]) => (
            <div key={period} className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">
                {period === 'oneYear' ? '1 Year' : period === 'threeYears' ? '3 Years' : '5 Years'}
              </div>
              <div className="text-xl font-bold text-gray-900">
                {formatCurrency(data.value)}
              </div>
              <div className="text-sm text-green-600 font-semibold">{data.growth}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-blue-900 mb-2">💡 Recommendation</h3>
        <p className="text-blue-800">{result.recommendation}</p>
      </div>

      <button
        onClick={() => {
          setStep(1);
          setResult(null);
          setFormData({
            property_type: '',
            area: '',
            bedrooms: '',
            bathrooms: '',
            region: '',
            location: '',
            property_age: '',
            furnishing_status: '',
            amenities: [],
            floor_number: '',
            total_floors: '',
            facing_direction: '',
            parking_count: ''
          });
        }}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
      >
        Value Another Property
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Home className="inline-block mr-3 mb-1" size={36} />
            Property Valuation Tool
          </h1>
          <p className="text-lg text-gray-600">
            Get instant property valuation powered by AI and market data
          </p>
        </div>

        {/* Progress Indicator */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex-1 flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-blue-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Property Type</span>
              <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Details</span>
              <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Additional Info</span>
            </div>
          </div>
        )}

        {/* Form Steps */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && result && renderResults()}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-gray-900 mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <div className="font-semibold text-gray-900 mb-1">1. Property Details</div>
              <p>Provide basic information about your property</p>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">2. AI Analysis</div>
              <p>Our AI analyzes market data and comparable properties</p>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">3. Instant Results</div>
              <p>Get accurate valuation with price trends and recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyValuation;
