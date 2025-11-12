import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  bookSurveyService,
  bookLegalService,
  bookConstructionService,
  bookFinanceService,
} from '../../redux/slices/serviceSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ServiceBookingScreen = ({route, navigation}) => {
  const {type} = route.params; // survey, legal, construction, finance
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.service);

  const [formData, setFormData] = useState({
    service_type: '',
    property_address: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    preferred_date: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const serviceOptions = {
    survey: [
      {value: 'digital', label: 'Digital Survey', price: 5000},
      {value: 'land', label: 'Land Survey', price: 8000},
      {value: 'dtcp_plot', label: 'DTCP Plot Survey', price: 10000},
      {value: 'house', label: 'House/Building Survey', price: 12000},
      {value: 'commercial', label: 'Commercial Survey', price: 15000},
      {value: 'industrial', label: 'Industrial Survey', price: 20000},
    ],
    legal: [
      {value: 'sale_deed', label: 'Sale Deed Verification', price: 15000},
      {value: 'gift_deed', label: 'Gift Deed', price: 12000},
      {value: 'power_of_attorney', label: 'Power of Attorney', price: 10000},
      {value: 'legal_advice', label: 'Legal Advice', price: 5000},
    ],
    construction: [
      {value: '2d_3d_plan', label: '2D/3D Plan', price: 25000},
      {value: '3d_elevation', label: '3D Elevation', price: 15000},
      {value: 'plan_approval', label: 'Plan Approval', price: 20000},
      {value: 'estimate', label: 'Construction Estimate', price: 10000},
      {value: 'supervision', label: 'Construction Supervision', price: 50000},
      {value: 'contractor', label: 'Contractor Service', price: 100000},
      {value: 'vastu', label: 'Vastu Consultation', price: 8000},
    ],
    finance: [
      {value: 'home_loan', label: 'Home Loan', price: 0},
      {value: 'land_loan', label: 'Land Loan', price: 0},
      {value: 'commercial_loan', label: 'Commercial Loan', price: 0},
    ],
  };

  const serviceInfo = {
    survey: {
      title: 'Survey Services',
      icon: 'map-marker-radius',
      color: '#52c41a',
      description: 'Professional land and property survey services',
    },
    legal: {
      title: 'Legal Services',
      icon: 'file-document',
      color: '#1890ff',
      description: 'Complete legal documentation and verification',
    },
    construction: {
      title: 'Construction Services',
      icon: 'hammer-wrench',
      color: '#fa8c16',
      description: 'End-to-end construction planning and execution',
    },
    finance: {
      title: 'Finance Services',
      icon: 'currency-inr',
      color: '#722ed1',
      description: 'Home loan and financial assistance',
    },
  };

  const info = serviceInfo[type];
  const options = serviceOptions[type];

  const selectedOption = options.find(opt => opt.value === formData.service_type);

  const validate = () => {
    const newErrors = {};

    if (!formData.service_type) {
      newErrors.service_type = 'Please select a service type';
    }
    if (!formData.property_address) {
      newErrors.property_address = 'Property address is required';
    }
    if (!formData.contact_name) {
      newErrors.contact_name = 'Contact name is required';
    }
    if (!formData.contact_phone) {
      newErrors.contact_phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.contact_phone)) {
      newErrors.contact_phone = 'Phone must be 10 digits';
    }
    if (!formData.contact_email) {
      newErrors.contact_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      newErrors.contact_email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const bookingData = {
        ...formData,
        amount: selectedOption?.price || 0,
      };

      let action;
      switch (type) {
        case 'survey':
          action = bookSurveyService(bookingData);
          break;
        case 'legal':
          action = bookLegalService(bookingData);
          break;
        case 'construction':
          action = bookConstructionService(bookingData);
          break;
        case 'finance':
          action = bookFinanceService(bookingData);
          break;
        default:
          return;
      }

      await dispatch(action).unwrap();

      Alert.alert(
        'Success',
        'Service booking request submitted successfully! Our team will contact you soon.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to book service');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Service Info Header */}
        <Card style={[styles.headerCard, {backgroundColor: info.color}]}>
          <Icon name={info.icon} size={48} color="#fff" />
          <Text style={styles.headerTitle}>{info.title}</Text>
          <Text style={styles.headerDescription}>{info.description}</Text>
        </Card>

        {/* Service Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Service Type *</Text>
          <View style={styles.optionsGrid}>
            {options.map(option => (
              <Card
                key={option.value}
                style={[
                  styles.optionCard,
                  formData.service_type === option.value &&
                    styles.optionCardSelected,
                ]}
                onPress={() =>
                  setFormData({...formData, service_type: option.value})
                }>
                <Text
                  style={[
                    styles.optionLabel,
                    formData.service_type === option.value &&
                      styles.optionLabelSelected,
                  ]}>
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.optionPrice,
                    formData.service_type === option.value &&
                      styles.optionPriceSelected,
                  ]}>
                  {option.price > 0
                    ? `₹${option.price.toLocaleString()}`
                    : 'Free Consultation'}
                </Text>
              </Card>
            ))}
          </View>
          {errors.service_type && (
            <Text style={styles.errorText}>{errors.service_type}</Text>
          )}
        </View>

        {/* Selected Service Summary */}
        {selectedOption && (
          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Selected Service:</Text>
              <Text style={styles.summaryValue}>{selectedOption.label}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount:</Text>
              <Text style={[styles.summaryValue, styles.summaryAmount]}>
                {selectedOption.price > 0
                  ? `₹${selectedOption.price.toLocaleString()}`
                  : 'Free'}
              </Text>
            </View>
          </Card>
        )}

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          <Input
            label="Property Address *"
            value={formData.property_address}
            onChangeText={text =>
              setFormData({...formData, property_address: text})
            }
            placeholder="Enter full property address"
            icon="map-marker"
            multiline
            numberOfLines={3}
            error={errors.property_address}
          />

          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Input
            label="Contact Name *"
            value={formData.contact_name}
            onChangeText={text =>
              setFormData({...formData, contact_name: text})
            }
            placeholder="Enter your name"
            icon="account"
            error={errors.contact_name}
          />

          <Input
            label="Phone Number *"
            value={formData.contact_phone}
            onChangeText={text =>
              setFormData({...formData, contact_phone: text})
            }
            placeholder="10 digit mobile number"
            icon="phone"
            keyboardType="phone-pad"
            error={errors.contact_phone}
          />

          <Input
            label="Email *"
            value={formData.contact_email}
            onChangeText={text =>
              setFormData({...formData, contact_email: text.toLowerCase()})
            }
            placeholder="Enter your email"
            icon="email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.contact_email}
          />

          <Input
            label="Preferred Date (Optional)"
            value={formData.preferred_date}
            onChangeText={text =>
              setFormData({...formData, preferred_date: text})
            }
            placeholder="DD/MM/YYYY"
            icon="calendar"
          />

          <Input
            label="Additional Notes (Optional)"
            value={formData.notes}
            onChangeText={text => setFormData({...formData, notes: text})}
            placeholder="Any special requirements or notes"
            icon="note-text"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <Button
            title="Submit Booking Request"
            onPress={handleSubmit}
            loading={loading}
            icon="check-circle"
            size="large"
          />
          <Text style={styles.submitNote}>
            Our team will contact you within 24 hours
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 16,
    alignItems: 'center',
    paddingVertical: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
  },
  headerDescription: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: '48%',
    padding: 16,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  optionCardSelected: {
    borderColor: '#1890ff',
    backgroundColor: '#e6f7ff',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 8,
  },
  optionLabelSelected: {
    color: '#1890ff',
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#595959',
  },
  optionPriceSelected: {
    color: '#1890ff',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#e6f7ff',
    borderWidth: 1,
    borderColor: '#91d5ff',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#595959',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
  },
  summaryAmount: {
    fontSize: 18,
    color: '#1890ff',
  },
  submitSection: {
    padding: 16,
  },
  submitNote: {
    fontSize: 12,
    color: '#8c8c8c',
    textAlign: 'center',
    marginTop: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#ff4d4f',
    marginTop: 4,
  },
});

export default ServiceBookingScreen;
