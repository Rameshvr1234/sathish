import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Crown, Check, X, Star, TrendingUp, Zap, Shield } from 'lucide-react';

const MembershipPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [currentMembership, setCurrentMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('yearly'); // monthly, quarterly, yearly
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchCurrentMembership();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/membership/plans`);
      setPlans(response.data.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentMembership = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/membership/my-membership`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentMembership(response.data.data);
    } catch (error) {
      console.error('Error fetching current membership:', error);
    }
  };

  const handleSubscribe = async (planId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to subscribe');
      navigate('/login');
      return;
    }

    if (currentMembership) {
      alert('You already have an active membership. Please cancel it first to subscribe to a new plan.');
      navigate('/membership/dashboard');
      return;
    }

    setSubscribing(true);
    try {
      // In a real app, integrate with Razorpay here
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/membership/subscribe`,
        {
          plan_type: planId,
          billing_cycle: billingCycle,
          payment_id: `test_payment_${Date.now()}` // Mock payment ID
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Subscription successful!');
      navigate('/membership/dashboard');
    } catch (error) {
      console.error('Error subscribing:', error);
      alert(error.response?.data?.message || 'Error subscribing to plan');
    } finally {
      setSubscribing(false);
    }
  };

  const getPlanIcon = (planId) => {
    const icons = {
      basic: <Star className="text-blue-500" size={48} />,
      pro: <Zap className="text-purple-500" size={48} />,
      enterprise: <Crown className="text-yellow-500" size={48} />
    };
    return icons[planId] || <Shield size={48} />;
  };

  const getPlanColor = (planId) => {
    const colors = {
      basic: 'from-blue-500 to-blue-600',
      pro: 'from-purple-500 to-purple-600',
      enterprise: 'from-yellow-500 to-yellow-600'
    };
    return colors[planId] || 'from-gray-500 to-gray-600';
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSavingsPercentage = (plan) => {
    if (billingCycle === 'monthly') return 0;
    if (billingCycle === 'quarterly') {
      const monthlyTotal = plan.monthly * 3;
      return Math.round(((monthlyTotal - plan.quarterly) / monthlyTotal) * 100);
    }
    if (billingCycle === 'yearly') {
      const monthlyTotal = plan.monthly * 12;
      return Math.round(((monthlyTotal - plan.yearly) / monthlyTotal) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            <Crown className="inline-block mr-3 mb-2 text-yellow-500" size={48} />
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Unlock premium features and grow your property business
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            {[
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly', badge: 'Save 15%' },
              { value: 'yearly', label: 'Yearly', badge: 'Save 25%' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setBillingCycle(option.value)}
                className={`relative px-6 py-3 rounded-lg font-medium transition-all ${
                  billingCycle === option.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
                {option.badge && billingCycle !== option.value && (
                  <span className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    {option.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const savings = getSavingsPercentage(plan);
            const price = plan[billingCycle];

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-purple-500' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div className={`bg-gradient-to-r ${getPlanColor(plan.id)} p-8 text-white`}>
                  <div className="flex justify-center mb-4">
                    {getPlanIcon(plan.id)}
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
                  <p className="text-center text-white/90 text-sm mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-5xl font-bold">{formatPrice(price)}</span>
                    </div>
                    <p className="text-white/80 text-sm mt-2">
                      per {billingCycle === 'monthly' ? 'month' : billingCycle === 'quarterly' ? 'quarter' : 'year'}
                    </p>
                    {savings > 0 && (
                      <div className="mt-2 inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                        Save {savings}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    {plan.highlights.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="text-green-500 mr-3 flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {subscribing ? 'Processing...' : 'Subscribe Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Detailed Feature Comparison
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    Property Listings
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-900">
                      {plan.features.property_limit}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    Featured Listings
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-900">
                      {plan.features.featured_listing_limit}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    Lead Access
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center">
                      {plan.features.lead_access ? (
                        <Check className="text-green-500 mx-auto" size={20} />
                      ) : (
                        <X className="text-red-500 mx-auto" size={20} />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    Analytics Dashboard
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center">
                      {plan.features.analytics_access ? (
                        <Check className="text-green-500 mx-auto" size={20} />
                      ) : (
                        <X className="text-red-500 mx-auto" size={20} />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    Zero Brokerage Direct Contact
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center">
                      {plan.features.zero_brokerage ? (
                        <Check className="text-green-500 mx-auto" size={20} />
                      ) : (
                        <X className="text-red-500 mx-auto" size={20} />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    Priority Support
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center">
                      {plan.features.priority_support ? (
                        <Check className="text-green-500 mx-auto" size={20} />
                      ) : (
                        <X className="text-red-500 mx-auto" size={20} />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    Contact Limit (per month)
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-900">
                      {plan.features.contact_limit}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can cancel your subscription at any time. Your plan will remain active until the end of the billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 text-sm">
                We offer a 7-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade my plan?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade to a higher plan at any time. The price difference will be pro-rated.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit/debit cards, UPI, net banking, and wallets through Razorpay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPlans;
