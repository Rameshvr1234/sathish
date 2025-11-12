import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import {storage} from '../../utils/storage';
import {useDispatch} from 'react-redux';
import {fetchPropertyById} from '../../redux/slices/propertySlice';
import PropertyCard from '../../components/property/PropertyCard';
import Loading from '../../components/common/Loading';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/common/Button';

const SavedPropertiesScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      const savedIds = await storage.getSavedProperties();

      // Fetch full property details for each saved ID
      const properties = await Promise.all(
        savedIds.map(async id => {
          try {
            const result = await dispatch(fetchPropertyById(id)).unwrap();
            return result;
          } catch (error) {
            console.error(`Failed to load property ${id}:`, error);
            return null;
          }
        }),
      );

      // Filter out null values (failed fetches)
      setSavedProperties(properties.filter(p => p !== null));
    } catch (error) {
      console.error('Failed to load saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async propertyId => {
    Alert.alert(
      'Remove from Saved',
      'Are you sure you want to remove this property from your saved list?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await storage.unsaveProperty(propertyId);
            setSavedProperties(prev => prev.filter(p => p.id !== propertyId));
          },
        },
      ],
    );
  };

  const renderProperty = ({item}) => (
    <View style={styles.propertyContainer}>
      <PropertyCard
        property={item}
        onPress={() => navigation.navigate('PropertyDetail', {id: item.id})}
      />
      <Button
        title="Remove from Saved"
        variant="secondary"
        size="small"
        icon="heart-off"
        onPress={() => handleUnsave(item.id)}
        style={styles.unsaveButton}
      />
    </View>
  );

  if (loading) {
    return <Loading message="Loading saved properties..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedProperties}
        renderItem={renderProperty}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="heart-outline" size={64} color="#d9d9d9" />
            <Text style={styles.emptyText}>No saved properties</Text>
            <Text style={styles.emptySubtext}>
              Save properties you like to view them later
            </Text>
            <Button
              title="Browse Properties"
              onPress={() => navigation.navigate('Properties')}
              style={styles.emptyButton}
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  propertyContainer: {
    marginBottom: 16,
  },
  unsaveButton: {
    marginTop: 8,
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
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 150,
  },
});

export default SavedPropertiesScreen;
