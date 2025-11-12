import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const imagePickerOptions = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 1200,
};

export const pickImageFromGallery = async (multiple = false) => {
  const result = await launchImageLibrary({
    ...imagePickerOptions,
    selectionLimit: multiple ? 5 : 1,
  });

  if (!result.didCancel && !result.error) {
    return multiple ? result.assets : result.assets[0];
  }
  return null;
};

export const takePhoto = async () => {
  const result = await launchCamera(imagePickerOptions);

  if (!result.didCancel && !result.error) {
    return result.assets[0];
  }
  return null;
};

export const uploadImage = async (imageAsset, api) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageAsset.uri,
    type: imageAsset.type || 'image/jpeg',
    name: imageAsset.fileName || 'photo.jpg',
  });

  try {
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url;
  } catch (error) {
    throw new Error('Failed to upload image');
  }
};
