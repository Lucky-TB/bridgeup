import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Heart, Share, Bookmark } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';
import Avatar from '@/components/ui/Avatar';
import ThemeChip from '@/components/ui/ThemeChip';
import { Bridge, Snapshot, User } from '@/lib/types';

interface CardBridgeProps {
  bridge: Bridge;
  leftSnapshot: Snapshot;
  rightSnapshot: Snapshot;
  leftUser: User;
  rightUser: User;
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export default function CardBridge({
  bridge,
  leftSnapshot,
  rightSnapshot,
  leftUser,
  rightUser,
  onLike,
  onSave,
  onShare,
}: CardBridgeProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    if (Haptics.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsLiked(!isLiked);
    onLike?.();
  };

  const handleSave = () => {
    if (Haptics.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsSaved(!isSaved);
    onSave?.();
  };

  const handleShare = () => {
    if (Haptics.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onShare?.();
  };

  return (
    <View style={styles.container}>
      {/* Bridge Header */}
      <View style={styles.header}>
        <View style={styles.avatars}>
          <Avatar uri={leftUser?.photoURL} size="small" />
          <Avatar uri={rightUser?.photoURL} size="small" style={styles.rightAvatar} />
        </View>
        <View style={styles.bridgeInfo}>
          <Text style={styles.bridgeLabel}>Bridge</Text>
          <View style={styles.themes}>
            {bridge.themes.slice(0, 2).map((themeId) => {
              const themeData = theme.themes.find(t => t.id === themeId);
              return themeData ? (
                <ThemeChip
                  key={themeId}
                  label={themeData.label}
                  emoji={themeData.emoji}
                  style={styles.themeChip}
                />
              ) : null;
            })}
          </View>
        </View>
      </View>

      {/* Media Content */}
      <View style={styles.mediaContainer}>
        <Image 
          source={{ uri: leftSnapshot.mediaPath }}
          style={styles.media}
          contentFit="cover"
        />
        <View style={styles.divider} />
        <Image 
          source={{ uri: rightSnapshot.mediaPath }}
          style={styles.media}
          contentFit="cover"
        />
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.snapshotText} numberOfLines={2}>
          {leftSnapshot.text}
        </Text>
        <Text style={styles.separator}>·</Text>
        <Text style={styles.snapshotText} numberOfLines={2}>
          {rightSnapshot.text}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.action} 
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Heart 
            size={20} 
            color={isLiked ? theme.colors.error : theme.colors.text.secondary}
            fill={isLiked ? theme.colors.error : 'transparent'}
          />
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {bridge.metrics.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.action} 
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Share size={20} color={theme.colors.text.secondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.action} 
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Bookmark 
            size={20} 
            color={isSaved ? theme.colors.primary : theme.colors.text.secondary}
            fill={isSaved ? theme.colors.primary : 'transparent'}
          />
          <Text style={[styles.actionText, isSaved && styles.savedText]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightAvatar: {
    marginLeft: -8,
  },
  bridgeInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  bridgeLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: 2,
  },
  themes: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  themeChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  mediaContainer: {
    flexDirection: 'row',
    height: 240,
    marginHorizontal: theme.spacing.lg,
  },
  media: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  snapshotText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    lineHeight: theme.fontSize.base * 1.4,
    color: theme.colors.text.primary,
  },
  separator: {
    color: theme.colors.text.muted,
    fontSize: theme.fontSize.base,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontWeight.medium,
  },
  likedText: {
    color: theme.colors.error,
  },
  savedText: {
    color: theme.colors.primary,
  },
});