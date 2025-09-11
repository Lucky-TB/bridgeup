import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Camera, Image as ImageIcon, Mic } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '@/constants/theme';
import Button from '@/components/ui/Button';
import ThemeChip from '@/components/ui/ThemeChip';

type Step = 'theme' | 'media' | 'preview';

export default function CreateScreen() {
  const [currentStep, setCurrentStep] = useState<Step>('theme');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'audio' | null>(null);

  const handleThemeToggle = (themeId: string) => {
    if (selectedThemes.includes(themeId)) {
      setSelectedThemes(selectedThemes.filter(id => id !== themeId));
    } else if (selectedThemes.length < 3) {
      setSelectedThemes([...selectedThemes, themeId]);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
      setMediaType('photo');
    }
  };

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
      setMediaType('photo');
    }
  };

  const handlePost = async () => {
    if (!mediaUri || selectedThemes.length === 0) {
      Alert.alert('Missing Information', 'Please select themes and add media.');
      return;
    }

    // In a real app, this would upload to Firebase Storage and create a snapshot
    Alert.alert('Success!', 'Your snapshot is being matched with someone new.');
    
    // Reset form
    setCurrentStep('theme');
    setSelectedThemes([]);
    setText('');
    setMediaUri(null);
    setMediaType(null);
  };

  const renderThemeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose your themes</Text>
      <Text style={styles.stepSubtitle}>
        Select up to 3 themes that describe your snapshot
      </Text>
      
      <View style={styles.themesGrid}>
        {theme.themes.map((t) => (
          <ThemeChip
            key={t.id}
            label={t.label}
            emoji={t.emoji}
            selected={selectedThemes.includes(t.id)}
            onPress={() => handleThemeToggle(t.id)}
            style={styles.themeGridItem}
          />
        ))}
      </View>

      <Button
        title="Continue"
        onPress={() => setCurrentStep('media')}
        disabled={selectedThemes.length === 0}
        style={styles.continueButton}
      />
    </View>
  );

  const renderMediaStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Add your snapshot</Text>
      <Text style={styles.stepSubtitle}>
        Share a photo that captures your moment
      </Text>

      {mediaUri ? (
        <View style={styles.mediaPreview}>
          <Image source={{ uri: mediaUri }} style={styles.previewImage} />
          <TouchableOpacity 
            style={styles.changeMediaButton}
            onPress={() => setMediaUri(null)}
          >
            <Text style={styles.changeMediaText}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mediaOptions}>
          <TouchableOpacity style={styles.mediaOption} onPress={handleTakePhoto}>
            <Camera size={32} color={theme.colors.primary} />
            <Text style={styles.mediaOptionText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.mediaOption} onPress={handlePickImage}>
            <ImageIcon size={32} color={theme.colors.primary} />
            <Text style={styles.mediaOptionText}>Choose Photo</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Tell your story in a few words... (optional)"
          value={text}
          onChangeText={setText}
          maxLength={200}
          multiline
          numberOfLines={4}
        />
        <Text style={styles.characterCount}>{text.length}/200</Text>
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          variant="ghost"
          onPress={() => setCurrentStep('theme')}
          style={styles.backButton}
        />
        <Button
          title="Preview"
          onPress={() => setCurrentStep('preview')}
          disabled={!mediaUri}
          style={styles.previewButton}
        />
      </View>
    </View>
  );

  const renderPreviewStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Preview your snapshot</Text>
      <Text style={styles.stepSubtitle}>
        This is how others will see your contribution
      </Text>

      <View style={styles.previewCard}>
        <View style={styles.previewThemes}>
          {selectedThemes.map((themeId) => {
            const t = theme.themes.find(theme => theme.id === themeId);
            return t ? (
              <ThemeChip key={themeId} label={t.label} emoji={t.emoji} />
            ) : null;
          })}
        </View>
        
        {mediaUri && (
          <Image source={{ uri: mediaUri }} style={styles.previewCardImage} />
        )}
        
        {text ? (
          <Text style={styles.previewText}>{text}</Text>
        ) : null}
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          variant="ghost"
          onPress={() => setCurrentStep('media')}
          style={styles.backButton}
        />
        <Button
          title="Post"
          onPress={handlePost}
          style={styles.postButton}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create</Text>
        <View style={styles.progress}>
          <View style={[styles.progressDot, currentStep !== 'theme' && styles.progressDotActive]} />
          <View style={[styles.progressDot, currentStep === 'preview' && styles.progressDotActive]} />
          <View style={[styles.progressDot, currentStep === 'preview' && styles.progressDotActive]} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {currentStep === 'theme' && renderThemeStep()}
        {currentStep === 'media' && renderMediaStep()}
        {currentStep === 'preview' && renderPreviewStep()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  progress: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  progressDotActive: {
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: theme.spacing.lg,
  },
  stepTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  stepSubtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing['2xl'],
  },
  themeGridItem: {
    marginBottom: theme.spacing.sm,
  },
  continueButton: {
    marginTop: theme.spacing.lg,
  },
  mediaOptions: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  mediaOption: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  mediaOptionText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  mediaPreview: {
    marginBottom: theme.spacing.xl,
  },
  previewImage: {
    width: '100%',
    height: 240,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  changeMediaButton: {
    alignSelf: 'center',
  },
  changeMediaText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  textInputContainer: {
    marginBottom: theme.spacing.xl,
  },
  textInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    fontSize: theme.fontSize.base,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  characterCount: {
    textAlign: 'right',
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.muted,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  backButton: {
    flex: 1,
  },
  previewButton: {
    flex: 2,
  },
  postButton: {
    flex: 2,
  },
  previewCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  previewThemes: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  previewCardImage: {
    width: '100%',
    height: 240,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  previewText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.primary,
    lineHeight: theme.fontSize.base * 1.4,
  },
});