import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchMyProperties,
  deleteProperty,
} from '../../redux/slices/propertySlice';
import PropertyCard from '../../components/property/PropertyCard';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../../components/common/Card';

const MyPropertiesScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {myProperties, loading, error} = useSelector(state => state.property);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchMyProperties());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMyProperties());
    setRefreshing(false);
  };

  const handleDelete = propertyId => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteProperty(propertyId)).unwrap();
              Alert.alert('Success', 'Property deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete property');
            }
          },
        },
      ],
    );
  };

  const getStatusBadge = status => {
    const statusConfig = {
      draft: {label: 'Draft', color: '#8c8c8c', bg: '#f0f0f0'},
      pending: {label: 'Pending Review', color: '#fa8c16', bg: '#fff7e6'},
      pending_super: {
        label: 'Under Review',
        color: '#1890ff',
        bg: '#e6f7ff',
      },
      approved: {label: 'Published', color: '#52c41a', bg: '#f6ffed'},
      rejected: {label: 'Rejected', color: '#ff4d4f', bg: '#fff1f0'},
      sold: {label: 'Sold', color: '#722ed1', bg: '#f9f0ff'},
      rented: {label: 'Rented', color: '#13c2c2', bg: '#e6fffb'},
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <View style={[styles.statusBadge, {backgroundColor: config.bg}]}>
        <Text style={[styles.statusText, {color: config.color}]}>
          {config.label}
        </Text>
      </View>
    );
  };

  const renderProperty = ({item}) => (
    <Card style={styles.propertyCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('PropertyDetail', {id: item.id})}>
        <PropertyCard property={item} />
      </TouchableOpacity>

      {/* Status Badge */}
      <View style={styles.propertyHeader}>
        {getStatusBadge(item.status)}
        {item.sv_verified && (
          <View style={styles.svBadge}>
            <Icon name="check-decagram" size={14} color="#52c41a" />
            <Text style={styles.svText}>SV Verified</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        {item.status === 'approved' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.markButton]}
              onPress={() => {
                Alert.alert(
                  'Mark as Sold/Rented',
                  'Choose status',
                  [
                    {
                      text: 'Sold',
                      onPress: () => {
                        // Dispatch mark as sold
                        Alert.alert('Success', 'Property marked as sold');
                      },
                    },
                    {
                      text: 'Rented',
                      onPress: () => {
                        // Dispatch mark as rented
                        Alert.alert('Success', 'Property marked as rented');
                      },
                    },
                    {text: 'Cancel', style: 'cancel'},
                  ],
                );
              }}>
              <Icon name="check-circle" size={18} color="#52c41a" />
              <Text style={styles.actionButtonText}>Mark as Sold/Rented</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.actionButtons}>
          {(item.status === 'draft' || item.status === 'rejected') && (
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() =>
                navigation.navigate('EditProperty', {id: item.id})
              }>
              <Icon name="pencil" size={18} color="#1890ff" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}>
            <Icon name="delete" size={18} color="#ff4d4f" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Icon name="eye" size={16} color="#8c8c8c" />
          <Text style={styles.statText}>{item.views || 0} views</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="phone" size={16} color="#8c8c8c" />
          <Text style={styles.statText}>{item.leads || 0} leads</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="calendar" size={16} color="#8c8c8c" />
          <Text style={styles.statText}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </Card>
  );

  if (loading && myProperties.length === 0) {
    return <Loading message="Loading your properties..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => dispatch(fetchMyProperties())}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{myProperties.length}</Text>
            <Text style={styles.summaryLabel}>Total Properties</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {myProperties.filter(p => p.status === 'approved').length}
            </Text>
            <Text style={styles.summaryLabel}>Published</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {myProperties.filter(p => ['pending', 'pending_super'].includes(p.status)).length}
            </Text>
            <Text style={styles.summaryLabel}>Under Review</Text>
          </View>
        </View>
      </Card>

      {/* Properties List */}
      <FlatList
        data={myProperties}
        renderItem={renderProperty}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="home-search" size={64} color="#d9d9d9" />
            <Text style={styles.emptyText}>No properties yet</Text>
            <Text style={styles.emptySubtext}>
              Start by adding your first property
            </Text>
            <Button
              title="Add Property"
              icon="plus"
              onPress={() => navigation.navigate('CreateProperty')}
              style={styles.emptyButton}
            />
          </View>
        }
      />

      {/* Floating Action Button */}
      {myProperties.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateProperty')}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    margin: 16,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1890ff',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8c8c8c',
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  propertyCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'visible',
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  svBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  svText: {
    fontSize: 12,
    color: '#52c41a',
    fontWeight: '600',
  },
  actionsRow: {
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
    flex: 1,
  },
  markButton: {
    backgroundColor: '#f6ffed',
    borderWidth: 1,
    borderColor: '#b7eb8f',
  },
  editButton: {
    backgroundColor: '#e6f7ff',
    borderWidth: 1,
    borderColor: '#91d5ff',
  },
  deleteButton: {
    backgroundColor: '#fff1f0',
    borderWidth: 1,
    borderColor: '#ffa39e',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#262626',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#8c8c8c',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#595959',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8c8c8c',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 150,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1890ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default MyPropertiesScreen;
