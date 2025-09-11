import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { User } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface AvatarProps {
  uri?: string | null;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const SIZES = {
  small: 32,
  medium: 48,
  large: 80,
};

export default function Avatar({ uri, size = 'medium', style }: AvatarProps) {
  const avatarSize = SIZES[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
          contentFit="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <User
            size={avatarSize * 0.5}
            color={theme.colors.text.muted}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
});