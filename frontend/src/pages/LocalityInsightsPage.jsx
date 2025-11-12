import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  TrendingUp,
  Shield,
  Train,
  Coffee,
  TreePine,
  Rocket,
  School,
  Hospital,
  ShoppingBag,
  Home,
  Star,
  ThumbsUp,
  ThumbsDown,
  Bus,
  Zap,
  Droplet,
  Route
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LocalityInsightsPage = () => {
  const { localityName } = useParams();
  const [locality, setLocality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocalityData();
  }, [localityName]);

  const fetchLocalityData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/localities/by-name/${encodeURIComponent(localityName)}`
      );

      if (response.data.success) {
        setLocality(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching locality data:', error);
    } finally {
      setLoading(false);
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

  const ScoreCard = ({ icon: Icon, label, score, color }) => {
    const percentage = (score / 10) * 100;
    return (
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{score}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              score >= 7 ? 'bg-green-500' : score >= 4 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!locality) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Locality Not Found</h2>
          <p className="text-gray-500 mb-6">
            We don't have information about this locality yet.
          </p>
          <button
            onClick={() => navigate('/properties')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{locality.city}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{locality.locality_name}</h1>
              {locality.description && (
                <p className="text-gray-600 max-w-3xl">{locality.description}</p>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <span className="text-3xl font-bold text-gray-900">
                  {locality.overall_rating}/10
                </span>
              </div>
              <p className="text-sm text-gray-600">Overall Rating</p>
              {locality.total_reviews > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Based on {locality.total_reviews} reviews
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Key Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <ScoreCard
            icon={Shield}
            label="Safety"
            score={locality.safety_score}
            color="text-green-600"
          />
          <ScoreCard
            icon={Train}
            label="Connectivity"
            score={locality.connectivity_score}
            color="text-blue-600"
          />
          <ScoreCard
            icon={Coffee}
            label="Lifestyle"
            score={locality.lifestyle_score}
            color="text-purple-600"
          />
          <ScoreCard
            icon={TreePine}
            label="Environment"
            score={locality.environment_score}
            color="text-green-600"
          />
          <ScoreCard
            icon={Rocket}
            label="Growth"
            score={locality.growth_potential_score}
            color="text-orange-600"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {['overview', 'connectivity', 'infrastructure', 'pricing'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium text-sm capitalize whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Demographics */}
                {locality.demographics && Object.keys(locality.demographics).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Demographics</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(locality.demographics).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {typeof value === 'boolean' && value ? key : `${key}: ${value}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pros & Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {locality.pros && locality.pros.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ThumbsUp className="w-5 h-5 text-green-600" />
                        Advantages
                      </h3>
                      <ul className="space-y-2">
                        {locality.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {locality.cons && locality.cons.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ThumbsDown className="w-5 h-5 text-red-600" />
                        Disadvantages
                      </h3>
                      <ul className="space-y-2">
                        {locality.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Social Infrastructure */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Infrastructure</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <School className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{locality.schools_count}</div>
                      <div className="text-sm text-gray-600">Schools</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Hospital className="w-8 h-8 mx-auto text-red-600 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{locality.hospitals_count}</div>
                      <div className="text-sm text-gray-600">Hospitals</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TreePine className="w-8 h-8 mx-auto text-green-600 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{locality.parks_count}</div>
                      <div className="text-sm text-gray-600">Parks</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <ShoppingBag className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{locality.malls_count}</div>
                      <div className="text-sm text-gray-600">Malls</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Coffee className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{locality.restaurants_count}</div>
                      <div className="text-sm text-gray-600">Restaurants</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Connectivity Tab */}
            {activeTab === 'connectivity' && (
              <div className="space-y-6">
                {/* Metro */}
                {locality.nearest_metro && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Train className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Nearest Metro</h3>
                    </div>
                    <p className="text-gray-700 mb-1">{locality.nearest_metro}</p>
                    {locality.metro_distance_km && (
                      <p className="text-sm text-gray-600">
                        {locality.metro_distance_km} km away
                      </p>
                    )}
                  </div>
                )}

                {/* Bus Routes */}
                {locality.bus_routes && locality.bus_routes.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Bus className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Bus Routes</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {locality.bus_routes.map((route, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded text-sm font-medium"
                        >
                          {route}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Highways */}
                {locality.highways && locality.highways.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Route className="w-6 h-6 text-orange-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Nearby Highways</h3>
                    </div>
                    <div className="space-y-2">
                      {locality.highways.map((highway, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                          <span className="text-gray-700">{highway}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Infrastructure Tab */}
            {activeTab === 'infrastructure' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Road Quality */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Route className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Road Quality</h4>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        locality.road_quality === 'excellent'
                          ? 'bg-green-100 text-green-700'
                          : locality.road_quality === 'good'
                          ? 'bg-blue-100 text-blue-700'
                          : locality.road_quality === 'average'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {locality.road_quality.charAt(0).toUpperCase() +
                        locality.road_quality.slice(1)}
                    </span>
                  </div>

                  {/* Water Supply */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplet className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Water Supply</h4>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        locality.water_supply === '24x7'
                          ? 'bg-green-100 text-green-700'
                          : locality.water_supply === 'regular'
                          ? 'bg-blue-100 text-blue-700'
                          : locality.water_supply === 'irregular'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {locality.water_supply.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Power Supply */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-semibold text-gray-900">Power Supply</h4>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        locality.power_supply === '24x7'
                          ? 'bg-green-100 text-green-700'
                          : locality.power_supply === 'regular'
                          ? 'bg-blue-100 text-blue-700'
                          : locality.power_supply === 'frequent_cuts'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {locality.power_supply.replace('_', ' ').charAt(0).toUpperCase() +
                        locality.power_supply.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                {/* Average Price */}
                {locality.avg_price_per_sqft && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Average Price per Sq.Ft
                    </h3>
                    <div className="text-3xl font-bold text-blue-600">
                      ₹{locality.avg_price_per_sqft.toLocaleString()}
                    </div>
                  </div>
                )}

                {/* Price Trends */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locality.price_trend_1yr && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">1 Year Trend</p>
                          <p
                            className={`text-2xl font-bold ${
                              parseFloat(locality.price_trend_1yr) >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {parseFloat(locality.price_trend_1yr) >= 0 ? '+' : ''}
                            {locality.price_trend_1yr}%
                          </p>
                        </div>
                        <TrendingUp
                          className={`w-8 h-8 ${
                            parseFloat(locality.price_trend_1yr) >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {locality.price_trend_3yr && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">3 Year Trend</p>
                          <p
                            className={`text-2xl font-bold ${
                              parseFloat(locality.price_trend_3yr) >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {parseFloat(locality.price_trend_3yr) >= 0 ? '+' : ''}
                            {locality.price_trend_3yr}%
                          </p>
                        </div>
                        <TrendingUp
                          className={`w-8 h-8 ${
                            parseFloat(locality.price_trend_3yr) >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Property Stats */}
                {locality.propertyStats && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Property Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Properties</p>
                        <p className="text-xl font-bold text-gray-900">
                          {locality.propertyStats.propertyCount}
                        </p>
                      </div>
                      {locality.propertyStats.minPrice > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">Min Price</p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatPrice(locality.propertyStats.minPrice)}
                          </p>
                        </div>
                      )}
                      {locality.propertyStats.maxPrice > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">Max Price</p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatPrice(locality.propertyStats.maxPrice)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* View Properties Button */}
        <div className="text-center">
          <button
            onClick={() => navigate(`/properties?locality=${locality.locality_name}`)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            <Home className="w-6 h-6" />
            View Properties in {locality.locality_name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalityInsightsPage;
