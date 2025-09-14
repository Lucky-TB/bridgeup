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
  Switch,
} from 'react-native';
import { MoreHorizontal, Share, Grid3X3, Bookmark, LogOut, Edit3, Bell, Shield, Trash2, Settings, Moon, Sun } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/contexts/ThemeContext';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import ThemeChip from '@/components/ui/ThemeChip';

export default function ProfileScreen() {
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Instagram-style Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.username, { color: colors.text.primary }]}>{user.username}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => showComingSoon('Add Post')}
            >
              <Text style={[styles.addPostIcon, { color: colors.text.primary }]}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => showComingSoon('Menu')}
            >
              <MoreHorizontal size={24} color={colors.text.primary} />
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
                <Text style={[styles.statNumber, { color: colors.text.primary }]}>{user.stats.posts}</Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>posts</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: colors.text.primary }]}>{user.stats.followers}</Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>followers</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: colors.text.primary }]}>{user.stats.following}</Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>following</Text>
              </View>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.bioSection}>
            <Text style={[styles.displayName, { color: colors.text.primary }]}>{user.displayName}</Text>
            <Text style={[styles.bio, { color: colors.text.primary }]}>{user.bio}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: colors.primary }]}
              onPress={() => showComingSoon('Edit Profile')}
            >
              <Text style={[styles.editButtonText, { color: 'white' }]}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.shareButton, { borderColor: colors.border }]}
              onPress={() => showComingSoon('Share Profile')}
            >
              <Share size={16} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={[styles.tabBar, { borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'posts' && styles.activeTab]}
            onPress={() => setSelectedTab('posts')}
          >
            <Grid3X3 size={24} color={selectedTab === 'posts' ? colors.text.primary : colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'saved' && styles.activeTab]}
            onPress={() => setSelectedTab('saved')}
          >
            <Bookmark size={24} color={selectedTab === 'saved' ? colors.text.primary : colors.text.secondary} />
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
        <View style={[styles.settingsSection, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => showComingSoon('Settings')}
          >
            <Settings size={20} color={colors.text.secondary} />
            <Text style={[styles.settingsText, { color: colors.text.primary }]}>Settings</Text>
          </TouchableOpacity>
          
          {/* Dark Mode Toggle */}
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              {isDarkMode ? (
                <Moon size={20} color={colors.text.secondary} />
              ) : (
                <Sun size={20} color={colors.text.secondary} />
              )}
              <Text style={[styles.settingsText, { color: colors.text.primary }]}>
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDarkMode ? colors.surface : colors.surface}
            />
          </View>
          
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={handleSignOut}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={[styles.settingsText, { color: colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Instagram-style Header
  header: {
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  addPostIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  // Profile Section
  profileSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  bioSection: {
    marginBottom: 16,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
  },
  // Posts Grid
  postsGrid: {
  },
  gridContainer: {
    padding: 1,
  },
  postItem: {
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
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // Settings Section
  settingsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  settingsText: {
    fontSize: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});