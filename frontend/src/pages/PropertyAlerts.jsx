import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell, Plus, Edit2, Trash2, Eye, ToggleLeft, ToggleRight, MapPin, Home, IndianRupee, AlertCircle } from 'lucide-react';

const PropertyAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [matchingProperties, setMatchingProperties] = useState({});

  // Alert form state
  const [alertForm, setAlertForm] = useState({
    alert_name: '',
    property_type: [],
    listing_type: 'any',
    min_price: '',
    max_price: '',
    min_bedrooms: '',
    max_bedrooms: '',
    regions: [],
    locations: [],
    amenities: [],
    frequency: 'daily',
    email_notification: true,
    push_notification: true
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchingProperties = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/alerts/${alertId}/matches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatchingProperties((prev) => ({
        ...prev,
        [alertId]: response.data.data || []
      }));
    } catch (error) {
      console.error('Error fetching matching properties:', error);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const endpoint = editingAlert
        ? `${import.meta.env.VITE_API_URL}/alerts/${editingAlert.id}`
        : `${import.meta.env.VITE_API_URL}/alerts`;

      const method = editingAlert ? 'put' : 'post';

      await axios[method](endpoint, alertForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(editingAlert ? 'Alert updated successfully!' : 'Alert created successfully!');
      setShowCreateModal(false);
      setEditingAlert(null);
      resetForm();
      fetchAlerts();
    } catch (error) {
      console.error('Error saving alert:', error);
      alert(error.response?.data?.message || 'Error saving alert');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAlert = async (alertId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/alerts/${alertId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, is_active: !currentStatus } : alert
      ));
    } catch (error) {
      console.error('Error toggling alert:', error);
      alert('Error updating alert status');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/alerts/${alertId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Alert deleted successfully!');
      fetchAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
      alert('Error deleting alert');
    }
  };

  const handleEditAlert = (alert) => {
    setEditingAlert(alert);
    setAlertForm({
      alert_name: alert.alert_name || '',
      property_type: alert.property_type || [],
      listing_type: alert.listing_type || 'any',
      min_price: alert.min_price || '',
      max_price: alert.max_price || '',
      min_bedrooms: alert.min_bedrooms || '',
      max_bedrooms: alert.max_bedrooms || '',
      regions: alert.regions || [],
      locations: alert.locations || [],
      amenities: alert.amenities || [],
      frequency: alert.frequency || 'daily',
      email_notification: alert.email_notification !== false,
      push_notification: alert.push_notification !== false
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setAlertForm({
      alert_name: '',
      property_type: [],
      listing_type: 'any',
      min_price: '',
      max_price: '',
      min_bedrooms: '',
      max_bedrooms: '',
      regions: [],
      locations: [],
      amenities: [],
      frequency: 'daily',
      email_notification: true,
      push_notification: true
    });
  };

  const toggleArrayItem = (field, value) => {
    setAlertForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value]
    }));
  };

  const formatCurrency = (amount) => {
    if (!amount) return '';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatPropertyType = (types) => {
    if (!types || types.length === 0) return 'All types';
    return types.map(type => type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')).join(', ');
  };

  const propertyTypes = ['apartment', 'villa', 'independent_house', 'plot', 'builder_floor', 'studio_apartment'];
  const availableRegions = ['North Chennai', 'South Chennai', 'Central Chennai', 'West Chennai', 'East Chennai'];
  const availableAmenities = ['parking', 'gym', 'swimming_pool', 'security', 'power_backup', 'lift', 'garden', 'club_house'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <Bell className="inline-block mr-3 mb-1" size={36} />
              Property Alerts
            </h1>
            <p className="text-lg text-gray-600">
              Get notified when properties matching your criteria are listed
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setEditingAlert(null);
              setShowCreateModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <Plus size={20} />
            Create Alert
          </button>
        </div>

        {/* Alerts List */}
        {alerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Bell size={64} className="mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Alerts Yet</h2>
            <p className="text-gray-600 mb-8">
              Create your first alert to get notified about properties matching your search criteria
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
            >
              Create Your First Alert
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  !alert.is_active ? 'opacity-60' : ''
                }`}
              >
                {/* Alert Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{alert.alert_name || 'Untitled Alert'}</h3>
                    <button
                      onClick={() => handleToggleAlert(alert.id, alert.is_active)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {alert.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </div>
                  <p className="text-sm text-white/80 mt-1">
                    {alert.is_active ? 'Active' : 'Paused'} • {alert.frequency} notifications
                  </p>
                </div>

                {/* Alert Details */}
                <div className="p-6">
                  {/* Property Type */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Home size={16} className="mr-2" />
                      Property Type
                    </div>
                    <div className="text-gray-900">{formatPropertyType(alert.property_type)}</div>
                  </div>

                  {/* Price Range */}
                  {(alert.min_price || alert.max_price) && (
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <IndianRupee size={16} className="mr-2" />
                        Price Range
                      </div>
                      <div className="text-gray-900">
                        {alert.min_price ? formatCurrency(alert.min_price) : 'Any'} -{' '}
                        {alert.max_price ? formatCurrency(alert.max_price) : 'Any'}
                      </div>
                    </div>
                  )}

                  {/* Bedrooms */}
                  {(alert.min_bedrooms || alert.max_bedrooms) && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">Bedrooms</div>
                      <div className="text-gray-900">
                        {alert.min_bedrooms || 'Any'} - {alert.max_bedrooms || 'Any'}
                      </div>
                    </div>
                  )}

                  {/* Regions */}
                  {alert.regions && alert.regions.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin size={16} className="mr-2" />
                        Regions
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {alert.regions.map((region, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  {alert.amenities && alert.amenities.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">Required Amenities</div>
                      <div className="flex flex-wrap gap-2">
                        {alert.amenities.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                          >
                            {amenity.replace('_', ' ')}
                          </span>
                        ))}
                        {alert.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{alert.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Matching Properties Count */}
                  <div className="pt-4 border-t">
                    {!matchingProperties[alert.id] ? (
                      <button
                        onClick={() => fetchMatchingProperties(alert.id)}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                      >
                        <Eye size={16} />
                        View Matching Properties
                      </button>
                    ) : (
                      <div className="text-gray-900">
                        <span className="font-semibold">{matchingProperties[alert.id].length}</span>{' '}
                        matching {matchingProperties[alert.id].length === 1 ? 'property' : 'properties'} found
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <button
                      onClick={() => handleEditAlert(alert)}
                      className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingAlert ? 'Edit Alert' : 'Create New Alert'}
            </h3>

            <form onSubmit={handleCreateAlert} className="space-y-6">
              {/* Alert Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Name *
                </label>
                <input
                  type="text"
                  value={alertForm.alert_name}
                  onChange={(e) => setAlertForm({ ...alertForm, alert_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 3 BHK in North Chennai"
                  required
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {propertyTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleArrayItem('property_type', type)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        alertForm.property_type.includes(type)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={alertForm.min_price}
                    onChange={(e) => setAlertForm({ ...alertForm, min_price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="₹"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={alertForm.max_price}
                    onChange={(e) => setAlertForm({ ...alertForm, max_price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="₹"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Bedrooms
                  </label>
                  <input
                    type="number"
                    value={alertForm.min_bedrooms}
                    onChange={(e) => setAlertForm({ ...alertForm, min_bedrooms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Bedrooms
                  </label>
                  <input
                    type="number"
                    value={alertForm.max_bedrooms}
                    onChange={(e) => setAlertForm({ ...alertForm, max_bedrooms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Regions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Regions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableRegions.map((region) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => toggleArrayItem('regions', region)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        alertForm.regions.includes(region)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleArrayItem('amenities', amenity)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        alertForm.amenities.includes(amenity)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {amenity.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Frequency
                </label>
                <select
                  value={alertForm.frequency}
                  onChange={(e) => setAlertForm({ ...alertForm, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={alertForm.email_notification}
                    onChange={(e) => setAlertForm({ ...alertForm, email_notification: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={alertForm.push_notification}
                    onChange={(e) => setAlertForm({ ...alertForm, push_notification: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Push notifications</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingAlert ? 'Update Alert' : 'Create Alert'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingAlert(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyAlerts;
