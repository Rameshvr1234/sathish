import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calculator, TrendingUp, PieChart, DollarSign } from 'lucide-react';

const EMICalculator = () => {
  const [formData, setFormData] = useState({
    principal: 5000000,
    annualRate: 8.5,
    tenureYears: 20
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('emi');

  const calculateEMI = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/calculators/emi`, {
        principal: parseFloat(formData.principal),
        annualRate: parseFloat(formData.annualRate),
        tenureMonths: parseInt(formData.tenureYears) * 12
      });
      setResult(response.data.data);
    } catch (error) {
      console.error('Error calculating EMI:', error);
      alert('Error calculating EMI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.principal && formData.annualRate && formData.tenureYears) {
      calculateEMI();
    }
  }, [formData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Calculator className="inline-block mr-3 mb-1" size={36} />
            EMI Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate your home loan EMI and plan your finances better
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Details</h2>

            {/* Loan Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount
              </label>
              <input
                type="number"
                name="principal"
                value={formData.principal}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter loan amount"
              />
              <input
                type="range"
                name="principal"
                min="100000"
                max="50000000"
                step="100000"
                value={formData.principal}
                onChange={handleInputChange}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>₹1L</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(formData.principal)}
                </span>
                <span>₹5Cr</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (% per annum)
              </label>
              <input
                type="number"
                name="annualRate"
                value={formData.annualRate}
                onChange={handleInputChange}
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter interest rate"
              />
              <input
                type="range"
                name="annualRate"
                min="6"
                max="15"
                step="0.1"
                value={formData.annualRate}
                onChange={handleInputChange}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>6%</span>
                <span className="font-semibold text-blue-600">
                  {formData.annualRate}%
                </span>
                <span>15%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Tenure (Years)
              </label>
              <input
                type="number"
                name="tenureYears"
                value={formData.tenureYears}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter loan tenure"
              />
              <input
                type="range"
                name="tenureYears"
                min="1"
                max="30"
                value={formData.tenureYears}
                onChange={handleInputChange}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1 Year</span>
                <span className="font-semibold text-blue-600">
                  {formData.tenureYears} Years
                </span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <button
                onClick={() => setFormData({ ...formData, principal: 2500000 })}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                ₹25L
              </button>
              <button
                onClick={() => setFormData({ ...formData, principal: 5000000 })}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                ₹50L
              </button>
              <button
                onClick={() => setFormData({ ...formData, principal: 10000000 })}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                ₹1Cr
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : result ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Monthly EMI</h2>

                {/* EMI Amount */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-6">
                  <div className="text-sm opacity-90 mb-2">Monthly EMI</div>
                  <div className="text-4xl font-bold">
                    {formatCurrency(result.emi)}
                  </div>
                  <div className="text-sm opacity-90 mt-2">
                    for {formData.tenureYears} years
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-600 mb-2">
                      <DollarSign size={18} className="mr-1" />
                      <span className="text-sm">Principal</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(result.principal)}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-600 mb-2">
                      <TrendingUp size={18} className="mr-1" />
                      <span className="text-sm">Total Interest</span>
                    </div>
                    <div className="text-xl font-bold text-orange-600">
                      {formatCurrency(result.totalInterest)}
                    </div>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount Payable</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(result.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Pie Chart Visualization */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Payment Breakdown</h3>
                    <PieChart size={20} className="text-gray-600" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Principal Amount</span>
                        <span className="font-semibold">
                          {((result.principal / result.totalAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(result.principal / result.totalAmount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Interest Amount</span>
                        <span className="font-semibold">
                          {((result.totalInterest / result.totalAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${(result.totalInterest / result.totalAmount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Calculator size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Enter loan details to calculate EMI</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Amortization Schedule */}
        {result && result.schedule && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Amortization Schedule
              {result.schedule.length > 12 && <span className="text-sm font-normal text-gray-500 ml-2">(Yearly Summary)</span>}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {result.schedule.length > 12 ? 'Year' : 'Month'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.schedule.slice(0, 10).map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.schedule.length > 12 ? Math.ceil(item.month / 12) : item.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.emi)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        {formatCurrency(item.principalPaid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                        {formatCurrency(item.interestPaid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {result.schedule.length > 10 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                Showing first {result.schedule.length > 12 ? '10 years' : '10 months'}
              </div>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-2">💡 Lower Interest Rate</h3>
            <p className="text-sm text-blue-800">
              Even a 0.5% reduction in interest rate can save lakhs over the loan tenure.
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-bold text-green-900 mb-2">💰 Higher Down Payment</h3>
            <p className="text-sm text-green-800">
              Pay 20-30% down payment to reduce loan amount and get better interest rates.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="font-bold text-purple-900 mb-2">📅 Shorter Tenure</h3>
            <p className="text-sm text-purple-800">
              Choose shorter tenure if possible to save significantly on total interest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
