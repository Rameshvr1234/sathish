import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  createProperty,
  fetchRegions,
  fetchLocationsByRegion,
} from '../../redux/slices/propertySlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {pickImageFromGallery, takePhoto} from '../../utils/imagePicker';

const CreatePropertyScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading, regions, locations} = useSelector(state => state.property);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'Apartment',
    purpose: 'Sale',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    region: '',
    location: '',
    address: '',
    owner_type: 'owner',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  useEffect(() => {
    if (formData.region) {
      dispatch(fetchLocationsByRegion(formData.region));
    }
  }, [formData.region, dispatch]);

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Plot', 'Commercial', 'Agricultural'];
  const purposes = ['Sale', 'Rent'];
  const ownerTypes = [
    {value: 'owner', label: 'Owner'},
    {value: 'agent', label: 'Agent'},
  ];

  const handleImagePicker = () => {
    Alert.alert('Add Photos', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const photo = await takePhoto();
          if (photo) {
            setImages([...images, photo]);
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const photos = await pickImageFromGallery(true);
          if (photos) {
            setImages([...images, ...photos]);
          }
        },
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const removeImage = index => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.area) newErrors.area = 'Area is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.contact_name) newErrors.contact_name = 'Contact name is required';
    if (!formData.contact_phone) newErrors.contact_phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.contact_phone))
      newErrors.contact_phone = 'Phone must be 10 digits';
    if (!formData.contact_email) newErrors.contact_email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.contact_email))
      newErrors.contact_email = 'Email is invalid';

    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    try {
      // In a real app, you would upload images first and get URLs
      const propertyData = {
        ...formData,
        price: parseInt(formData.price),
        area: parseInt(formData.area),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        images: images.map(img => img.uri), // In production, upload and use URLs
      };

      await dispatch(createProperty(propertyData)).unwrap();

      Alert.alert(
        'Success',
        'Property listing created successfully! It will be reviewed by admin.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MyProperties'),
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create property');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <Input
            label="Property Title *"
            value={formData.title}
            onChangeText={text => setFormData({...formData, title: text})}
            placeholder="e.g., 3 BHK Apartment in Coimbatore"
            icon="home"
            error={errors.title}
          />

          <Input
            label="Description *"
            value={formData.description}
            onChangeText={text => setFormData({...formData, description: text})}
            placeholder="Describe your property..."
            icon="text"
            multiline
            numberOfLines={4}
            error={errors.description}
          />

          {/* Property Type */}
          <Text style={styles.label}>Property Type *</Text>
          <View style={styles.chipsContainer}>
            {propertyTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  formData.property_type === type && styles.chipSelected,
                ]}
                onPress={() => setFormData({...formData, property_type: type})}>
                <Text
                  style={[
                    styles.chipText,
                    formData.property_type === type && styles.chipTextSelected,
                  ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Purpose */}
          <Text style={styles.label}>Purpose *</Text>
          <View style={styles.chipsContainer}>
            {purposes.map(purpose => (
              <TouchableOpacity
                key={purpose}
                style={[
                  styles.chip,
                  formData.purpose === purpose && styles.chipSelected,
                ]}
                onPress={() => setFormData({...formData, purpose})}>
                <Text
                  style={[
                    styles.chipText,
                    formData.purpose === purpose && styles.chipTextSelected,
                  ]}>
                  For {purpose}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Property Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>

          <Input
            label="Price (₹) *"
            value={formData.price}
            onChangeText={text => setFormData({...formData, price: text})}
            placeholder="Enter price in rupees"
            icon="currency-inr"
            keyboardType="numeric"
            error={errors.price}
          />

          <Input
            label="Area (sq.ft) *"
            value={formData.area}
            onChangeText={text => setFormData({...formData, area: text})}
            placeholder="Enter area in square feet"
            icon="ruler-square"
            keyboardType="numeric"
            error={errors.area}
          />

          <View style={styles.row}>
            <Input
              label="Bedrooms"
              value={formData.bedrooms}
              onChangeText={text => setFormData({...formData, bedrooms: text})}
              placeholder="BHK"
              icon="bed"
              keyboardType="numeric"
              style={styles.halfInput}
            />
            <Input
              label="Bathrooms"
              value={formData.bathrooms}
              onChangeText={text => setFormData({...formData, bathrooms: text})}
              placeholder="Number"
              icon="shower"
              keyboardType="numeric"
              style={styles.halfInput}
            />
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>

          <Text style={styles.label}>Region *</Text>
          <View style={styles.chipsContainer}>
            {['coimbatore', 'salem', 'tirupur'].map(region => (
              <TouchableOpacity
                key={region}
                style={[
                  styles.chip,
                  formData.region === region && styles.chipSelected,
                ]}
                onPress={() => setFormData({...formData, region, location: ''})}>
                <Text
                  style={[
                    styles.chipText,
                    formData.region === region && styles.chipTextSelected,
                  ]}>
                  {region.charAt(0).toUpperCase() + region.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.region && (
            <Text style={styles.errorText}>{errors.region}</Text>
          )}

          {locations.length > 0 && (
            <>
              <Text style={styles.label}>Location *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.locationsScroll}>
                {locations.map(loc => (
                  <TouchableOpacity
                    key={loc}
                    style={[
                      styles.chip,
                      formData.location === loc && styles.chipSelected,
                    ]}
                    onPress={() => setFormData({...formData, location: loc})}>
                    <Text
                      style={[
                        styles.chipText,
                        formData.location === loc && styles.chipTextSelected,
                      ]}>
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {errors.location && (
                <Text style={styles.errorText}>{errors.location}</Text>
              )}
            </>
          )}

          <Input
            label="Full Address *"
            value={formData.address}
            onChangeText={text => setFormData({...formData, address: text})}
            placeholder="Enter complete address"
            icon="map-marker"
            multiline
            numberOfLines={3}
            error={errors.address}
          />
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Photos *</Text>
          <Text style={styles.subtitle}>Add at least one photo</Text>

          <View style={styles.photosGrid}>
            {images.map((image, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{uri: image.uri}} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => removeImage(index)}>
                  <Icon name="close-circle" size={24} color="#ff4d4f" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 5 && (
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={handleImagePicker}>
                <Icon name="camera-plus" size={32} color="#8c8c8c" />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
          {errors.images && (
            <Text style={styles.errorText}>{errors.images}</Text>
          )}
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <Text style={styles.label}>I am *</Text>
          <View style={styles.chipsContainer}>
            {ownerTypes.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.chip,
                  formData.owner_type === type.value && styles.chipSelected,
                ]}
                onPress={() =>
                  setFormData({...formData, owner_type: type.value})
                }>
                <Text
                  style={[
                    styles.chipText,
                    formData.owner_type === type.value &&
                      styles.chipTextSelected,
                  ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Contact Name *"
            value={formData.contact_name}
            onChangeText={text =>
              setFormData({...formData, contact_name: text})
            }
            placeholder="Your name"
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
            placeholder="Your email"
            icon="email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.contact_email}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <Button
            title="Submit Property for Review"
            onPress={handleSubmit}
            loading={loading}
            icon="check-circle"
            size="large"
          />
          <Text style={styles.submitNote}>
            Your property will be reviewed and published within 24-48 hours
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
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8c8c8c',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 8,
    marginTop: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
  },
  chipText: {
    fontSize: 14,
    color: '#595959',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  locationsScroll: {
    marginBottom: 8,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d9d9d9',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  addPhotoText: {
    fontSize: 12,
    color: '#8c8c8c',
    marginTop: 4,
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

export default CreatePropertyScreen;
