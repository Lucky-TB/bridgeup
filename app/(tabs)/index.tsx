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
import { Bell, MessageCircle, MoreHorizontal, Heart, MessageCircle as Comment, Send, Bookmark, Sparkles } from 'lucide-react-native';
import { Image } from 'expo-image';
import { db } from '@/lib/firebase';
import { useTheme } from '@/contexts/ThemeContext';
import CardBridge from '@/components/cards/CardBridge';
import ThemeChip from '@/components/ui/ThemeChip';
import Avatar from '@/components/ui/Avatar';
import { Bridge, Snapshot, User } from '@/lib/types';
import { AIMatchingService } from '@/lib/services/ai-matching-service';
import { useRealtimeNotifications, useLiveInteractions, useRealtimeCounts } from '@/lib/services/realtime-service';
import { GamificationService } from '@/lib/services/gamification-service';

export default function TodayScreen() {
  const { colors } = useTheme();
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
    user1: { id: 'user1', displayName: 'Maria', photoURL: '', city: 'Rome', themes: ['food'], createdAt: new Date(), updatedAt: new Date() },
    user2: { id: 'user2', displayName: 'Alex', photoURL: '', city: 'Bangkok', themes: ['food'], createdAt: new Date(), updatedAt: new Date() },
    user3: { id: 'user3', displayName: 'Jordan', photoURL: '', city: 'London', themes: ['music'], createdAt: new Date(), updatedAt: new Date() },
    user4: { id: 'user4', displayName: 'Sam', photoURL: '', city: 'New York', themes: ['music'], createdAt: new Date(), updatedAt: new Date() },
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
      <View style={[styles.postContainer, { backgroundColor: colors.surface }]}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <Avatar uri={leftUser?.photoURL} size="small" />
            <View style={styles.userDetails}>
              <Text style={[styles.username, { color: colors.text.primary }]}>{leftUser?.displayName}</Text>
              <Text style={[styles.location, { color: colors.text.secondary }]}>Bridge with {rightUser?.displayName}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => showComingSoon('More Options')}>
            <MoreHorizontal size={20} color={colors.text.primary} />
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
              <Heart size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => showComingSoon('Comments')}
            >
              <Comment size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleShare(item.id)}
            >
              <Send size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSave(item.id)}
          >
            <Bookmark size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Post Caption */}
        <View style={styles.postCaption}>
          <Text style={[styles.likesText, { color: colors.text.primary }]}>{likeCount} likes</Text>
          <View style={styles.captionContainer}>
            <Text style={[styles.captionText, { color: colors.text.primary }]}>
              <Text style={[styles.captionUsername, { color: colors.text.primary }]}>{leftUser?.displayName}</Text> {leftSnapshot.text}
            </Text>
            <Text style={[styles.captionText, { color: colors.text.primary }]}>
              <Text style={[styles.captionUsername, { color: colors.text.primary }]}>{rightUser?.displayName}</Text> {rightSnapshot.text}
            </Text>
          </View>
          <TouchableOpacity onPress={() => showComingSoon('View Comments')}>
            <Text style={[styles.viewCommentsText, { color: colors.text.secondary }]}>View all comments</Text>
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
        style={[styles.suggestionCard, { backgroundColor: colors.surface }]}
        onPress={() => showComingSoon('AI Bridge Creation')}
        activeOpacity={0.7}
      >
        <View style={styles.suggestionHeader}>
          <Sparkles size={16} color={colors.primary} />
          <Text style={[styles.suggestionTitle, { color: colors.text.primary }]}>AI Suggested Match</Text>
          <Text style={[styles.suggestionScore, { color: colors.text.secondary }]}>{Math.round(item.score * 100)}% match</Text>
        </View>
        <Text style={[styles.suggestionReason, { color: colors.text.primary }]}>{item.reasons[0]}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Instagram-style Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.logo, { color: colors.text.primary }]}>BridgeUp</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => showComingSoon('Messages')}
          >
            <MessageCircle size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => showComingSoon('Notifications')}
          >
            <Bell size={24} color={colors.text.primary} />
            {unreadCount > 0 && (
              <View style={[styles.notificationBadge, { backgroundColor: colors.error }]}>
                <Text style={[styles.notificationBadgeText, { color: 'white' }]}>{unreadCount}</Text>
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
  },
  // Instagram-style Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  // Stories Section
  storiesContainer: {
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  storiesList: {
    paddingHorizontal: 16,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  yourStoryCircle: {
    position: 'relative',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  addStoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  storyText: {
    fontSize: 12,
    marginTop: 4,
    maxWidth: 70,
  },
  // Feed Section
  feedList: {
    paddingBottom: 24,
  },
  // Post Styles
  postContainer: {
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  location: {
    fontSize: 12,
    marginTop: 2,
  },
  postContent: {
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
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
  postCaption: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  captionContainer: {
    marginBottom: 8,
  },
  captionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  captionUsername: {
    fontWeight: '600',
  },
  viewCommentsText: {
    fontSize: 14,
  },
  // AI Suggestions
  suggestionCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  suggestionScore: {
    fontSize: 12,
    fontWeight: '500',
  },
  suggestionReason: {
    fontSize: 14,
    lineHeight: 20,
  },
});