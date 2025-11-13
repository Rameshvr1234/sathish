import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Crown, Calendar, TrendingUp, Home, Star, BarChart3, AlertCircle, CheckCircle, X } from 'lucide-react';

const MembershipDashboard = () => {
  const navigate = useNavigate();
  const [membership, setMembership] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMembership();
    fetchUsage();
  }, []);

  const fetchMembership = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/membership/my-membership`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembership(response.data.data);
    } catch (error) {
      console.error('Error fetching membership:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/membership/usage`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsage(response.data.data);
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setCancelling(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/membership/cancel`,
        { reason: cancelReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Subscription cancelled successfully. Your plan will remain active until the end of the billing period.');
      setShowCancelModal(false);
      fetchMembership();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert(error.response?.data?.message || 'Error cancelling subscription');
    } finally {
      setCancelling(false);
    }
  };

  const handleRenewSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/membership/renew`,
        { payment_id: `renew_${Date.now()}` }, // Mock payment ID
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Subscription renewed successfully!');
      fetchMembership();
      fetchUsage();
    } catch (error) {
      console.error('Error renewing subscription:', error);
      alert(error.response?.data?.message || 'Error renewing subscription');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPlanBadge = (planType) => {
    const badges = {
      basic: { color: 'bg-blue-100 text-blue-800', icon: <Star size={16} /> },
      pro: { color: 'bg-purple-100 text-purple-800', icon: <TrendingUp size={16} /> },
      enterprise: { color: 'bg-yellow-100 text-yellow-800', icon: <Crown size={16} /> }
    };
    return badges[planType] || badges.basic;
  };

  const getUsageColor = (used, limit) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <AlertCircle size={64} className="mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Membership</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to a plan to unlock premium features and grow your property business
            </p>
            <button
              onClick={() => navigate('/membership/plans')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
            >
              View Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  const planBadge = getPlanBadge(membership.plan_type);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <Crown className="inline-block mr-3 mb-1 text-yellow-500" size={36} />
            My Membership
          </h1>
          <p className="text-lg text-gray-600">Manage your subscription and track usage</p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className={`inline-flex items-center gap-2 ${planBadge.color} px-4 py-2 rounded-full text-sm font-semibold mb-4`}>
                {planBadge.icon}
                {membership.plan_name}
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {formatPrice(membership.amount)} / {membership.billing_cycle}
              </h2>
              <p className="text-white/90">
                Status: <span className="font-semibold">{membership.status}</span>
              </p>
            </div>

            <div className="mt-6 md:mt-0 text-center md:text-right">
              <div className="text-sm text-white/80 mb-1">Valid Until</div>
              <div className="text-2xl font-bold mb-1">{formatDate(membership.end_date)}</div>
              {usage && (
                <div className="text-sm text-white/80">
                  {usage.daysRemaining} days remaining
                </div>
              )}
            </div>
          </div>

          {/* Auto Renewal */}
          <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {membership.auto_renewal ? (
                <CheckCircle size={20} className="text-green-300" />
              ) : (
                <X size={20} className="text-red-300" />
              )}
              <span>Auto-renewal: {membership.auto_renewal ? 'Enabled' : 'Disabled'}</span>
            </div>

            {membership.status === 'active' && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
              >
                Cancel Subscription
              </button>
            )}

            {membership.status === 'expired' && (
              <button
                onClick={handleRenewSubscription}
                className="px-4 py-2 bg-white text-blue-600 hover:bg-white/90 rounded-lg font-medium transition-colors"
              >
                Renew Subscription
              </button>
            )}
          </div>
        </div>

        {/* Usage Statistics */}
        {usage && usage.hasMembership && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Property Listings Usage */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Home className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Property Listings</h3>
                    <p className="text-sm text-gray-600">
                      {usage.properties.used} of {usage.properties.limit} used
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full transition-all ${getUsageColor(
                    usage.properties.used,
                    usage.properties.limit
                  )}`}
                  style={{
                    width: `${Math.min((usage.properties.used / usage.properties.limit) * 100, 100)}%`
                  }}
                ></div>
              </div>

              <p className="text-sm text-gray-600">
                {usage.properties.remaining} listings remaining
              </p>
            </div>

            {/* Featured Listings Usage */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Star className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Featured Listings</h3>
                    <p className="text-sm text-gray-600">
                      {usage.featuredListings.used} of {usage.featuredListings.limit} used
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full transition-all ${getUsageColor(
                    usage.featuredListings.used,
                    usage.featuredListings.limit
                  )}`}
                  style={{
                    width: `${Math.min(
                      (usage.featuredListings.used / usage.featuredListings.limit) * 100,
                      100
                    )}%`
                  }}
                ></div>
              </div>

              <p className="text-sm text-gray-600">
                {usage.featuredListings.remaining} featured slots remaining
              </p>
            </div>
          </div>
        )}

        {/* Features Included */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Plan Includes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {membership.lead_access && (
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Lead Access</h3>
                  <p className="text-sm text-gray-600">Get buyer inquiries directly</p>
                </div>
              </div>
            )}

            {membership.analytics_access && (
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Analytics Dashboard</h3>
                  <p className="text-sm text-gray-600">Track views and performance</p>
                </div>
              </div>
            )}

            {membership.priority_support && (
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Priority Support</h3>
                  <p className="text-sm text-gray-600">Get faster response times</p>
                </div>
              </div>
            )}

            {membership.zero_brokerage && (
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Zero Brokerage</h3>
                  <p className="text-sm text-gray-600">Direct owner contact access</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-gray-900">Property Listings</h3>
                <p className="text-sm text-gray-600">Up to {membership.property_limit} listings</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-gray-900">Featured Listings</h3>
                <p className="text-sm text-gray-600">
                  {membership.featured_listing_limit} premium placements
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Section */}
        {membership.plan_type !== 'enterprise' && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Want more features?
                </h3>
                <p className="text-gray-600">
                  Upgrade to a higher plan and unlock additional benefits
                </p>
              </div>
              <button
                onClick={() => navigate('/membership/plans')}
                className="mt-4 md:mt-0 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                View Plans
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Subscription</h3>

            <p className="text-gray-600 mb-4">
              We're sorry to see you go. Your plan will remain active until{' '}
              {formatDate(membership.end_date)}.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please tell us why you're cancelling (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your feedback helps us improve..."
              ></textarea>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Keep Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipDashboard;
