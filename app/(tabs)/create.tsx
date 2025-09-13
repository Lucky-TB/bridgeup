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
import { Camera, Image as ImageIcon, Mic, Video, Sparkles } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import Button from '@/components/ui/Button';
import ThemeChip from '@/components/ui/ThemeChip';
import { MediaService } from '@/lib/services/media-service';
import { AIMatchingService } from '@/lib/services/ai-matching-service';
import { useBridges } from '@/contexts/BridgeContext';
import { BridgeService } from '@/lib/services/bridge-service';

type Step = 'theme' | 'media' | 'preview';

export default function CreateScreen() {
  const { refreshBridges } = useBridges();
  const [currentStep, setCurrentStep] = useState<Step>('theme');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | 'audio' | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handleThemeToggle = (themeId: string) => {
    if (selectedThemes.includes(themeId)) {
      setSelectedThemes(selectedThemes.filter(id => id !== themeId));
    } else if (selectedThemes.length < 3) {
      setSelectedThemes([...selectedThemes, themeId]);
    }
  };

  const handlePickImage = async () => {
    const result = await MediaService.pickPhoto();
    if (result) {
      setMediaUri(result.uri);
      setMediaType(result.type);
    }
  };

  const handleTakePhoto = async () => {
    const result = await MediaService.takePhoto();
    if (result) {
      setMediaUri(result.uri);
      setMediaType(result.type);
    }
  };

  const handleRecordVideo = async () => {
    const result = await MediaService.recordVideo();
    if (result) {
      setMediaUri(result.uri);
      setMediaType(result.type);
    }
  };

  const handlePickVideo = async () => {
    const result = await MediaService.pickVideo();
    if (result) {
      setMediaUri(result.uri);
      setMediaType(result.type);
    }
  };

  const handleShowMediaOptions = async () => {
    const result = await MediaService.showMediaOptions();
    if (result) {
      setMediaUri(result.uri);
      setMediaType(result.type);
    }
  };

  const generateAISuggestions = async () => {
    if (selectedThemes.length === 0) {
      Alert.alert('Select Themes First', 'Please select themes before generating AI suggestions.');
      return;
    }

    setIsGeneratingAI(true);
    try {
      // Simulate AI text generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const suggestions = [
        `Share your ${selectedThemes[0]} experience from your perspective`,
        `What makes your ${selectedThemes[0]} story unique?`,
        `Describe a moment that changed your view on ${selectedThemes[0]}`,
        `What would you teach someone about ${selectedThemes[0]}?`,
      ];
      
      setAiSuggestions(suggestions);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate AI suggestions. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handlePost = async () => {
    if (!mediaUri || selectedThemes.length === 0) {
      Alert.alert('Missing Information', 'Please select themes and add media.');
      return;
    }

    // Validate media
    const validation = MediaService.validateMedia({ uri: mediaUri, type: mediaType! });
    if (!validation.valid) {
      Alert.alert('Invalid Media', validation.error || 'Please check your media file.');
      return;
    }

    setIsPosting(true);
    
    try {
      // Create snapshot
      const snapshot = await BridgeService.createSnapshot({
        userId: 'current_user_id', // In a real app, this would be the authenticated user's ID
        mediaType: mediaType === 'video' ? 'photo' : 'photo', // Simplified for demo
        mediaPath: mediaUri,
        text: text || 'No description provided',
        themes: selectedThemes,
        locale: 'en',
        pendingMatch: true,
      });

      // Create bridge with AI matching
      const bridge = await BridgeService.createBridgeFromSnapshot(snapshot);
      
      if (bridge) {
        // Refresh the bridges list
        await refreshBridges();
        
        Alert.alert(
          'Success!', 
          'Your snapshot has been matched and a new bridge has been created! Check the Bridges tab to see it.',
          [
            {
              text: 'View Bridges',
              onPress: () => {
                // In a real app, this would navigate to the bridges tab
                console.log('Navigate to bridges tab');
              }
            },
            { text: 'OK' }
          ]
        );
      } else {
        Alert.alert('Processing...', 'Your snapshot is being processed. A bridge will be created once we find a match!');
      }
      
      // Reset form
      setCurrentStep('theme');
      setSelectedThemes([]);
      setText('');
      setMediaUri(null);
      setMediaType(null);
      setAiSuggestions([]);
      
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create your post. Please try again.');
    } finally {
      setIsPosting(false);
    }
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
        Share a photo or video that captures your moment
      </Text>

      {mediaUri ? (
        <View style={styles.mediaPreview}>
          <Image source={{ uri: mediaUri }} style={styles.previewImage} />
          <View style={styles.mediaInfo}>
            <Text style={styles.mediaTypeText}>
              {mediaType === 'video' ? '📹 Video' : '📸 Photo'}
            </Text>
            <TouchableOpacity 
              style={styles.changeMediaButton}
              onPress={() => setMediaUri(null)}
            >
              <Text style={styles.changeMediaText}>Change</Text>
            </TouchableOpacity>
          </View>
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
          
          <TouchableOpacity style={styles.mediaOption} onPress={handleRecordVideo}>
            <Video size={32} color={theme.colors.primary} />
            <Text style={styles.mediaOptionText}>Record Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.mediaOption} onPress={handlePickVideo}>
            <Video size={32} color={theme.colors.primary} />
            <Text style={styles.mediaOptionText}>Choose Video</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.textInputContainer}>
        <View style={styles.textInputHeader}>
          <Text style={styles.textInputLabel}>Tell your story</Text>
          <TouchableOpacity 
            style={styles.aiButton}
            onPress={generateAISuggestions}
            disabled={isGeneratingAI}
          >
            <Sparkles size={16} color={theme.colors.primary} />
            <Text style={styles.aiButtonText}>
              {isGeneratingAI ? 'Generating...' : 'AI Help'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.textInput}
          placeholder="Share your cultural moment in a few words... (optional)"
          value={text}
          onChangeText={setText}
          maxLength={200}
          multiline
          numberOfLines={4}
        />
        <Text style={styles.characterCount}>{text.length}/200</Text>
        
        {aiSuggestions.length > 0 && (
          <View style={styles.aiSuggestions}>
            <Text style={styles.aiSuggestionsTitle}>AI Suggestions:</Text>
            {aiSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.aiSuggestionItem}
                onPress={() => setText(suggestion)}
              >
                <Text style={styles.aiSuggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
          title={isPosting ? "Creating..." : "Post"}
          onPress={handlePost}
          disabled={isPosting}
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
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  mediaOption: {
    width: '48%',
    alignItems: 'center',
    padding: theme.spacing.lg,
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
    textAlign: 'center',
  },
  mediaPreview: {
    marginBottom: theme.spacing.xl,
  },
  previewImage: {
    width: '100%',
    height: 240,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
  },
  mediaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mediaTypeText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontWeight.medium,
  },
  changeMediaButton: {
    padding: theme.spacing.sm,
  },
  changeMediaText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  textInputContainer: {
    marginBottom: theme.spacing.xl,
  },
  textInputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  textInputLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.sm,
  },
  aiButtonText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
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
  aiSuggestions: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary + '05',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + '20',
  },
  aiSuggestionsTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  aiSuggestionItem: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  aiSuggestionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.fontSize.sm * 1.4,
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