import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { Calendar, Heart, Eye, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { theme } from '@/constants/theme';
import Avatar from '@/components/ui/Avatar';
import ThemeChip from '@/components/ui/ThemeChip';
import { useBridges } from '@/contexts/BridgeContext';
import { BridgeService } from '@/lib/services/bridge-service';

interface BridgeItem {
  id: string;
  themes: string[];
  createdAt: Date;
  metrics: {
    views: number;
    likes: number;
  };
  snapshots: {
    yours: {
      mediaPath: string;
      text: string;
    };
    theirs: {
      mediaPath: string;
      text: string;
      user: {
        displayName: string;
        photoURL: string;
        city: string;
      };
    };
  };
}

export default function BridgesScreen() {
  const { colors } = useTheme();
  const { bridges, loading, refreshBridges } = useBridges();
  const [bridgesWithSnapshots, setBridgesWithSnapshots] = useState<Array<BridgeItem>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadBridgesWithSnapshots = async () => {
    try {
      const bridgesData = await BridgeService.getBridgesWithSnapshots();
      const formattedBridges: BridgeItem[] = bridgesData.map(bridge => ({
        id: bridge.id,
        themes: bridge.themes,
        createdAt: bridge.createdAt,
        metrics: bridge.metrics,
        snapshots: {
          yours: {
            mediaPath: bridge.leftSnapshot.mediaPath,
            text: bridge.leftSnapshot.text,
          },
          theirs: {
            mediaPath: bridge.rightSnapshot.mediaPath,
            text: bridge.rightSnapshot.text,
            user: {
              displayName: bridge.rightSnapshot.userId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              photoURL: '',
              city: 'Global',
            },
          },
        },
      }));
      setBridgesWithSnapshots(formattedBridges);
    } catch (error) {
      console.error('Error loading bridges with snapshots:', error);
    }
  };

  useEffect(() => {
    loadBridgesWithSnapshots();
  }, [bridges]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshBridges();
    setRefreshing(false);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const renderBridge = ({ item }: { item: BridgeItem }) => (
    <View style={[styles.bridgeCard, { backgroundColor: colors.surface }]}>
      <View style={styles.bridgeHeader}>
        <View style={styles.bridgeInfo}>
          <View style={styles.themes}>
            {item.themes.slice(0, 2).map((themeId) => {
              const t = theme.themes.find(t => t.id === themeId);
              return t ? (
                <ThemeChip 
                  key={themeId} 
                  label={t.label} 
                  emoji={t.emoji}
                  style={styles.themeChip}
                />
              ) : null;
            })}
          </View>
          <View style={styles.dateRow}>
            <Calendar size={14} color={colors.text.muted} />
            <Text style={[styles.dateText, { color: colors.text.muted }]}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <Avatar uri={item.snapshots.theirs.user.photoURL} size="small" />
      </View>

      <View style={styles.mediaRow}>
        <View style={styles.snapshotContainer}>
          <Text style={[styles.snapshotLabel, { color: colors.text.primary }]}>You</Text>
          <Image 
            source={{ uri: item.snapshots.yours.mediaPath }}
            style={styles.snapshotImage}
            contentFit="cover"
          />
          <Text style={[styles.snapshotText, { color: colors.text.primary }]} numberOfLines={2}>
            {item.snapshots.yours.text}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.snapshotContainer}>
          <Text style={[styles.snapshotLabel, { color: colors.text.primary }]}>
            {item.snapshots.theirs.user.displayName}
          </Text>
          <Image 
            source={{ uri: item.snapshots.theirs.mediaPath }}
            style={styles.snapshotImage}
            contentFit="cover"
          />
          <Text style={[styles.snapshotText, { color: colors.text.primary }]} numberOfLines={2}>
            {item.snapshots.theirs.text}
          </Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Eye size={16} color={colors.text.muted} />
          <Text style={[styles.metricText, { color: colors.text.muted }]}>{item.metrics.views}</Text>
        </View>
        <View style={styles.metric}>
          <Heart size={16} color={colors.text.muted} />
          <Text style={[styles.metricText, { color: colors.text.muted }]}>{item.metrics.likes}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.chatButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push(`/chat/${item.id}`)}
        activeOpacity={0.8}
      >
        <MessageCircle size={16} color="white" />
        <Text style={styles.chatButtonText}>Start Skill Sharing Chat</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>No bridges yet</Text>
      <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
        Create your first snapshot to start building bridges with others
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Your Bridges</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          {bridgesWithSnapshots.length} bridge{bridgesWithSnapshots.length !== 1 ? 's' : ''} created
        </Text>
      </View>

      <FlatList
        data={bridgesWithSnapshots}
        renderItem={renderBridge}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          bridgesWithSnapshots.length === 0 && styles.emptyList
        ]}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  list: {
    padding: theme.spacing.lg,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  bridgeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bridgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  bridgeInfo: {
    flex: 1,
  },
  themes: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  themeChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dateText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.muted,
  },
  mediaRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  snapshotContainer: {
    flex: 1,
  },
  snapshotLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  snapshotImage: {
    width: '100%',
    height: 120,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  snapshotText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
    lineHeight: theme.fontSize.sm * 1.3,
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
  metrics: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metricText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.muted,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: theme.spacing['2xl'],
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.fontSize.base * 1.4,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  chatButtonText: {
    color: 'white',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
});