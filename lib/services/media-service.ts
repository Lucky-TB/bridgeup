import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { Alert, Platform } from 'react-native';

export interface MediaResult {
  uri: string;
  type: 'photo' | 'video';
  duration?: number;
  size?: number;
  width?: number;
  height?: number;
}

export class MediaService {
  /**
   * Request camera permissions
   */
  static async requestCameraPermissions(): Promise<boolean> {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  }

  /**
   * Request media library permissions
   */
  static async requestMediaLibraryPermissions(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      return false;
    }
  }

  /**
   * Take a photo using the camera
   */
  static async takePhoto(): Promise<MediaResult | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to take photos for your bridges.'
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: false,
      });

      if (result.canceled) {
        return null;
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        type: 'photo',
        width: asset.width,
        height: asset.height,
        size: asset.fileSize,
      };
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      return null;
    }
  }

  /**
   * Record a video using the camera
   */
  static async recordVideo(): Promise<MediaResult | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to record videos for your bridges.'
        );
        return null;
      }

      // For demo purposes, show coming soon alert
      Alert.alert(
        'Video Recording',
        'Video recording is coming soon! For now, you can use photos to create your bridges.',
        [{ text: 'OK' }]
      );

      // In a real implementation, you would use:
      // const result = await ImagePicker.launchCameraAsync({
      //   mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      //   allowsEditing: true,
      //   quality: 0.8,
      //   videoMaxDuration: 30, // 30 seconds max
      // });

      return null;
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video. Please try again.');
      return null;
    }
  }

  /**
   * Pick a photo from the gallery
   */
  static async pickPhoto(): Promise<MediaResult | null> {
    try {
      const hasPermission = await this.requestMediaLibraryPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Photo Library Permission Required',
          'Please allow photo library access to select photos for your bridges.'
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: false,
      });

      if (result.canceled) {
        return null;
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        type: 'photo',
        width: asset.width,
        height: asset.height,
        size: asset.fileSize,
      };
    } catch (error) {
      console.error('Error picking photo:', error);
      Alert.alert('Error', 'Failed to pick photo. Please try again.');
      return null;
    }
  }

  /**
   * Pick a video from the gallery
   */
  static async pickVideo(): Promise<MediaResult | null> {
    try {
      const hasPermission = await this.requestMediaLibraryPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Photo Library Permission Required',
          'Please allow photo library access to select videos for your bridges.'
        );
        return null;
      }

      // For demo purposes, show coming soon alert
      Alert.alert(
        'Video Selection',
        'Video selection is coming soon! For now, you can use photos to create your bridges.',
        [{ text: 'OK' }]
      );

      // In a real implementation, you would use:
      // const result = await ImagePicker.launchImageLibraryAsync({
      //   mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      //   allowsEditing: true,
      //   quality: 0.8,
      //   videoMaxDuration: 30,
      // });

      return null;
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video. Please try again.');
      return null;
    }
  }

  /**
   * Show media selection options
   */
  static async showMediaOptions(): Promise<MediaResult | null> {
    return new Promise((resolve) => {
      Alert.alert(
        'Add Media',
        'Choose how you want to add media to your bridge',
        [
          {
            text: 'Take Photo',
            onPress: async () => {
              const result = await this.takePhoto();
              resolve(result);
            },
          },
          {
            text: 'Choose Photo',
            onPress: async () => {
              const result = await this.pickPhoto();
              resolve(result);
            },
          },
          {
            text: 'Record Video',
            onPress: async () => {
              const result = await this.recordVideo();
              resolve(result);
            },
          },
          {
            text: 'Choose Video',
            onPress: async () => {
              const result = await this.pickVideo();
              resolve(result);
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ],
        { cancelable: true, onDismiss: () => resolve(null) }
      );
    });
  }

  /**
   * Validate media file
   */
  static validateMedia(media: MediaResult): { valid: boolean; error?: string } {
    if (!media.uri) {
      return { valid: false, error: 'No media selected' };
    }

    if (media.type === 'video' && media.duration && media.duration > 30) {
      return { valid: false, error: 'Video must be 30 seconds or less' };
    }

    if (media.size && media.size > 50 * 1024 * 1024) { // 50MB limit
      return { valid: false, error: 'File size must be less than 50MB' };
    }

    return { valid: true };
  }

  /**
   * Get media type from URI
   */
  static getMediaTypeFromUri(uri: string): 'photo' | 'video' {
    const extension = uri.split('.').pop()?.toLowerCase();
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
    return videoExtensions.includes(extension || '') ? 'video' : 'photo';
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get media dimensions for display
   */
  static getMediaDimensions(media: MediaResult): { width: number; height: number } {
    if (media.width && media.height) {
      return { width: media.width, height: media.height };
    }
    
    // Default aspect ratio for unknown dimensions
    return { width: 400, height: 300 };
  }

  /**
   * Check if device supports camera
   */
  static async isCameraAvailable(): Promise<boolean> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      return hasPermission;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get camera quality options
   */
  static getQualityOptions() {
    return [
      { label: 'High Quality', value: 1.0 },
      { label: 'Medium Quality', value: 0.8 },
      { label: 'Low Quality', value: 0.6 },
    ];
  }

  /**
   * Get supported media types
   */
  static getSupportedMediaTypes() {
    return {
      photos: ['jpg', 'jpeg', 'png', 'webp'],
      videos: ['mp4', 'mov', 'avi'],
    };
  }
}
