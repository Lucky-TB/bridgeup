import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { ArrowRight, ArrowLeft, Check, MapPin, Heart, BookOpen, Music, Camera, Globe } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';
import Button from '@/components/ui/Button';
import ThemeChip from '@/components/ui/ThemeChip';

const { width } = Dimensions.get('window');

interface OnboardingData {
  name: string;
  location: string;
  interests: string[];
  skills: string[];
  preferredThemes: string[];
}

type Step = 'welcome' | 'name' | 'location' | 'interests' | 'skills' | 'themes' | 'complete';

const INTERESTS = [
  { id: 'cooking', label: 'Cooking', emoji: '👨‍🍳' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'art', label: 'Art & Design', emoji: '🎨' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'languages', label: 'Languages', emoji: '🗣️' },
  { id: 'photography', label: 'Photography', emoji: '📸' },
  { id: 'reading', label: 'Reading', emoji: '📚' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
];

const SKILLS = [
  { id: 'teaching', label: 'Teaching', emoji: '👨‍🏫' },
  { id: 'cooking', label: 'Cooking', emoji: '🍳' },
  { id: 'music', label: 'Music', emoji: '🎸' },
  { id: 'languages', label: 'Languages', emoji: '🗣️' },
  { id: 'photography', label: 'Photography', emoji: '📷' },
  { id: 'art', label: 'Art & Crafts', emoji: '🎨' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'technology', label: 'Tech Skills', emoji: '💻' },
  { id: 'writing', label: 'Writing', emoji: '✍️' },
  { id: 'dancing', label: 'Dancing', emoji: '💃' },
  { id: 'gardening', label: 'Gardening', emoji: '🌱' },
  { id: 'repair', label: 'Repair & DIY', emoji: '🔧' },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [data, setData] = useState<OnboardingData>({
    name: '',
    location: '',
    interests: [],
    skills: [],
    preferredThemes: [],
  });

  const steps: Step[] = ['welcome', 'name', 'location', 'interests', 'skills', 'themes', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = (currentStepIndex / (steps.length - 1)) * 100;

  const handleNext = () => {
    if (Haptics.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentStep === 'welcome') {
      setCurrentStep('name');
    } else if (currentStep === 'name') {
      if (!data.name.trim()) {
        Alert.alert('Name Required', 'Please enter your name to continue.');
        return;
      }
      setCurrentStep('location');
    } else if (currentStep === 'location') {
      if (!data.location.trim()) {
        Alert.alert('Location Required', 'Please enter your location to continue.');
        return;
      }
      setCurrentStep('interests');
    } else if (currentStep === 'interests') {
      if (data.interests.length === 0) {
        Alert.alert('Interests Required', 'Please select at least one interest to continue.');
        return;
      }
      setCurrentStep('skills');
    } else if (currentStep === 'skills') {
      if (data.skills.length === 0) {
        Alert.alert('Skills Required', 'Please select at least one skill to continue.');
        return;
      }
      setCurrentStep('themes');
    } else if (currentStep === 'themes') {
      if (data.preferredThemes.length === 0) {
        Alert.alert('Themes Required', 'Please select at least one theme to continue.');
        return;
      }
      setCurrentStep('complete');
    } else if (currentStep === 'complete') {
      // Navigate to main app
      Alert.alert('Welcome to BridgeUp!', 'Your profile has been created successfully!');
    }
  };

  const handleBack = () => {
    if (Haptics.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const toggleInterest = (interestId: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const toggleSkill = (skillId: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(id => id !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  const toggleTheme = (themeId: string) => {
    setData(prev => ({
      ...prev,
      preferredThemes: prev.preferredThemes.includes(themeId)
        ? prev.preferredThemes.filter(id => id !== themeId)
        : [...prev.preferredThemes, themeId]
    }));
  };

  const renderWelcome = () => (
    <View style={styles.stepContainer}>
      <View style={styles.welcomeContent}>
        <View style={styles.welcomeIcon}>
          <Globe size={80} color={theme.colors.primary} />
        </View>
        <Text style={styles.welcomeTitle}>Welcome to BridgeUp</Text>
        <Text style={styles.welcomeSubtitle}>
          Create meaningful connections through cultural snapshots and skill exchanges
        </Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Heart size={20} color={theme.colors.primary} />
            <Text style={styles.featureText}>Connect with people worldwide</Text>
          </View>
          <View style={styles.featureItem}>
            <Camera size={20} color={theme.colors.primary} />
            <Text style={styles.featureText}>Share your cultural moments</Text>
          </View>
          <View style={styles.featureItem}>
            <BookOpen size={20} color={theme.colors.primary} />
            <Text style={styles.featureText}>Learn new skills and perspectives</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderName = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your name?</Text>
      <Text style={styles.stepSubtitle}>This will be displayed on your bridges</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your name"
          value={data.name}
          onChangeText={(text) => setData(prev => ({ ...prev, name: text }))}
          autoFocus
          returnKeyType="next"
          onSubmitEditing={handleNext}
        />
      </View>
    </View>
  );

  const renderLocation = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Where are you from?</Text>
      <Text style={styles.stepSubtitle}>Help others discover your cultural background</Text>
      
      <View style={styles.inputContainer}>
        <MapPin size={20} color={theme.colors.text.secondary} style={styles.inputIcon} />
        <TextInput
          style={[styles.textInput, styles.textInputWithIcon]}
          placeholder="City, Country"
          value={data.location}
          onChangeText={(text) => setData(prev => ({ ...prev, location: text }))}
          autoFocus
          returnKeyType="next"
          onSubmitEditing={handleNext}
        />
      </View>
    </View>
  );

  const renderInterests = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What interests you?</Text>
      <Text style={styles.stepSubtitle}>Select all that apply (minimum 1)</Text>
      
      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsGrid}>
          {INTERESTS.map((interest) => (
            <TouchableOpacity
              key={interest.id}
              style={[
                styles.optionCard,
                data.interests.includes(interest.id) && styles.optionCardSelected
              ]}
              onPress={() => toggleInterest(interest.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>{interest.emoji}</Text>
              <Text style={[
                styles.optionLabel,
                data.interests.includes(interest.id) && styles.optionLabelSelected
              ]}>
                {interest.label}
              </Text>
              {data.interests.includes(interest.id) && (
                <Check size={16} color={theme.colors.primary} style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderSkills = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What can you share?</Text>
      <Text style={styles.stepSubtitle}>Select skills you can teach others (minimum 1)</Text>
      
      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsGrid}>
          {SKILLS.map((skill) => (
            <TouchableOpacity
              key={skill.id}
              style={[
                styles.optionCard,
                data.skills.includes(skill.id) && styles.optionCardSelected
              ]}
              onPress={() => toggleSkill(skill.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>{skill.emoji}</Text>
              <Text style={[
                styles.optionLabel,
                data.skills.includes(skill.id) && styles.optionLabelSelected
              ]}>
                {skill.label}
              </Text>
              {data.skills.includes(skill.id) && (
                <Check size={16} color={theme.colors.primary} style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderThemes = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose your bridge themes</Text>
      <Text style={styles.stepSubtitle}>What types of cultural exchanges interest you?</Text>
      
      <View style={styles.themesContainer}>
        {theme.themes.map((themeItem) => (
          <ThemeChip
            key={themeItem.id}
            label={themeItem.label}
            emoji={themeItem.emoji}
            selected={data.preferredThemes.includes(themeItem.id)}
            onPress={() => toggleTheme(themeItem.id)}
            style={styles.themeChip}
          />
        ))}
      </View>
    </View>
  );

  const renderComplete = () => (
    <View style={styles.stepContainer}>
      <View style={styles.completeContent}>
        <View style={styles.completeIcon}>
          <Check size={60} color={theme.colors.success} />
        </View>
        <Text style={styles.completeTitle}>You're all set!</Text>
        <Text style={styles.completeSubtitle}>
          We're finding the perfect cultural bridges for you based on your interests in {data.interests.length} areas and {data.skills.length} skills.
        </Text>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Profile Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Name:</Text>
            <Text style={styles.summaryValue}>{data.name}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Location:</Text>
            <Text style={styles.summaryValue}>{data.location}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Interests:</Text>
            <Text style={styles.summaryValue}>{data.interests.length} selected</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Skills:</Text>
            <Text style={styles.summaryValue}>{data.skills.length} selected</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome': return renderWelcome();
      case 'name': return renderName();
      case 'location': return renderLocation();
      case 'interests': return renderInterests();
      case 'skills': return renderSkills();
      case 'themes': return renderThemes();
      case 'complete': return renderComplete();
      default: return renderWelcome();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentStepIndex + 1} of {steps.length}
        </Text>
      </View>

      {/* Step Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentStepIndex > 0 && (
          <Button
            title="Back"
            variant="ghost"
            onPress={handleBack}
            style={styles.backButton}
          />
        )}
        <Button
          title={currentStep === 'complete' ? 'Start Exploring' : 'Continue'}
          onPress={handleNext}
          style={styles.nextButton}
          icon={currentStep !== 'complete' ? ArrowRight : undefined}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  progressContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  progressText: {
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: theme.spacing.lg,
    minHeight: 400,
  },
  stepTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    lineHeight: theme.fontSize.base * 1.4,
  },
  welcomeContent: {
    alignItems: 'center',
    paddingTop: theme.spacing['2xl'],
  },
  welcomeIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  welcomeTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.fontSize.lg * 1.4,
    marginBottom: theme.spacing['2xl'],
  },
  featureList: {
    width: '100%',
    gap: theme.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  featureText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.primary,
    flex: 1,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: theme.spacing.xl,
  },
  inputIcon: {
    position: 'absolute',
    left: theme.spacing.lg,
    top: 18,
    zIndex: 1,
  },
  textInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    fontSize: theme.fontSize.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    textAlign: 'center',
  },
  textInputWithIcon: {
    paddingLeft: theme.spacing['2xl'] + theme.spacing.lg,
  },
  optionsContainer: {
    maxHeight: 400,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  optionCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    position: 'relative',
  },
  optionCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '05',
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  optionLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  optionLabelSelected: {
    color: theme.colors.primary,
  },
  checkIcon: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'center',
  },
  themeChip: {
    marginBottom: theme.spacing.sm,
  },
  completeContent: {
    alignItems: 'center',
    paddingTop: theme.spacing['2xl'],
  },
  completeIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.success + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  completeTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  completeSubtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.fontSize.base * 1.4,
    marginBottom: theme.spacing['2xl'],
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  navigation: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
