import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Settings, MapPin, Bookmark, LogOut, CreditCard as Edit3, Bell, Shield, Trash2 } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import ThemeChip from '@/components/ui/ThemeChip';

export default function ProfileScreen() {
  const [user] = useState({
    displayName: 'Maria Rodriguez',
    photoURL: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    city: 'Rome, Italy',
    themes: ['food', 'places', 'language'],
    joinedAt: new Date('2024-01-15'),
    stats: {
      bridges: 12,
      likes: 45,
      saves: 8,
    },
  });

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Sign out') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your bridges and data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete account') },
      ]
    );
  };

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const menuItems = [
    {
      icon: Edit3,
      title: 'Edit Profile',
      onPress: () => console.log('Edit profile'),
    },
    {
      icon: Bookmark,
      title: 'Saved Bridges',
      subtitle: `${user.stats.saves} saved`,
      onPress: () => console.log('Saved bridges'),
    },
    {
      icon: Bell,
      title: 'Notifications',
      onPress: () => console.log('Notifications'),
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      onPress: () => console.log('Privacy'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Avatar uri={user.photoURL} size="large" />
          <Text style={styles.displayName}>{user.displayName}</Text>
          
          <View style={styles.locationRow}>
            <MapPin size={16} color={theme.colors.text.secondary} />
            <Text style={styles.location}>{user.city}</Text>
          </View>

          <Text style={styles.joinedText}>
            Joined {formatJoinDate(user.joinedAt)}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.stats.bridges}</Text>
            <Text style={styles.statLabel}>Bridges</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.stats.likes}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.stats.saves}</Text>
            <Text style={styles.statLabel}>Saves</Text>
          </View>
        </View>

        {/* Themes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Themes</Text>
          <View style={styles.themesContainer}>
            {user.themes.map((themeId) => {
              const t = theme.themes.find(theme => theme.id === themeId);
              return t ? (
                <ThemeChip
                  key={themeId}
                  label={t.label}
                  emoji={t.emoji}
                  selected={true}
                  style={styles.themeChip}
                />
              ) : null;
            })}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <item.icon size={20} color={theme.colors.text.secondary} />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <LogOut size={20} color={theme.colors.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Account */}
        <View style={styles.dangerSection}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color={theme.colors.error} />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  displayName: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  location: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.secondary,
  },
  joinedText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  section: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  themeChip: {
    marginBottom: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    flex: 1,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  menuItemSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  signOutText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.error,
  },
  dangerSection: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  deleteText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.error,
  },
});