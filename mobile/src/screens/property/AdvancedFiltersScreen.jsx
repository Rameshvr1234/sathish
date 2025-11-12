import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdvancedFiltersScreen = ({ navigation, route }) => {
  const { onApplyFilters, initialFilters = {} } = route.params || {};

  const [filters, setFilters] = useState({
    property_type: initialFilters.property_type || [],
    listing_type: initialFilters.listing_type || 'any',
    min_price: initialFilters.min_price || '',
    max_price: initialFilters.max_price || '',
    min_bedrooms: initialFilters.min_bedrooms || '',
    max_bedrooms: initialFilters.max_bedrooms || '',
    min_bathrooms: initialFilters.min_bathrooms || '',
    regions: initialFilters.regions || [],
    furnishing_status: initialFilters.furnishing_status || [],
    property_age: initialFilters.property_age || [],
    parking_type: initialFilters.parking_type || [],
    facing_direction: initialFilters.facing_direction || [],
    possession_status: initialFilters.possession_status || [],
    amenities: initialFilters.amenities || [],
    verified_only: initialFilters.verified_only || false,
  });

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    details: false,
    amenities: false,
  });

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: 'business' },
    { value: 'villa', label: 'Villa', icon: 'home' },
    { value: 'independent_house', label: 'Independent House', icon: 'home-outline' },
    { value: 'plot', label: 'Plot', icon: 'map' },
    { value: 'builder_floor', label: 'Builder Floor', icon: 'layers' },
    { value: 'studio_apartment', label: 'Studio', icon: 'cube' },
  ];

  const regions = [
    'North Chennai',
    'South Chennai',
    'Central Chennai',
    'West Chennai',
    'East Chennai',
  ];

  const furnishingOptions = [
    { value: 'furnished', label: 'Furnished' },
    { value: 'semi_furnished', label: 'Semi-Furnished' },
    { value: 'unfurnished', label: 'Unfurnished' },
  ];

  const propertyAgeOptions = [
    { value: 'new', label: 'New (0 years)' },
    { value: '0-5', label: '0-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' },
  ];

  const parkingOptions = [
    { value: 'covered', label: 'Covered' },
    { value: 'open', label: 'Open' },
    { value: 'none', label: 'No Parking' },
  ];

  const facingDirections = [
    { value: 'north', label: 'North' },
    { value: 'south', label: 'South' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
    { value: 'north_east', label: 'North-East' },
    { value: 'north_west', label: 'North-West' },
    { value: 'south_east', label: 'South-East' },
    { value: 'south_west', label: 'South-West' },
  ];

  const possessionOptions = [
    { value: 'ready_to_move', label: 'Ready to Move' },
    { value: 'under_construction', label: 'Under Construction' },
    { value: 'new_launch', label: 'New Launch' },
  ];

  const amenitiesList = [
    { value: 'parking', label: 'Parking', icon: 'car' },
    { value: 'gym', label: 'Gym', icon: 'fitness' },
    { value: 'swimming_pool', label: 'Pool', icon: 'water' },
    { value: 'security', label: 'Security', icon: 'shield-checkmark' },
    { value: 'power_backup', label: 'Power Backup', icon: 'flash' },
    { value: 'lift', label: 'Lift', icon: 'arrow-up' },
    { value: 'garden', label: 'Garden', icon: 'leaf' },
    { value: 'club_house', label: 'Club House', icon: 'people' },
    { value: 'play_area', label: 'Play Area', icon: 'basketball' },
    { value: 'water_supply', label: 'Water Supply', icon: 'water-outline' },
    { value: 'gas_pipeline', label: 'Gas Pipeline', icon: 'flame' },
    { value: 'waste_disposal', label: 'Waste Disposal', icon: 'trash' },
    { value: 'maintenance_staff', label: 'Maintenance', icon: 'construct' },
    { value: 'cctv', label: 'CCTV', icon: 'camera' },
  ];

  const toggleArrayFilter = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: prev[filterName].includes(value)
        ? prev[filterName].filter((v) => v !== value)
        : [...prev[filterName], value],
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      property_type: [],
      listing_type: 'any',
      min_price: '',
      max_price: '',
      min_bedrooms: '',
      max_bedrooms: '',
      min_bathrooms: '',
      regions: [],
      furnishing_status: [],
      property_age: [],
      parking_type: [],
      facing_direction: [],
      possession_status: [],
      amenities: [],
      verified_only: false,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.property_type.length > 0) count++;
    if (filters.listing_type !== 'any') count++;
    if (filters.min_price || filters.max_price) count++;
    if (filters.min_bedrooms || filters.max_bedrooms) count++;
    if (filters.min_bathrooms) count++;
    if (filters.regions.length > 0) count++;
    if (filters.furnishing_status.length > 0) count++;
    if (filters.property_age.length > 0) count++;
    if (filters.parking_type.length > 0) count++;
    if (filters.facing_direction.length > 0) count++;
    if (filters.possession_status.length > 0) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.verified_only) count++;
    return count;
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Advanced Filters</Text>
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={clearAllFilters}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Basic Filters Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('basic')}
          >
            <Text style={styles.sectionTitle}>Basic Filters</Text>
            <Ionicons
              name={expandedSections.basic ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#6B7280"
            />
          </TouchableOpacity>

          {expandedSections.basic && (
            <View style={styles.sectionContent}>
              {/* Property Type */}
              <Text style={styles.label}>Property Type</Text>
              <View style={styles.chipsContainer}>
                {propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.chip,
                      filters.property_type.includes(type.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleArrayFilter('property_type', type.value)}
                  >
                    <Ionicons
                      name={type.icon}
                      size={16}
                      color={filters.property_type.includes(type.value) ? '#fff' : '#6B7280'}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        filters.property_type.includes(type.value) && styles.chipTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Listing Type */}
              <Text style={styles.label}>Listing Type</Text>
              <View style={styles.buttonsRow}>
                {['any', 'buy', 'rent'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.button,
                      filters.listing_type === type && styles.buttonActive,
                    ]}
                    onPress={() => setFilters({ ...filters, listing_type: type })}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        filters.listing_type === type && styles.buttonTextActive,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Price Range */}
              <Text style={styles.label}>Price Range</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Min Price"
                  keyboardType="numeric"
                  value={filters.min_price}
                  onChangeText={(text) => setFilters({ ...filters, min_price: text })}
                />
                <Text style={styles.separator}>-</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Max Price"
                  keyboardType="numeric"
                  value={filters.max_price}
                  onChangeText={(text) => setFilters({ ...filters, max_price: text })}
                />
              </View>

              {/* Bedrooms */}
              <Text style={styles.label}>Bedrooms</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Min"
                  keyboardType="numeric"
                  value={filters.min_bedrooms}
                  onChangeText={(text) => setFilters({ ...filters, min_bedrooms: text })}
                />
                <Text style={styles.separator}>-</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Max"
                  keyboardType="numeric"
                  value={filters.max_bedrooms}
                  onChangeText={(text) => setFilters({ ...filters, max_bedrooms: text })}
                />
              </View>

              {/* Bathrooms */}
              <Text style={styles.label}>Min Bathrooms</Text>
              <TextInput
                style={styles.fullInput}
                placeholder="Minimum bathrooms"
                keyboardType="numeric"
                value={filters.min_bathrooms}
                onChangeText={(text) => setFilters({ ...filters, min_bathrooms: text })}
              />

              {/* Regions */}
              <Text style={styles.label}>Regions</Text>
              <View style={styles.chipsContainer}>
                {regions.map((region) => (
                  <TouchableOpacity
                    key={region}
                    style={[
                      styles.chip,
                      filters.regions.includes(region) && styles.chipActive,
                    ]}
                    onPress={() => toggleArrayFilter('regions', region)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.regions.includes(region) && styles.chipTextActive,
                      ]}
                    >
                      {region}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Property Details Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('details')}
          >
            <Text style={styles.sectionTitle}>Property Details</Text>
            <Ionicons
              name={expandedSections.details ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#6B7280"
            />
          </TouchableOpacity>

          {expandedSections.details && (
            <View style={styles.sectionContent}>
              {/* Furnishing */}
              <Text style={styles.label}>Furnishing Status</Text>
              <View style={styles.chipsContainer}>
                {furnishingOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.chip,
                      filters.furnishing_status.includes(option.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleArrayFilter('furnishing_status', option.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.furnishing_status.includes(option.value) &&
                          styles.chipTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Property Age */}
              <Text style={styles.label}>Property Age</Text>
              <View style={styles.chipsContainer}>
                {propertyAgeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.chip,
                      filters.property_age.includes(option.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleArrayFilter('property_age', option.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.property_age.includes(option.value) && styles.chipTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Parking */}
              <Text style={styles.label}>Parking Type</Text>
              <View style={styles.chipsContainer}>
                {parkingOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.chip,
                      filters.parking_type.includes(option.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleArrayFilter('parking_type', option.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.parking_type.includes(option.value) && styles.chipTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Facing Direction */}
              <Text style={styles.label}>Facing Direction</Text>
              <View style={styles.chipsContainer}>
                {facingDirections.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.chip,
                      filters.facing_direction.includes(option.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleArrayFilter('facing_direction', option.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.facing_direction.includes(option.value) &&
                          styles.chipTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Possession */}
              <Text style={styles.label}>Possession Status</Text>
              <View style={styles.chipsContainer}>
                {possessionOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.chip,
                      filters.possession_status.includes(option.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleArrayFilter('possession_status', option.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.possession_status.includes(option.value) &&
                          styles.chipTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Amenities Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('amenities')}
          >
            <Text style={styles.sectionTitle}>Amenities</Text>
            <Ionicons
              name={expandedSections.amenities ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#6B7280"
            />
          </TouchableOpacity>

          {expandedSections.amenities && (
            <View style={styles.sectionContent}>
              <View style={styles.chipsContainer}>
                {amenitiesList.map((amenity) => (
                  <TouchableOpacity
                    key={amenity.value}
                    style={[
                      styles.chip,
                      filters.amenities.includes(amenity.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleArrayFilter('amenities', amenity.value)}
                  >
                    <Ionicons
                      name={amenity.icon}
                      size={16}
                      color={filters.amenities.includes(amenity.value) ? '#fff' : '#6B7280'}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        filters.amenities.includes(amenity.value) && styles.chipTextActive,
                      ]}
                    >
                      {amenity.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Verified Only */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setFilters({ ...filters, verified_only: !filters.verified_only })}
          >
            <View
              style={[styles.checkbox, filters.verified_only && styles.checkboxChecked]}
            >
              {filters.verified_only && (
                <Ionicons name="checkmark" size={18} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Show only verified properties</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>
            Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </Text>
        </TouchableOpacity>
      </View>
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
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  filterBadge: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  clearText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 12,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    gap: 4,
  },
  chipActive: {
    backgroundColor: '#2563EB',
  },
  chipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  chipTextActive: {
    color: '#fff',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#2563EB',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  buttonTextActive: {
    color: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  fullInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  separator: {
    fontSize: 16,
    color: '#6B7280',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 6,
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
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdvancedFiltersScreen;
