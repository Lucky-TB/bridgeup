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
} from 'react-native';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Bell, Sparkles, Trophy, Zap } from 'lucide-react-native';
import { db } from '@/lib/firebase';
import { theme } from '@/constants/theme';
import CardBridge from '@/components/cards/CardBridge';
import ThemeChip from '@/components/ui/ThemeChip';
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
      const suggestions = await AIMatchingService.getBridgeSuggestions(
        mockUsers.user1, // Demo user
        Object.values(mockSnapshots),
        Object.values(mockUsers)
      );
      setAiSuggestions(suggestions.topBridges);
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
    }
  };

  const loadUserStats = () => {
    const stats = GamificationService.calculateUserStats(
      mockUsers.user1,
      Object.values(mockSnapshots).filter(s => s.userId === 'user1'),
      mockBridges.filter(b => b.leftSnapshotId === 'snap1' || b.rightSnapshotId === 'snap1'),
      mockBridges,
      Object.values(mockUsers)
    );
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

  const renderBridge = ({ item }: { item: Bridge }) => {
    const leftSnapshot = mockSnapshots[item.leftSnapshotId as keyof typeof mockSnapshots];
    const rightSnapshot = mockSnapshots[item.rightSnapshotId as keyof typeof mockSnapshots];
    const leftUser = mockUsers[leftSnapshot.userId as keyof typeof mockUsers];
    const rightUser = mockUsers[rightSnapshot.userId as keyof typeof mockUsers];

    // Get real-time counts
    const likeCount = (counts[item.id] || 0) + item.metrics.likes;

    return (
      <CardBridge
        bridge={{ ...item, metrics: { ...item.metrics, likes: likeCount } }}
        leftSnapshot={leftSnapshot}
        rightSnapshot={rightSnapshot}
        leftUser={leftUser}
        rightUser={rightUser}
        onLike={() => handleLike(item.id)}
        onSave={() => handleSave(item.id)}
        onShare={() => handleShare(item.id)}
      />
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
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Today</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => showComingSoon('Notifications')}
            >
              <Bell size={20} color={theme.colors.text.secondary} />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statsButton}
              onPress={() => showComingSoon('User Stats')}
            >
              <Trophy size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <View style={styles.aiSuggestionsContainer}>
            <TouchableOpacity 
              style={styles.aiToggle}
              onPress={() => setShowAiSuggestions(!showAiSuggestions)}
            >
              <Zap size={16} color={theme.colors.primary} />
              <Text style={styles.aiToggleText}>
                AI Suggestions ({aiSuggestions.length})
              </Text>
            </TouchableOpacity>
            
            {showAiSuggestions && (
              <FlatList
                data={aiSuggestions}
                renderItem={renderAISuggestion}
                keyExtractor={(item) => item.snapshot.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.aiSuggestionsList}
              />
            )}
          </View>
        )}

        {/* User Stats */}
        {userStats && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Level {userStats.level} • {userStats.totalPoints} points • {userStats.bridgesCreated} bridges
            </Text>
          </View>
        )}

        <FlatList
          data={theme.themes}
          renderItem={({ item }) => (
            <ThemeChip
              label={item.label}
              emoji={item.emoji}
              selected={selectedTheme === item.id}
              onPress={() => setSelectedTheme(
                selectedTheme === item.id ? null : item.id
              )}
              style={styles.themeChip}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.themeList}
        />
      </View>

      <FlatList
        data={filteredBridges}
        renderItem={renderBridge}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.bridgeList}
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
  header: {
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  notificationButton: {
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
  statsButton: {
    padding: theme.spacing.sm,
  },
  aiSuggestionsContainer: {
    marginBottom: theme.spacing.md,
  },
  aiToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  aiToggleText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
  },
  aiSuggestionsList: {
    paddingVertical: theme.spacing.sm,
  },
  suggestionCard: {
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary + '20',
    minWidth: 200,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  suggestionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    flex: 1,
  },
  suggestionScore: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  suggestionReason: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    lineHeight: theme.fontSize.xs * 1.4,
  },
  statsContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  statsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  themeList: {
    paddingHorizontal: theme.spacing.xs,
  },
  themeChip: {
    marginHorizontal: theme.spacing.xs,
  },
  bridgeList: {
    paddingVertical: theme.spacing.lg,
  },
});