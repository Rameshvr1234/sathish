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
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config/api.config';

const PropertyAlertsScreen = ({ navigation }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [alertForm, setAlertForm] = useState({
    alert_name: '',
    property_type: [],
    listing_type: 'any',
    min_price: '',
    max_price: '',
    min_bedrooms: '',
    max_bedrooms: '',
    regions: [],
    amenities: [],
    frequency: 'daily',
    email_notification: true,
    push_notification: true,
  });

  const propertyTypes = ['apartment', 'villa', 'independent_house', 'plot'];
  const regions = ['North Chennai', 'South Chennai', 'Central Chennai', 'West Chennai', 'East Chennai'];
  const amenities = ['parking', 'gym', 'swimming_pool', 'security', 'power_backup', 'lift', 'garden', 'club_house'];

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(`${API_URL}/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      Alert.alert('Error', 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async () => {
    if (!alertForm.alert_name.trim()) {
      Alert.alert('Error', 'Please enter an alert name');
      return;
    }

    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const endpoint = editingAlert
        ? `${API_URL}/alerts/${editingAlert.id}`
        : `${API_URL}/alerts`;

      const method = editingAlert ? 'put' : 'post';

      await axios[method](endpoint, alertForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert(
        'Success',
        editingAlert ? 'Alert updated successfully!' : 'Alert created successfully!'
      );

      setShowCreateModal(false);
      setEditingAlert(null);
      resetForm();
      fetchAlerts();
    } catch (error) {
      console.error('Error saving alert:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save alert');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAlert = async (alertId, currentStatus) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.patch(`${API_URL}/alerts/${alertId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, is_active: !currentStatus } : alert
      ));
    } catch (error) {
      console.error('Error toggling alert:', error);
      Alert.alert('Error', 'Failed to update alert status');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    Alert.alert(
      'Delete Alert',
      'Are you sure you want to delete this alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(`${API_URL}/alerts/${alertId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              Alert.alert('Success', 'Alert deleted successfully!');
              fetchAlerts();
            } catch (error) {
              console.error('Error deleting alert:', error);
              Alert.alert('Error', 'Failed to delete alert');
            }
          },
        },
      ]
    );
  };

  const handleEditAlert = (alert) => {
    setEditingAlert(alert);
    setAlertForm({
      alert_name: alert.alert_name || '',
      property_type: alert.property_type || [],
      listing_type: alert.listing_type || 'any',
      min_price: alert.min_price?.toString() || '',
      max_price: alert.max_price?.toString() || '',
      min_bedrooms: alert.min_bedrooms?.toString() || '',
      max_bedrooms: alert.max_bedrooms?.toString() || '',
      regions: alert.regions || [],
      amenities: alert.amenities || [],
      frequency: alert.frequency || 'daily',
      email_notification: alert.email_notification !== false,
      push_notification: alert.push_notification !== false,
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
      amenities: [],
      frequency: 'daily',
      email_notification: true,
      push_notification: true,
    });
  };

  const toggleArrayItem = (field, value) => {
    setAlertForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value],
    }));
  };

  const formatPropertyType = (types) => {
    if (!types || types.length === 0) return 'All types';
    return types.map(type =>
      type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ).join(', ');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Property Alerts</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property Alerts</Text>
        <TouchableOpacity
          onPress={() => {
            resetForm();
            setEditingAlert(null);
            setShowCreateModal(true);
          }}
        >
          <Ionicons name="add-circle" size={28} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {alerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={80} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No Alerts Yet</Text>
            <Text style={styles.emptyStateText}>
              Create your first alert to get notified about properties matching your search
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.createButtonText}>Create Your First Alert</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.alertsContainer}>
            {alerts.map((alert) => (
              <View key={alert.id} style={[styles.alertCard, !alert.is_active && styles.alertCardInactive]}>
                {/* Alert Header */}
                <View style={styles.alertHeader}>
                  <View style={styles.alertTitleContainer}>
                    <Text style={styles.alertName}>{alert.alert_name || 'Untitled Alert'}</Text>
                    <Text style={styles.alertStatus}>
                      {alert.is_active ? 'Active' : 'Paused'} • {alert.frequency}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleToggleAlert(alert.id, alert.is_active)}
                  >
                    <Ionicons
                      name={alert.is_active ? 'toggle' : 'toggle-outline'}
                      size={32}
                      color={alert.is_active ? '#10B981' : '#9CA3AF'}
                    />
                  </TouchableOpacity>
                </View>

                {/* Alert Details */}
                <View style={styles.alertDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="home-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{formatPropertyType(alert.property_type)}</Text>
                  </View>

                  {(alert.min_price || alert.max_price) && (
                    <View style={styles.detailRow}>
                      <Ionicons name="cash-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>
                        {alert.min_price ? formatCurrency(alert.min_price) : 'Any'} - {alert.max_price ? formatCurrency(alert.max_price) : 'Any'}
                      </Text>
                    </View>
                  )}

                  {(alert.min_bedrooms || alert.max_bedrooms) && (
                    <View style={styles.detailRow}>
                      <Ionicons name="bed-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>
                        {alert.min_bedrooms || 'Any'} - {alert.max_bedrooms || 'Any'} BHK
                      </Text>
                    </View>
                  )}

                  {alert.regions && alert.regions.length > 0 && (
                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={16} color="#6B7280" />
                      <View style={styles.chipsContainer}>
                        {alert.regions.slice(0, 2).map((region, idx) => (
                          <View key={idx} style={styles.chip}>
                            <Text style={styles.chipText}>{region}</Text>
                          </View>
                        ))}
                        {alert.regions.length > 2 && (
                          <Text style={styles.moreText}>+{alert.regions.length - 2} more</Text>
                        )}
                      </View>
                    </View>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditAlert(alert)}
                  >
                    <Ionicons name="pencil-outline" size={18} color="#2563EB" />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteAlert(alert.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create/Edit Alert Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowCreateModal(false);
          setEditingAlert(null);
          resetForm();
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowCreateModal(false);
                setEditingAlert(null);
                resetForm();
              }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{editingAlert ? 'Edit Alert' : 'Create Alert'}</Text>
            <TouchableOpacity onPress={handleCreateAlert} disabled={submitting}>
              <Text style={[styles.modalSaveText, submitting && styles.modalSaveTextDisabled]}>
                {submitting ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Alert Name */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Alert Name *</Text>
              <TextInput
                style={styles.formInput}
                value={alertForm.alert_name}
                onChangeText={(text) => setAlertForm({ ...alertForm, alert_name: text })}
                placeholder="e.g., 3 BHK in North Chennai"
              />
            </View>

            {/* Property Type */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Property Type</Text>
              <View style={styles.chipsGrid}>
                {propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.formChip,
                      alertForm.property_type.includes(type) && styles.formChipActive,
                    ]}
                    onPress={() => toggleArrayItem('property_type', type)}
                  >
                    <Text
                      style={[
                        styles.formChipText,
                        alertForm.property_type.includes(type) && styles.formChipTextActive,
                      ]}
                    >
                      {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Price Range</Text>
              <View style={styles.formRow}>
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  value={alertForm.min_price}
                  onChangeText={(text) => setAlertForm({ ...alertForm, min_price: text })}
                  placeholder="Min Price"
                  keyboardType="numeric"
                />
                <Text style={styles.formSeparator}>-</Text>
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  value={alertForm.max_price}
                  onChangeText={(text) => setAlertForm({ ...alertForm, max_price: text })}
                  placeholder="Max Price"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Bedrooms */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Bedrooms</Text>
              <View style={styles.formRow}>
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  value={alertForm.min_bedrooms}
                  onChangeText={(text) => setAlertForm({ ...alertForm, min_bedrooms: text })}
                  placeholder="Min"
                  keyboardType="numeric"
                />
                <Text style={styles.formSeparator}>-</Text>
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  value={alertForm.max_bedrooms}
                  onChangeText={(text) => setAlertForm({ ...alertForm, max_bedrooms: text })}
                  placeholder="Max"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Regions */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Regions</Text>
              <View style={styles.chipsGrid}>
                {regions.map((region) => (
                  <TouchableOpacity
                    key={region}
                    style={[
                      styles.formChip,
                      alertForm.regions.includes(region) && styles.formChipActive,
                    ]}
                    onPress={() => toggleArrayItem('regions', region)}
                  >
                    <Text
                      style={[
                        styles.formChipText,
                        alertForm.regions.includes(region) && styles.formChipTextActive,
                      ]}
                    >
                      {region}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Amenities */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Amenities</Text>
              <View style={styles.chipsGrid}>
                {amenities.map((amenity) => (
                  <TouchableOpacity
                    key={amenity}
                    style={[
                      styles.formChip,
                      alertForm.amenities.includes(amenity) && styles.formChipActive,
                    ]}
                    onPress={() => toggleArrayItem('amenities', amenity)}
                  >
                    <Text
                      style={[
                        styles.formChipText,
                        alertForm.amenities.includes(amenity) && styles.formChipTextActive,
                      ]}
                    >
                      {amenity.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Frequency */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Notification Frequency</Text>
              <View style={styles.frequencyButtons}>
                {['instant', 'daily', 'weekly'].map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.frequencyButton,
                      alertForm.frequency === freq && styles.frequencyButtonActive,
                    ]}
                    onPress={() => setAlertForm({ ...alertForm, frequency: freq })}
                  >
                    <Text
                      style={[
                        styles.frequencyButtonText,
                        alertForm.frequency === freq && styles.frequencyButtonTextActive,
                      ]}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notification Preferences */}
            <View style={styles.formGroup}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() =>
                  setAlertForm({ ...alertForm, email_notification: !alertForm.email_notification })
                }
              >
                <View style={[styles.checkbox, alertForm.email_notification && styles.checkboxChecked]}>
                  {alertForm.email_notification && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Email notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() =>
                  setAlertForm({ ...alertForm, push_notification: !alertForm.push_notification })
                }
              >
                <View style={[styles.checkbox, alertForm.push_notification && styles.checkboxChecked]}>
                  {alertForm.push_notification && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Push notifications</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    paddingTop: 100,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  alertsContainer: {
    padding: 16,
    gap: 16,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertCardInactive: {
    opacity: 0.6,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertTitleContainer: {
    flex: 1,
  },
  alertName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  alertStatus: {
    fontSize: 12,
    color: '#6B7280',
  },
  alertDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#DBEAFE',
    borderRadius: 4,
  },
  chipText: {
    fontSize: 12,
    color: '#1E40AF',
  },
  moreText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  modalSaveTextDisabled: {
    color: '#9CA3AF',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#fff',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formSeparator: {
    fontSize: 16,
    color: '#6B7280',
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  formChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  formChipActive: {
    backgroundColor: '#2563EB',
  },
  formChipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  formChipTextActive: {
    color: '#fff',
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: '#2563EB',
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  frequencyButtonTextActive: {
    color: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
});

export default PropertyAlertsScreen;
