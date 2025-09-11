import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { theme } from '@/constants/theme';
import CardBridge from '@/components/cards/CardBridge';
import ThemeChip from '@/components/ui/ThemeChip';
import { Bridge, Snapshot, User } from '@/lib/types';

export default function TodayScreen() {
  const [bridges, setBridges] = useState<Bridge[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const filteredBridges = selectedTheme 
    ? bridges.filter(bridge => bridge.themes.includes(selectedTheme))
    : bridges;

  const renderBridge = ({ item }: { item: Bridge }) => {
    const leftSnapshot = mockSnapshots[item.leftSnapshotId as keyof typeof mockSnapshots];
    const rightSnapshot = mockSnapshots[item.rightSnapshotId as keyof typeof mockSnapshots];
    const leftUser = mockUsers[leftSnapshot.userId as keyof typeof mockUsers];
    const rightUser = mockUsers[rightSnapshot.userId as keyof typeof mockUsers];

    return (
      <CardBridge
        bridge={item}
        leftSnapshot={leftSnapshot}
        rightSnapshot={rightSnapshot}
        leftUser={leftUser}
        rightUser={rightUser}
        onLike={() => console.log('Liked bridge', item.id)}
        onSave={() => console.log('Saved bridge', item.id)}
        onShare={() => console.log('Shared bridge', item.id)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today</Text>
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
  title: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
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