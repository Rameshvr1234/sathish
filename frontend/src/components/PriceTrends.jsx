import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, MapPin, Home, Calendar } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PriceTrends = ({ localityName, propertyId, propertyType }) => {
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('12');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrendData();
  }, [localityName, propertyId, timeRange]);

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (propertyId) {
        // Get trends for specific property
        response = await axios.get(`${API_URL}/price-trends/property/${propertyId}`);
      } else if (localityName) {
        // Get trends for locality
        const params = new URLSearchParams();
        params.append('timeRange', timeRange);
        if (propertyType) params.append('propertyType', propertyType);

        response = await axios.get(
          `${API_URL}/price-trends/locality/${encodeURIComponent(localityName)}?${params}`
        );
      }

      if (response?.data?.success) {
        setTrendData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching price trends:', err);
      setError('Unable to load price trends');
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

  const getTrendIcon = (value) => {
    const num = parseFloat(value);
    if (num > 0) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (num < 0) return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  const getTrendColor = (value) => {
    const num = parseFloat(value);
    if (num > 0) return 'text-green-600';
    if (num < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trendData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500 py-8">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{error || 'No trend data available'}</p>
        </div>
      </div>
    );
  }

  // For Property-specific trends
  if (propertyId && trendData.property) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Price Analysis</h3>
          <Home className="w-6 h-6 text-blue-600" />
        </div>

        {/* Property Price */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">This Property</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(trendData.property.price)}
            </span>
            {trendData.property.pricePerSqft > 0 && (
              <span className="text-sm text-gray-600">
                ₹{trendData.property.pricePerSqft}/sq.ft
              </span>
            )}
          </div>
        </div>

        {/* Area Average */}
        {trendData.areaAverage && (
          <div className="space-y-4">
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-2">Area Average</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Avg Price/sq.ft</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₹{trendData.areaAverage.avgPricePerSqft.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Similar Properties</p>
                  <p className="text-xl font-bold text-gray-900">
                    {trendData.areaAverage.sampleSize}
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className={`p-4 rounded-lg border-2 ${
              trendData.areaAverage.status === 'above average'
                ? 'bg-orange-50 border-orange-200'
                : trendData.areaAverage.status === 'below average'
                ? 'bg-green-50 border-green-200'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Price Comparison
                  </p>
                  <p className="text-lg font-bold text-gray-900 capitalize">
                    {trendData.areaAverage.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    parseFloat(trendData.areaAverage.priceComparison) > 0
                      ? 'text-orange-600'
                      : 'text-green-600'
                  }`}>
                    {trendData.areaAverage.priceComparison}
                  </p>
                  <p className="text-xs text-gray-600">vs area average</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // For Locality trends
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Price Trends</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('6')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              timeRange === '6'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            6M
          </button>
          <button
            onClick={() => setTimeRange('12')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              timeRange === '12'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            1Y
          </button>
          <button
            onClick={() => setTimeRange('24')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              timeRange === '24'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            2Y
          </button>
        </div>
      </div>

      {/* Current Stats */}
      {trendData.statistics && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Avg Price/sq.ft</p>
            <p className="text-xl font-bold text-blue-600">
              ₹{trendData.statistics.currentAvgPricePerSqft.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Properties</p>
            <p className="text-xl font-bold text-gray-900">
              {trendData.statistics.totalProperties}
            </p>
          </div>
          {trendData.statistics.priceChange1yr && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">1Y Change</p>
              <div className="flex items-center gap-1">
                {getTrendIcon(trendData.statistics.priceChange1yr)}
                <p className={`text-xl font-bold ${getTrendColor(trendData.statistics.priceChange1yr)}`}>
                  {parseFloat(trendData.statistics.priceChange1yr) >= 0 ? '+' : ''}
                  {trendData.statistics.priceChange1yr}%
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Price Trend Chart (Simple Bar Chart) */}
      {trendData.trendData && trendData.trendData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Price History
          </h4>
          <div className="space-y-2">
            {trendData.trendData.slice(-6).map((item, index) => {
              const maxPrice = Math.max(...trendData.trendData.map(d => d.avgPricePerSqft));
              const percentage = (item.avgPricePerSqft / maxPrice) * 100;

              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-16">{item.month}</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end px-2"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          ₹{item.avgPricePerSqft.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {item.totalListings}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Month</span>
            <span>Price per sq.ft</span>
            <span>Listings</span>
          </div>
        </div>
      )}

      {/* Property Type Distribution */}
      {trendData.propertyTypeDistribution && Object.keys(trendData.propertyTypeDistribution).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Property Type Distribution</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(trendData.propertyTypeDistribution).map(([type, count]) => (
              <div
                key={type}
                className="px-3 py-2 bg-blue-50 rounded-lg"
              >
                <span className="text-xs font-medium text-blue-700">
                  {type}: {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      {trendData.statistics && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-gray-600 mb-1">Min Price</p>
              <p className="font-bold text-gray-900">
                {formatPrice(trendData.statistics.minPrice)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-1">Range</p>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded"></div>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-1">Max Price</p>
              <p className="font-bold text-gray-900">
                {formatPrice(trendData.statistics.maxPrice)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceTrends;
