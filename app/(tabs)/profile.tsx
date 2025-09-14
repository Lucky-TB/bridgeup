import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { MoreHorizontal, Share, Grid3X3, Bookmark, LogOut, Edit3, Bell, Shield, Trash2, Settings } from 'lucide-react-native';
import { Image } from 'expo-image';
import { theme } from '@/constants/theme';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import ThemeChip from '@/components/ui/ThemeChip';

export default function ProfileScreen() {
  const [user] = useState({
    displayName: 'Maria Rodriguez',
    username: 'maria_rome',
    photoURL: '',
    bio: 'Food lover from Rome 🍝\nSharing my culinary adventures\n📍 Rome, Italy',
    city: 'Rome, Italy',
    themes: ['food', 'places', 'language'],
    joinedAt: new Date('2024-01-15'),
    stats: {
      posts: 12,
      followers: 1247,
      following: 89,
    },
  });

  const [selectedTab, setSelectedTab] = useState<'posts' | 'saved'>('posts');

  // Mock posts data
  const mockPosts = [
    {
      id: '1',
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      likes: 23,
    },
    {
      id: '2',
      imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
      likes: 15,
    },
    {
      id: '3',
      imageUrl: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
      likes: 8,
    },
    {
      id: '4',
      imageUrl: 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg',
      likes: 31,
    },
    {
      id: '5',
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      likes: 12,
    },
    {
      id: '6',
      imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
      likes: 19,
    },
  ];

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

  const showComingSoon = (feature: string) => {
    Alert.alert('Coming Soon!', `${feature} will be available in the next update.`);
  };

  const renderPost = ({ item }: { item: any }) => {
    const screenWidth = Dimensions.get('window').width;
    const postSize = (screenWidth - 4) / 3; // 3 columns with 2px gaps

    return (
      <TouchableOpacity 
        style={[styles.postItem, { width: postSize, height: postSize }]}
        onPress={() => showComingSoon('View Post')}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: item.imageUrl }}
          style={styles.postImage}
          contentFit="cover"
        />
        <View style={styles.postOverlay}>
          <View style={styles.postStats}>
            <Text style={styles.postLikes}>❤️ {item.likes}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Instagram-style Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.username}>{user.username}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => showComingSoon('Add Post')}
            >
              <Text style={styles.addPostIcon}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => showComingSoon('Menu')}
            >
              <MoreHorizontal size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileTop}>
            <Avatar uri={user.photoURL} size="large" />
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{user.stats.posts}</Text>
                <Text style={styles.statLabel}>posts</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{user.stats.followers}</Text>
                <Text style={styles.statLabel}>followers</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{user.stats.following}</Text>
                <Text style={styles.statLabel}>following</Text>
              </View>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.bioSection}>
            <Text style={styles.displayName}>{user.displayName}</Text>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => showComingSoon('Edit Profile')}
            >
              <Text style={styles.editButtonText}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={() => showComingSoon('Share Profile')}
            >
              <Share size={16} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'posts' && styles.activeTab]}
            onPress={() => setSelectedTab('posts')}
          >
            <Grid3X3 size={24} color={selectedTab === 'posts' ? theme.colors.text.primary : theme.colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'saved' && styles.activeTab]}
            onPress={() => setSelectedTab('saved')}
          >
            <Bookmark size={24} color={selectedTab === 'saved' ? theme.colors.text.primary : theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsGrid}>
          <FlatList
            data={mockPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.gridContainer}
          />
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => showComingSoon('Settings')}
          >
            <Settings size={20} color={theme.colors.text.secondary} />
            <Text style={styles.settingsText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={handleSignOut}
          >
            <LogOut size={20} color={theme.colors.error} />
            <Text style={[styles.settingsText, { color: theme.colors.error }]}>Sign Out</Text>
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
  // Instagram-style Header
  header: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  username: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
  addPostIcon: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
  },
  // Profile Section
  profileSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: theme.spacing.xl,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  bioSection: {
    marginBottom: theme.spacing.lg,
  },
  displayName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  bio: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
    lineHeight: theme.fontSize.sm * 1.4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  editButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  shareButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: theme.colors.text.primary,
  },
  // Posts Grid
  postsGrid: {
    backgroundColor: theme.colors.background,
  },
  gridContainer: {
    padding: 1,
  },
  postItem: {
    backgroundColor: theme.colors.surface,
    margin: 1,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postLikes: {
    color: theme.colors.surface,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  // Settings Section
  settingsSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  settingsText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.primary,
  },
});