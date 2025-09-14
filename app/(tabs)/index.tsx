import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Bell, MessageCircle, MoreHorizontal, Heart, MessageCircle as Comment, Send, Bookmark } from 'lucide-react-native';
import { Image } from 'expo-image';
import { db } from '@/lib/firebase';
import { theme } from '@/constants/theme';
import CardBridge from '@/components/cards/CardBridge';
import ThemeChip from '@/components/ui/ThemeChip';
import Avatar from '@/components/ui/Avatar';
import { Bridge, Snapshot, User } from '@/lib/types';
import { AIMatchingService } from '@/lib/services/ai-matching-service';
import { useRealtimeNotifications, useLiveInteractions, useRealtimeCounts } from '@/lib/services/realtime-service';
import { GamificationService } from '@/lib/services/gamification-service';

export default function TodayScreen() {
  const [bridges, setBridges] = useState<Bridge[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  // Real-time hooks
  const { notifications, unreadCount, markAsRead } = useRealtimeNotifications();
  const liveInteractions = useLiveInteractions();
  const { counts, updateCount } = useRealtimeCounts();

  // Mock data for demo
  const mockBridges = [
    {
      id: '1',
      leftSnapshotId: 'snap1',
      rightSnapshotId: 'snap2',
      themes: ['food'],
      createdAt: new Date(),
      metrics: { views: 12, likes: 5 },
    },
    {
      id: '2',
      leftSnapshotId: 'snap3',
      rightSnapshotId: 'snap4',
      themes: ['music'],
      createdAt: new Date(),
      metrics: { views: 8, likes: 3 },
    },
  ];

  const mockSnapshots = {
    snap1: {
      id: 'snap1',
      userId: 'user1',
      mediaType: 'photo' as const,
      mediaPath: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      text: 'My grandmother\'s secret pasta recipe - been in our family for generations',
      themes: ['food'],
      locale: 'en-US',
      pendingMatch: false,
      createdAt: new Date(),
      likeCount: 2,
      saveCount: 1,
    },
    snap2: {
      id: 'snap2',
      userId: 'user2',
      mediaType: 'photo' as const,
      mediaPath: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
      text: 'Street food from Bangkok that changed my perspective on flavors',
      themes: ['food'],
      locale: 'en-US',
      pendingMatch: false,
      createdAt: new Date(),
      likeCount: 3,
      saveCount: 2,
    },
    snap3: {
      id: 'snap3',
      userId: 'user3',
      mediaType: 'photo' as const,
      mediaPath: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
      text: 'Learning guitar during lockdown - this song got me through tough times',
      themes: ['music'],
      locale: 'en-US',
      pendingMatch: false,
      createdAt: new Date(),
      likeCount: 1,
      saveCount: 0,
    },
    snap4: {
      id: 'snap4',
      userId: 'user4',
      mediaType: 'photo' as const,
      mediaPath: 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg',
      text: 'Jazz improvisation session - finding my voice through music',
      themes: ['music'],
      locale: 'en-US',
      pendingMatch: false,
      createdAt: new Date(),
      likeCount: 4,
      saveCount: 1,
    },
  };

  const mockUsers = {
    user1: { id: 'user1', displayName: 'Maria', photoURL: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150', city: 'Rome', themes: ['food'], createdAt: new Date(), updatedAt: new Date() },
    user2: { id: 'user2', displayName: 'Alex', photoURL: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?w=150', city: 'Bangkok', themes: ['food'], createdAt: new Date(), updatedAt: new Date() },
    user3: { id: 'user3', displayName: 'Jordan', photoURL: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=150', city: 'London', themes: ['music'], createdAt: new Date(), updatedAt: new Date() },
    user4: { id: 'user4', displayName: 'Sam', photoURL: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150', city: 'New York', themes: ['music'], createdAt: new Date(), updatedAt: new Date() },
  };

  useEffect(() => {
    // In a real app, this would fetch from Firestore
    setBridges(mockBridges);
    setLoading(false);
    
    // Load AI suggestions and user stats
    loadAISuggestions();
    loadUserStats();
  }, []);

  const loadAISuggestions = async () => {
    try {
      // Get placeholder bridges as suggestions
      const placeholderBridges = AIMatchingService.getAllPlaceholderBridges();
      const suggestions = placeholderBridges.map(bridge => ({
        id: bridge.id,
        themes: bridge.themes,
        description: bridge.description,
        mediaPath: bridge.mediaPath,
        user: bridge.user
      }));
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
      setAiSuggestions([]);
    }
  };

  const loadUserStats = () => {
    // Mock user stats for demo
    const stats = {
      bridgesCreated: 0,
      snapshotsShared: 0,
      countriesConnected: 0,
      themesExplored: 0,
      totalLikes: 0,
      totalViews: 0
    };
    setUserStats(stats);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
      loadAISuggestions();
      loadUserStats();
    }, 1000);
  }, []);

  const handleLike = (bridgeId: string) => {
    updateCount(bridgeId, 1);
    // In a real app, this would update the backend
    console.log('Liked bridge', bridgeId);
  };

  const handleSave = (bridgeId: string) => {
    // In a real app, this would update the backend
    console.log('Saved bridge', bridgeId);
  };

  const handleShare = (bridgeId: string) => {
    Alert.alert('Share Bridge', 'Share functionality coming soon!');
  };

  const showComingSoon = (feature: string) => {
    Alert.alert('Coming Soon!', `${feature} will be available in the next update.`);
  };

  const filteredBridges = selectedTheme 
    ? bridges.filter(bridge => bridge.themes.includes(selectedTheme))
    : bridges;

  const renderInstagramPost = ({ item }: { item: Bridge }) => {
    const leftSnapshot = mockSnapshots[item.leftSnapshotId as keyof typeof mockSnapshots];
    const rightSnapshot = mockSnapshots[item.rightSnapshotId as keyof typeof mockSnapshots];
    const leftUser = mockUsers[leftSnapshot.userId as keyof typeof mockUsers];
    const rightUser = mockUsers[rightSnapshot.userId as keyof typeof mockUsers];

    // Get real-time counts
    const likeCount = (counts[item.id] || 0) + item.metrics.likes;

    return (
      <View style={styles.postContainer}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <Avatar uri={leftUser?.photoURL} size="small" />
            <View style={styles.userDetails}>
              <Text style={styles.username}>{leftUser?.displayName}</Text>
              <Text style={styles.location}>Bridge with {rightUser?.displayName}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => showComingSoon('More Options')}>
            <MoreHorizontal size={20} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Post Content - Bridge Images */}
        <View style={styles.postContent}>
          <View style={styles.bridgeImages}>
            <View style={styles.bridgeImageContainer}>
              <Image 
                source={{ uri: leftSnapshot.mediaPath }}
                style={styles.bridgeImage}
                contentFit="cover"
              />
            </View>
            <View style={styles.bridgeDivider} />
            <View style={styles.bridgeImageContainer}>
              <Image 
                source={{ uri: rightSnapshot.mediaPath }}
                style={styles.bridgeImage}
                contentFit="cover"
              />
            </View>
          </View>
        </View>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <View style={styles.leftActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLike(item.id)}
            >
              <Heart size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => showComingSoon('Comments')}
            >
              <Comment size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleShare(item.id)}
            >
              <Send size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSave(item.id)}
          >
            <Bookmark size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Post Caption */}
        <View style={styles.postCaption}>
          <Text style={styles.likesText}>{likeCount} likes</Text>
          <View style={styles.captionContainer}>
            <Text style={styles.captionText}>
              <Text style={styles.captionUsername}>{leftUser?.displayName}</Text> {leftSnapshot.text}
            </Text>
            <Text style={styles.captionText}>
              <Text style={styles.captionUsername}>{rightUser?.displayName}</Text> {rightSnapshot.text}
            </Text>
          </View>
          <TouchableOpacity onPress={() => showComingSoon('View Comments')}>
            <Text style={styles.viewCommentsText}>View all comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAISuggestion = ({ item }: { item: any }) => {
    const snapshot = mockSnapshots[item.snapshot.id as keyof typeof mockSnapshots];
    const user = mockUsers[snapshot.userId as keyof typeof mockUsers];
    
    return (
      <TouchableOpacity 
        style={styles.suggestionCard}
        onPress={() => showComingSoon('AI Bridge Creation')}
        activeOpacity={0.7}
      >
        <View style={styles.suggestionHeader}>
          <Sparkles size={16} color={theme.colors.primary} />
          <Text style={styles.suggestionTitle}>AI Suggested Match</Text>
          <Text style={styles.suggestionScore}>{Math.round(item.score * 100)}% match</Text>
        </View>
        <Text style={styles.suggestionReason}>{item.reasons[0]}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Instagram-style Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>BridgeUp</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => showComingSoon('Messages')}
          >
            <MessageCircle size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => showComingSoon('Notifications')}
          >
            <Bell size={24} color={theme.colors.text.primary} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories Section */}
      <View style={styles.storiesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesList}
        >
          {/* Your Story */}
          <TouchableOpacity style={styles.storyItem} onPress={() => showComingSoon('Add Story')}>
            <View style={styles.yourStoryCircle}>
              <Avatar uri={mockUsers.user1.photoURL} size="medium" />
              <View style={styles.addStoryIcon}>
                <Text style={styles.addStoryText}>+</Text>
              </View>
            </View>
            <Text style={styles.storyText}>Your story</Text>
          </TouchableOpacity>

          {/* Other Stories */}
          {Object.values(mockUsers).slice(1).map((user) => (
            <TouchableOpacity key={user.id} style={styles.storyItem} onPress={() => showComingSoon('View Story')}>
              <View style={styles.storyCircle}>
                <Avatar uri={user.photoURL} size="medium" />
              </View>
              <Text style={styles.storyText} numberOfLines={1}>{user.displayName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Feed */}
      <FlatList
        data={filteredBridges}
        renderItem={renderInstagramPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.feedList}
        showsVerticalScrollIndicator={false}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  logo: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  headerButton: {
    position: 'relative',
    padding: theme.spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: theme.colors.surface,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
  },
  // Stories Section
  storiesContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
  },
  storiesList: {
    paddingHorizontal: theme.spacing.lg,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  yourStoryCircle: {
    position: 'relative',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStoryIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  addStoryText: {
    color: theme.colors.surface,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
  },
  storyText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
    maxWidth: 70,
  },
  // Feed Section
  feedList: {
    paddingBottom: theme.spacing.xl,
  },
  // Post Styles
  postContainer: {
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.lg,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: theme.spacing.md,
  },
  username: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  location: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  postContent: {
    backgroundColor: theme.colors.background,
  },
  bridgeImages: {
    flexDirection: 'row',
    height: 300,
  },
  bridgeImageContainer: {
    flex: 1,
  },
  bridgeImage: {
    width: '100%',
    height: '100%',
  },
  bridgeDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  leftActions: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  actionButton: {
    padding: theme.spacing.sm,
  },
  postCaption: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  likesText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  captionContainer: {
    marginBottom: theme.spacing.sm,
  },
  captionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
    lineHeight: theme.fontSize.sm * 1.4,
    marginBottom: theme.spacing.xs,
  },
  captionUsername: {
    fontWeight: theme.fontWeight.semibold,
  },
  viewCommentsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});