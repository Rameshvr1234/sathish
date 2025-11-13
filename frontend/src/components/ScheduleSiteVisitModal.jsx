import { useState } from 'react';
import { X, Calendar, Clock, Phone, Mail, User, MapPin, MessageSquare } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ScheduleSiteVisitModal = ({ isOpen, onClose, property }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: 'morning',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to schedule a site visit');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/leads`,
        {
          property_id: property.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          lead_type: 'site_visit',
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            preferredDate: '',
            preferredTime: 'morning',
            message: ''
          });
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule site visit');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Schedule Site Visit</h2>
            <p className="text-sm text-gray-600 mt-1">
              Book your visit to see this property
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Property Info */}
        {property && (
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <div className="flex gap-4">
              {property.images?.[0]?.image_url && (
                <img
                  src={property.images[0].image_url}
                  alt={property.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                  {property.title}
                </h3>
                <div className="flex items-start gap-1 text-sm text-gray-600 mb-1">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="truncate">
                    {property.locality}, {property.city}
                  </span>
                </div>
                <p className="text-lg font-bold text-blue-600">
                  {property.price >= 10000000
                    ? `₹${(property.price / 10000000).toFixed(2)} Cr`
                    : property.price >= 100000
                    ? `₹${(property.price / 100000).toFixed(2)} Lac`
                    : `₹${property.price.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✓ Site visit scheduled successfully! We'll contact you shortly.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10-digit mobile number"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send you visit confirmation on this number
            </p>
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Preferred Date *
            </label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              min={minDate}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Preferred Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Preferred Time *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'morning', label: 'Morning', time: '9 AM - 12 PM' },
                { value: 'afternoon', label: 'Afternoon', time: '12 PM - 4 PM' },
                { value: 'evening', label: 'Evening', time: '4 PM - 7 PM' }
              ].map((slot) => (
                <label
                  key={slot.value}
                  className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.preferredTime === slot.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredTime"
                    value={slot.value}
                    checked={formData.preferredTime === slot.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="font-semibold text-gray-900 mb-1">{slot.label}</span>
                  <span className="text-xs text-gray-600">{slot.time}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Additional Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Any specific requirements or questions..."
            />
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Our representative will call you to confirm the visit timing.
              Please keep your phone accessible.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Scheduling...' : success ? 'Scheduled!' : 'Schedule Visit'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Footer Info */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-gray-600">
            <div>
              <div className="text-2xl mb-1">🔒</div>
              <p className="font-medium text-gray-900">100% Safe</p>
              <p>Your data is secure</p>
            </div>
            <div>
              <div className="text-2xl mb-1">✓</div>
              <p className="font-medium text-gray-900">Verified Properties</p>
              <p>Only genuine listings</p>
            </div>
            <div>
              <div className="text-2xl mb-1">📞</div>
              <p className="font-medium text-gray-900">24/7 Support</p>
              <p>We're here to help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSiteVisitModal;
