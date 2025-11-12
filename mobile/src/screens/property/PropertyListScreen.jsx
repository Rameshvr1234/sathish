import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchProperties,
  setFilters,
  resetFilters,
  fetchRegions,
  fetchLocationsByRegion,
} from '../../redux/slices/propertySlice';
import PropertyCard from '../../components/property/PropertyCard';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PropertyListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {properties, loading, error, filters, regions, locations} = useSelector(
    state => state.property,
  );

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchProperties(filters));
    dispatch(fetchRegions());
  }, [dispatch, filters]);

  const handleRegionChange = region => {
    dispatch(setFilters({region, location: ''}));
    if (region) {
      dispatch(fetchLocationsByRegion(region));
    }
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setFilterModalVisible(false);
  };

  const renderProperty = ({item}) => (
    <PropertyCard
      property={item}
      onPress={() => navigation.navigate('PropertyDetail', {id: item.id})}
    />
  );

  if (loading && properties.length === 0) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => dispatch(fetchProperties(filters))}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Button */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}>
          <Icon name="filter-variant" size={20} color="#fff" />
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
        <Text style={styles.resultCount}>{properties.length} properties</Text>
      </View>

      {/* Property List */}
      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={() => dispatch(fetchProperties(filters))}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="home-search" size={64} color="#d9d9d9" />
            <Text style={styles.emptyText}>No properties found</Text>
            <Button
              title="Reset Filters"
              onPress={handleResetFilters}
              variant="secondary"
              style={styles.emptyButton}
            />
          </View>
        }
      />

      {/* Filter Modal - Simplified for now */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}>
                <Icon name="close" size={24} color="#262626" />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterLabel}>Region</Text>
            <View style={styles.filterOptions}>
              {['coimbatore', 'salem', 'tirupur'].map(region => (
                <TouchableOpacity
                  key={region}
                  style={[
                    styles.filterChip,
                    filters.region === region && styles.filterChipActive,
                  ]}
                  onPress={() => handleRegionChange(region)}>
                  <Text
                    style={[
                      styles.filterChipText,
                      filters.region === region && styles.filterChipTextActive,
                    ]}>
                    {region.charAt(0).toUpperCase() + region.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Property Type</Text>
            <View style={styles.filterOptions}>
              {['Apartment', 'House', 'Plot', 'Commercial'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterChip,
                    filters.property_type === type && styles.filterChipActive,
                  ]}
                  onPress={() =>
                    dispatch(
                      setFilters({
                        property_type:
                          filters.property_type === type ? '' : type,
                      }),
                    )
                  }>
                  <Text
                    style={[
                      styles.filterChipText,
                      filters.property_type === type &&
                        styles.filterChipTextActive,
                    ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Reset"
                variant="secondary"
                onPress={handleResetFilters}
                style={{flex: 1}}
              />
              <Button
                title="Apply"
                onPress={() => setFilterModalVisible(false)}
                style={{flex: 1}}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1890ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultCount: {
    fontSize: 14,
    color: '#8c8c8c',
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#8c8c8c',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 150,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#262626',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
    marginTop: 16,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#fff',
  },
  filterChipActive: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
  },
  filterChipText: {
    fontSize: 14,
    color: '#595959',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
});

export default PropertyListScreen;
