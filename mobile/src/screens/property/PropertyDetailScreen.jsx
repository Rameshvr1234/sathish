import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {fetchPropertyById} from '../../redux/slices/propertySlice';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

const PropertyDetailScreen = ({route}) => {
  const {id} = route.params;
  const dispatch = useDispatch();
  const {currentProperty: property} = useSelector(state => state.property);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchPropertyById(id));
  }, [dispatch, id]);

  if (!property) {
    return <Loading />;
  }

  const formatPrice = price => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Crore`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lakh`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const handleCall = () => {
    if (property.contact_phone) {
      Linking.openURL(`tel:${property.contact_phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (property.contact_phone) {
      const message = `Hi, I'm interested in your property: ${property.title}`;
      Linking.openURL(
        `whatsapp://send?phone=91${property.contact_phone}&text=${encodeURIComponent(
          message,
        )}`,
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Images */}
        <View style={styles.imagesContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={e => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / width,
              );
              setActiveImageIndex(index);
            }}
            scrollEventThrottle={16}>
            {property.images?.map((image, index) => (
              <Image
                key={index}
                source={{uri: image}}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {property.images?.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Price and Title */}
          <View style={styles.header}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatPrice(property.price)}</Text>
              <Text style={styles.purpose}>For {property.purpose}</Text>
            </View>
            {property.sv_verified && (
              <View style={styles.verifiedBadge}>
                <Icon name="check-decagram" size={16} color="#fff" />
                <Text style={styles.verifiedText}>SV Verified</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{property.title}</Text>

          <View style={styles.locationRow}>
            <Icon name="map-marker" size={20} color="#8c8c8c" />
            <Text style={styles.location}>{property.location}</Text>
          </View>

          {/* Key Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <Icon name="ruler-square" size={24} color="#1890ff" />
              <Text style={styles.detailValue}>{property.area} sq.ft</Text>
              <Text style={styles.detailLabel}>Area</Text>
            </View>
            <View style={styles.detailCard}>
              <Icon name="home-variant" size={24} color="#1890ff" />
              <Text style={styles.detailValue}>{property.property_type}</Text>
              <Text style={styles.detailLabel}>Type</Text>
            </View>
            {property.bedrooms && (
              <View style={styles.detailCard}>
                <Icon name="bed" size={24} color="#1890ff" />
                <Text style={styles.detailValue}>{property.bedrooms} BHK</Text>
                <Text style={styles.detailLabel}>Bedrooms</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          {/* Owner Info */}
          {property.owner && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.ownerCard}>
                <View style={styles.ownerInfo}>
                  <Icon name="account" size={24} color="#1890ff" />
                  <View style={styles.ownerDetails}>
                    <Text style={styles.ownerName}>{property.owner.name}</Text>
                    <Text style={styles.ownerType}>
                      {property.owner_type === 'owner' ? 'Owner' : 'Agent'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Icon name="phone" size={24} color="#1890ff" />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleWhatsApp}>
          <Icon name="whatsapp" size={24} color="#25D366" />
          <Text style={styles.actionButtonText}>WhatsApp</Text>
        </TouchableOpacity>
        <Button
          title="Book Site Visit"
          style={styles.bookButton}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imagesContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: width,
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1890ff',
  },
  purpose: {
    fontSize: 14,
    color: '#8c8c8c',
    marginTop: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#52c41a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 16,
    color: '#8c8c8c',
    marginLeft: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#8c8c8c',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#595959',
    lineHeight: 24,
  },
  ownerCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerDetails: {
    marginLeft: 12,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
  },
  ownerType: {
    fontSize: 14,
    color: '#8c8c8c',
    marginTop: 2,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#fff',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#595959',
    marginTop: 4,
  },
  bookButton: {
    flex: 1,
  },
});

export default PropertyDetailScreen;
