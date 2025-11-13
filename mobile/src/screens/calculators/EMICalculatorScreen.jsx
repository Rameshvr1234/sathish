import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { API_URL } from '../../config/api.config';

const EMICalculatorScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    principal: 5000000,
    annualRate: 8.5,
    tenureYears: 20,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateEMI();
  }, [formData]);

  const calculateEMI = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/calculators/emi`, {
        principal: parseFloat(formData.principal),
        annualRate: parseFloat(formData.annualRate),
        tenureMonths: parseInt(formData.tenureYears) * 12,
      });
      setResult(response.data.data);
    } catch (error) {
      console.error('Error calculating EMI:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleQuickAmount = (amount) => {
    setFormData({ ...formData, principal: amount });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EMI Calculator</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Input Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Loan Details</Text>

          {/* Loan Amount */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loan Amount</Text>
            <TextInput
              style={styles.input}
              value={formData.principal.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, principal: parseFloat(text) || 0 })
              }
              keyboardType="numeric"
              placeholder="Enter loan amount"
            />
            <Slider
              style={styles.slider}
              minimumValue={100000}
              maximumValue={50000000}
              step={100000}
              value={formData.principal}
              onValueChange={(value) => setFormData({ ...formData, principal: value })}
              minimumTrackTintColor="#2563EB"
              maximumTrackTintColor="#D1D5DB"
              thumbTintColor="#2563EB"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>₹1L</Text>
              <Text style={styles.sliderLabelCenter}>{formatCurrency(formData.principal)}</Text>
              <Text style={styles.sliderLabel}>₹5Cr</Text>
            </View>
          </View>

          {/* Quick Amount Buttons */}
          <View style={styles.quickButtons}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => handleQuickAmount(2500000)}
            >
              <Text style={styles.quickButtonText}>₹25L</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => handleQuickAmount(5000000)}
            >
              <Text style={styles.quickButtonText}>₹50L</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => handleQuickAmount(10000000)}
            >
              <Text style={styles.quickButtonText}>₹1Cr</Text>
            </TouchableOpacity>
          </View>

          {/* Interest Rate */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Interest Rate (% per annum)</Text>
            <TextInput
              style={styles.input}
              value={formData.annualRate.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, annualRate: parseFloat(text) || 0 })
              }
              keyboardType="decimal-pad"
              placeholder="Enter interest rate"
            />
            <Slider
              style={styles.slider}
              minimumValue={6}
              maximumValue={15}
              step={0.1}
              value={formData.annualRate}
              onValueChange={(value) => setFormData({ ...formData, annualRate: value })}
              minimumTrackTintColor="#2563EB"
              maximumTrackTintColor="#D1D5DB"
              thumbTintColor="#2563EB"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>6%</Text>
              <Text style={styles.sliderLabelCenter}>{formData.annualRate}%</Text>
              <Text style={styles.sliderLabel}>15%</Text>
            </View>
          </View>

          {/* Loan Tenure */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loan Tenure (Years)</Text>
            <TextInput
              style={styles.input}
              value={formData.tenureYears.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, tenureYears: parseInt(text) || 0 })
              }
              keyboardType="numeric"
              placeholder="Enter loan tenure"
            />
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={30}
              step={1}
              value={formData.tenureYears}
              onValueChange={(value) => setFormData({ ...formData, tenureYears: value })}
              minimumTrackTintColor="#2563EB"
              maximumTrackTintColor="#D1D5DB"
              thumbTintColor="#2563EB"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>1 Year</Text>
              <Text style={styles.sliderLabelCenter}>{formData.tenureYears} Years</Text>
              <Text style={styles.sliderLabel}>30 Years</Text>
            </View>
          </View>
        </View>

        {/* Results Section */}
        <View style={styles.card}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          ) : result ? (
            <>
              <Text style={styles.cardTitle}>Your Monthly EMI</Text>

              {/* EMI Amount */}
              <View style={styles.emiCard}>
                <Text style={styles.emiLabel}>Monthly EMI</Text>
                <Text style={styles.emiAmount}>{formatCurrency(result.emi)}</Text>
                <Text style={styles.emiTenure}>for {formData.tenureYears} years</Text>
              </View>

              {/* Summary Cards */}
              <View style={styles.summaryGrid}>
                <View style={styles.summaryCard}>
                  <View style={styles.summaryIconContainer}>
                    <Ionicons name="cash-outline" size={20} color="#2563EB" />
                  </View>
                  <Text style={styles.summaryLabel}>Principal</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(result.principal)}</Text>
                </View>

                <View style={styles.summaryCard}>
                  <View style={styles.summaryIconContainer}>
                    <Ionicons name="trending-up-outline" size={20} color="#F59E0B" />
                  </View>
                  <Text style={styles.summaryLabel}>Total Interest</Text>
                  <Text style={styles.summaryValueOrange}>
                    {formatCurrency(result.totalInterest)}
                  </Text>
                </View>
              </View>

              {/* Total Amount */}
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Amount Payable</Text>
                <Text style={styles.totalValue}>{formatCurrency(result.totalAmount)}</Text>
              </View>

              {/* Payment Breakdown */}
              <View style={styles.breakdownCard}>
                <View style={styles.breakdownHeader}>
                  <Text style={styles.breakdownTitle}>Payment Breakdown</Text>
                  <Ionicons name="pie-chart-outline" size={20} color="#6B7280" />
                </View>

                {/* Principal Bar */}
                <View style={styles.breakdownItem}>
                  <View style={styles.breakdownLabelRow}>
                    <Text style={styles.breakdownLabel}>Principal Amount</Text>
                    <Text style={styles.breakdownPercentage}>
                      {((result.principal / result.totalAmount) * 100).toFixed(1)}%
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        styles.progressBarPrincipal,
                        { width: `${(result.principal / result.totalAmount) * 100}%` },
                      ]}
                    />
                  </View>
                </View>

                {/* Interest Bar */}
                <View style={styles.breakdownItem}>
                  <View style={styles.breakdownLabelRow}>
                    <Text style={styles.breakdownLabel}>Interest Amount</Text>
                    <Text style={styles.breakdownPercentage}>
                      {((result.totalInterest / result.totalAmount) * 100).toFixed(1)}%
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        styles.progressBarInterest,
                        { width: `${(result.totalInterest / result.totalAmount) * 100}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Amortization Schedule Preview */}
              {result.schedule && result.schedule.length > 0 && (
                <View style={styles.scheduleCard}>
                  <Text style={styles.scheduleTitle}>
                    Amortization Schedule (First 5 {result.schedule.length > 12 ? 'Years' : 'Months'})
                  </Text>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                      {result.schedule.length > 12 ? 'Year' : 'Month'}
                    </Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>EMI</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Balance</Text>
                  </View>
                  {result.schedule.slice(0, 5).map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={[styles.tableCell, { flex: 1 }]}>
                        {result.schedule.length > 12
                          ? Math.ceil(item.month / 12)
                          : item.month}
                      </Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>
                        {formatCurrency(item.emi)}
                      </Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>
                        {formatCurrency(item.balance)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calculator-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>Enter loan details to calculate EMI</Text>
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipTitle}>Lower Interest Rate</Text>
            <Text style={styles.tipText}>
              Even a 0.5% reduction can save lakhs over the loan tenure.
            </Text>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>💰</Text>
            <Text style={styles.tipTitle}>Higher Down Payment</Text>
            <Text style={styles.tipText}>
              Pay 20-30% down payment to reduce loan amount and get better rates.
            </Text>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>📅</Text>
            <Text style={styles.tipTitle}>Shorter Tenure</Text>
            <Text style={styles.tipText}>
              Choose shorter tenure if possible to save on total interest.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  sliderLabelCenter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emiCard: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  emiLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  emiAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emiTenure: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  summaryIconContainer: {
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryValueOrange: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
  },
  totalContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  breakdownCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  breakdownItem: {
    marginBottom: 12,
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  breakdownPercentage: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressBarPrincipal: {
    backgroundColor: '#2563EB',
  },
  progressBarInterest: {
    backgroundColor: '#F59E0B',
  },
  scheduleCard: {
    marginTop: 8,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCell: {
    fontSize: 12,
    color: '#1F2937',
    textAlign: 'center',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
  },
  tipsContainer: {
    padding: 16,
    gap: 12,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default EMICalculatorScreen;
