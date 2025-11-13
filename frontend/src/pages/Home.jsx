import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Home as HomeIcon,
  Building,
  TrendingUp,
  Shield,
  CheckCircle,
  Users,
  Star,
  ArrowRight,
  ChevronRight,
  Heart,
  Eye,
  Phone,
  Calculator,
  FileText,
  Award
} from 'lucide-react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [transactionType, setTransactionType] = useState('sale');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [topLocalities, setTopLocalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    verifiedProperties: 0,
    happyCustomers: 0
  });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch featured properties
      const propsResponse = await axios.get(`${API_URL}/properties?limit=6&sort=created_at&order=DESC`);
      if (propsResponse.data.success) {
        setFeaturedProperties(propsResponse.data.data);
      }

      // Fetch top localities
      try {
        const localitiesResponse = await axios.get(`${API_URL}/localities?limit=6&sortBy=overall_rating&order=DESC`);
        if (localitiesResponse.data.success) {
          setTopLocalities(localitiesResponse.data.data);
        }
      } catch (err) {
        console.log('Localities not available yet');
      }

      // Mock stats (in production, fetch from API)
      setStats({
        totalProperties: 1250,
        verifiedProperties: 850,
        happyCustomers: 3200
      });
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (propertyType) params.append('property_type', propertyType);
    if (transactionType) params.append('transaction_type', transactionType);
    navigate(`/properties?${params.toString()}`);
  };

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: Building },
    { value: 'house', label: 'House', icon: HomeIcon },
    { value: 'villa', label: 'Villa', icon: HomeIcon },
    { value: 'plot', label: 'Plot', icon: MapPin }
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: '100% Verified',
      description: 'All properties are verified by our expert team'
    },
    {
      icon: Users,
      title: '3000+ Happy Customers',
      description: 'Join thousands of satisfied property owners'
    },
    {
      icon: Award,
      title: 'Best Prices',
      description: 'Get the best deals in the market'
    },
    {
      icon: CheckCircle,
      title: 'Legal Assistance',
      description: 'Complete legal support throughout the process'
    }
  ];

  const services = [
    {
      icon: Calculator,
      title: 'EMI Calculator',
      description: 'Calculate your home loan EMI instantly',
      color: 'bg-blue-500',
      path: '/calculators'
    },
    {
      icon: FileText,
      title: 'Legal Services',
      description: 'Documentation and legal assistance',
      color: 'bg-green-500',
      path: '/services/legal'
    },
    {
      icon: TrendingUp,
      title: 'Property Valuation',
      description: 'Get accurate property valuations',
      color: 'bg-purple-500',
      path: '/valuation'
    },
    {
      icon: Phone,
      title: 'Site Visit',
      description: 'Schedule free property visits',
      color: 'bg-orange-500',
      path: '/properties'
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Search */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Find Your Dream Home
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Search from 1000+ verified properties across India
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-2xl p-4 md:p-6">
              {/* Transaction Type Tabs */}
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setTransactionType('sale')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    transactionType === 'sale'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTransactionType('rent')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    transactionType === 'rent'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Rent
                </button>
              </div>

              {/* Search Input */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by locality, city, or property name..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>

              {/* Property Type Quick Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {propertyTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setPropertyType(propertyType === type.value ? '' : type.value)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        propertyType === type.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalProperties}+</div>
              <div className="text-gray-600">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.verifiedProperties}+</div>
              <div className="text-gray-600">Verified Properties</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.happyCustomers}+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Properties</h2>
              <p className="text-gray-600">Hand-picked properties for you</p>
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} viewMode="grid" />
            ))}
          </div>
        </div>
      )}

      {/* Top Localities */}
      {topLocalities.length > 0 && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Localities</h2>
              <p className="text-gray-600">Explore properties in premium locations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topLocalities.map((locality) => (
                <div
                  key={locality.id}
                  onClick={() => navigate(`/localities/${locality.locality_name}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {locality.locality_name}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {locality.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-bold text-gray-900">{locality.overall_rating}</span>
                      </div>
                    </div>

                    {locality.avg_price_per_sqft && (
                      <div className="text-sm text-gray-600 mb-3">
                        Avg: ₹{locality.avg_price_per_sqft.toLocaleString()}/sq.ft
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      {locality.schools_count > 0 && (
                        <span>{locality.schools_count} Schools</span>
                      )}
                      {locality.hospitals_count > 0 && (
                        <span>{locality.hospitals_count} Hospitals</span>
                      )}
                    </div>

                    <button className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                      Explore
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Us */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose Us?</h2>
          <p className="text-gray-600">Your trusted partner in real estate</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h2>
            <p className="text-gray-600">Everything you need for your property journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  onClick={() => navigate(service.path)}
                  className="bg-white rounded-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${service.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button className="flex items-center gap-2 text-blue-600 font-medium">
                    Learn More
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect home with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/properties')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              Browse Properties
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg"
            >
              List Your Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
