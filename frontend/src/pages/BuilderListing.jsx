import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, MapPin, Star, CheckCircle, Building, Award, TrendingUp, Search, Filter } from 'lucide-react';

const BuilderListing = () => {
  const navigate = useNavigate();
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVerified, setFilterVerified] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBuilders();
  }, [searchQuery, filterStatus, filterVerified, sortBy, currentPage]);

  const fetchBuilders = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy
      };

      if (searchQuery) params.search = searchQuery;
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterVerified === 'verified') params.rera_verified = true;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/builders`, { params });
      setBuilders(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching builders:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const formatEstablished = (year) => {
    if (!year) return 'N/A';
    const yearsInBusiness = new Date().getFullYear() - year;
    return `${year} (${yearsInBusiness} years)`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <Building2 className="inline-block mr-3 mb-1" size={36} />
            Builders & Developers
          </h1>
          <p className="text-lg text-gray-600">
            Browse verified builders and their projects
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search builders by name or location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Verification Filter */}
            <div>
              <select
                value={filterVerified}
                onChange={(e) => setFilterVerified(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Builders</option>
                <option value="verified">RERA Verified Only</option>
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="mt-4 flex items-center gap-4">
            <Filter size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="flex gap-2">
              {[
                { value: 'rating', label: 'Highest Rated' },
                { value: 'projects', label: 'Most Projects' },
                { value: 'newest', label: 'Newest First' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Builders Grid */}
        {!loading && builders.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No builders found</p>
          </div>
        )}

        {!loading && builders.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {builders.map((builder) => (
                <div
                  key={builder.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/builders/${builder.id}`)}
                >
                  {/* Builder Logo/Header */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600">
                    {builder.logo_url ? (
                      <img
                        src={builder.logo_url}
                        alt={builder.company_name}
                        className="w-full h-full object-contain p-6"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Building2 size={64} className="text-white opacity-50" />
                      </div>
                    )}

                    {/* RERA Verified Badge */}
                    {builder.rera_verified && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle size={14} />
                        RERA Verified
                      </div>
                    )}
                  </div>

                  {/* Builder Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {builder.company_name}
                    </h3>

                    {/* Rating */}
                    {builder.average_rating > 0 && (
                      <div className="mb-3">
                        {renderStars(builder.average_rating)}
                      </div>
                    )}

                    {/* Location */}
                    {builder.city && (
                      <p className="text-sm text-gray-600 flex items-center mb-3">
                        <MapPin size={16} className="mr-1" />
                        {builder.city}{builder.state && `, ${builder.state}`}
                      </p>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {builder.total_projects || 0}
                        </div>
                        <div className="text-xs text-gray-600">Total Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {builder.ongoing_projects || 0}
                        </div>
                        <div className="text-xs text-gray-600">Ongoing</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {builder.completed_projects || 0}
                        </div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                    </div>

                    {/* Established Year */}
                    {builder.established_year && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Award size={16} className="mr-2 text-yellow-500" />
                        Established: {formatEstablished(builder.established_year)}
                      </div>
                    )}

                    {/* Experience */}
                    {builder.experience_years && (
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <TrendingUp size={16} className="mr-2 text-blue-500" />
                        {builder.experience_years}+ years of experience
                      </div>
                    )}

                    {/* Specializations */}
                    {builder.specializations && builder.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {builder.specializations.slice(0, 3).map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                        {builder.specializations.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{builder.specializations.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {builder.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {builder.description}
                      </p>
                    )}

                    {/* View Details Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/builders/${builder.id}`);
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                      View Details & Projects
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, idx) => {
                    const page = idx + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Why Choose Verified Builders?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <CheckCircle className="text-green-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900 mb-1">RERA Verified</h3>
              <p className="text-sm text-gray-700">
                All verified builders are registered with RERA and comply with regulations
              </p>
            </div>
            <div>
              <Award className="text-yellow-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900 mb-1">Quality Assured</h3>
              <p className="text-sm text-gray-700">
                Track record of delivering quality projects on time
              </p>
            </div>
            <div>
              <Building className="text-blue-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900 mb-1">Transparent Deals</h3>
              <p className="text-sm text-gray-700">
                Clear documentation and transparent pricing for all projects
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderListing;
