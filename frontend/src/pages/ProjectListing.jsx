import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, MapPin, Calendar, TrendingUp, CheckCircle, Home, IndianRupee, Sparkles, Search } from 'lucide-react';

const ProjectListing = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('all'); // all, new_launches, featured

  useEffect(() => {
    if (activeTab === 'new_launches') {
      fetchNewLaunches();
    } else if (activeTab === 'featured') {
      fetchFeaturedProjects();
    } else {
      fetchProjects();
    }
  }, [searchQuery, filterStatus, filterType, sortBy, currentPage, activeTab]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy
      };

      if (searchQuery) params.search = searchQuery;
      if (filterStatus !== 'all') params.construction_status = filterStatus;
      if (filterType !== 'all') params.property_type = filterType;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, { params });
      setProjects(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewLaunches = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/new-launches/list`);
      setProjects(response.data.data || []);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching new launches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/featured/list`);
      setProjects(response.data.data || []);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Price on Request';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    const colors = {
      new_launch: 'bg-green-100 text-green-800',
      under_construction: 'bg-blue-100 text-blue-800',
      nearing_completion: 'bg-orange-100 text-orange-800',
      ready_to_move: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const calculateAvailability = (total, available) => {
    if (!total || !available) return 0;
    return ((available / total) * 100).toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <Building className="inline-block mr-3 mb-1" size={36} />
            Under Construction Projects
          </h1>
          <p className="text-lg text-gray-600">
            Browse new launches and ongoing residential projects
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md p-2 mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 md:flex-initial px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Building className="inline mr-2" size={18} />
            All Projects
          </button>
          <button
            onClick={() => setActiveTab('new_launches')}
            className={`flex-1 md:flex-initial px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'new_launches'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="inline mr-2" size={18} />
            New Launches
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`flex-1 md:flex-initial px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'featured'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="inline mr-2" size={18} />
            Featured
          </button>
        </div>

        {/* Search and Filters */}
        {activeTab === 'all' && (
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
                    placeholder="Search projects by name or location..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Construction Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="new_launch">New Launch</option>
                  <option value="under_construction">Under Construction</option>
                  <option value="nearing_completion">Nearing Completion</option>
                  <option value="ready_to_move">Ready to Move</option>
                </select>
              </div>

              {/* Property Type Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="independent_house">Independent House</option>
                  <option value="plot">Plot</option>
                </select>
              </div>
            </div>

            {/* Sort */}
            <div className="mt-4 flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'price_low', label: 'Price: Low to High' },
                  { value: 'price_high', label: 'Price: High to Low' },
                  { value: 'possession', label: 'Possession Date' }
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
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Building size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No projects found</p>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  {/* Project Image */}
                  <div className="relative h-56 bg-gray-200">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt={project.project_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Building size={64} className="text-gray-400" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.construction_status)}`}>
                      {formatStatus(project.construction_status)}
                    </div>

                    {/* RERA Badge */}
                    {project.rera_verified && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle size={12} />
                        RERA
                      </div>
                    )}

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute bottom-3 right-3 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {project.project_name}
                    </h3>

                    {/* Builder Name */}
                    {project.builder && (
                      <p className="text-sm text-blue-600 font-medium mb-2">
                        by {project.builder.company_name}
                      </p>
                    )}

                    {/* Location */}
                    <p className="text-sm text-gray-600 flex items-center mb-3">
                      <MapPin size={16} className="mr-1" />
                      {project.location}, {project.region}
                    </p>

                    {/* Price Range */}
                    <div className="mb-4 pb-4 border-b">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Price Range</span>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(project.starting_price)}
                          </div>
                          {project.max_price && (
                            <div className="text-xs text-gray-500">
                              to {formatCurrency(project.max_price)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Unit Availability */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Units Available</span>
                        <span className="font-semibold text-gray-900">
                          {project.available_units || 0} of {project.total_units || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            calculateAvailability(project.total_units, project.available_units) > 50
                              ? 'bg-green-500'
                              : calculateAvailability(project.total_units, project.available_units) > 20
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{
                            width: `${calculateAvailability(project.total_units, project.available_units)}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Construction Progress */}
                    {project.completion_percentage !== null && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Construction Progress</span>
                          <span className="font-semibold text-gray-900">
                            {project.completion_percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${project.completion_percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Possession Date */}
                    {project.possession_date && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <Calendar size={16} className="mr-2 text-purple-500" />
                        Possession by {formatDate(project.possession_date)}
                      </div>
                    )}

                    {/* Configurations */}
                    {project.configurations && project.configurations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.configurations.map((config, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            <Home size={12} className="mr-1" />
                            {config}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* View Details Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project.id}`);
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && activeTab === 'all' && (
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
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why Buy Under Construction?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <IndianRupee className="text-green-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900 mb-1">Lower Prices</h3>
              <p className="text-sm text-gray-700">
                Get better prices compared to ready-to-move properties
              </p>
            </div>
            <div>
              <Calendar className="text-blue-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900 mb-1">Payment Plans</h3>
              <p className="text-sm text-gray-700">
                Flexible payment schedules linked to construction milestones
              </p>
            </div>
            <div>
              <TrendingUp className="text-purple-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900 mb-1">Appreciation</h3>
              <p className="text-sm text-gray-700">
                Benefit from property value appreciation during construction
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectListing;
