import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {fetchProperties} from '../../redux/slices/propertySlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropertyCard from '../../components/property/PropertyCard';
import Button from '../../components/common/Button';

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const {properties} = useSelector(state => state.property);

  useEffect(() => {
    dispatch(fetchProperties({limit: 5}));
  }, [dispatch]);

  const services = [
    {
      id: 'survey',
      title: 'Survey',
      icon: 'map-marker-radius',
      color: '#52c41a',
      screen: 'ServiceBooking',
      params: {type: 'survey'},
    },
    {
      id: 'legal',
      title: 'Legal',
      icon: 'file-document',
      color: '#1890ff',
      screen: 'ServiceBooking',
      params: {type: 'legal'},
    },
    {
      id: 'construction',
      title: 'Construction',
      icon: 'hammer-wrench',
      color: '#fa8c16',
      screen: 'ServiceBooking',
      params: {type: 'construction'},
    },
    {
      id: 'finance',
      title: 'Finance',
      icon: 'currency-inr',
      color: '#722ed1',
      screen: 'ServiceBooking',
      params: {type: 'finance'},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.greeting}>Welcome{user?.name && `, ${user.name}`}!</Text>
          <Text style={styles.heroTitle}>Find Your Dream Property</Text>
          <Text style={styles.heroSubtitle}>
            Browse through thousands of properties
          </Text>
          <Button
            title="Explore Properties"
            icon="magnify"
            onPress={() => navigation.navigate('Properties')}
            style={styles.heroButton}
          />
        </View>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <View style={styles.servicesGrid}>
          {services.map(service => (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, {backgroundColor: service.color}]}
              onPress={() => navigation.navigate(service.screen, service.params)}>
              <Icon name={service.icon} size={32} color="#fff" />
              <Text style={styles.serviceTitle}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Properties */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Properties</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Properties')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {properties.slice(0, 3).map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            onPress={() =>
              navigation.navigate('PropertyDetail', {id: property.id})
            }
          />
        ))}
      </View>

      {/* Quick Actions */}
      {user?.role === 'seller' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('CreateProperty')}>
            <Icon name="plus-circle" size={24} color="#1890ff" />
            <Text style={styles.actionText}>Post New Property</Text>
            <Icon name="chevron-right" size={24} color="#8c8c8c" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('MyProperties')}>
            <Icon name="home-city" size={24} color="#1890ff" />
            <Text style={styles.actionText}>My Properties</Text>
            <Icon name="chevron-right" size={24} color="#8c8c8c" />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  hero: {
    backgroundColor: '#1890ff',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 8,
    textAlign: 'center',
  },
  heroButton: {
    marginTop: 24,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#262626',
  },
  seeAll: {
    fontSize: 14,
    color: '#1890ff',
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
    marginLeft: 12,
  },
});

export default HomeScreen;
