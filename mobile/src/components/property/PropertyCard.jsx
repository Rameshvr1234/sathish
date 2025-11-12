import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../common/Card';

const PropertyCard = ({property, onPress, onSave}) => {
  const formatPrice = price => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Image
        source={{
          uri: property.images?.[0] || 'https://via.placeholder.com/300',
        }}
        style={styles.image}
        resizeMode="cover"
      />

      {property.sv_verified && (
        <View style={styles.verifiedBadge}>
          <Icon name="check-decagram" size={16} color="#fff" />
          <Text style={styles.verifiedText}>SV Verified</Text>
        </View>
      )}

      {onSave && (
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Icon name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {property.title}
        </Text>

        <View style={styles.locationRow}>
          <Icon name="map-marker" size={16} color="#8c8c8c" />
          <Text style={styles.location} numberOfLines={1}>
            {property.location}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(property.price)}</Text>
            <Text style={styles.purpose}>For {property.purpose}</Text>
          </View>
          <Text style={styles.area}>{property.area} sq.ft</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{property.property_type}</Text>
          </View>
          {property.owner_type === 'owner' && (
            <View style={[styles.tag, styles.ownerTag]}>
              <Text style={styles.ownerTagText}>Owner</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#52c41a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#8c8c8c',
    marginLeft: 4,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1890ff',
  },
  purpose: {
    fontSize: 12,
    color: '#8c8c8c',
    marginTop: 2,
  },
  area: {
    fontSize: 14,
    color: '#595959',
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#595959',
  },
  ownerTag: {
    backgroundColor: '#e6f7ff',
  },
  ownerTagText: {
    fontSize: 12,
    color: '#1890ff',
  },
});

export default PropertyCard;
