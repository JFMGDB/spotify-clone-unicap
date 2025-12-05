import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface TrackItemProps {
  title: string;
  artist: string;
  duration?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export function TrackItem({ title, artist, duration, onPress, style }: TrackItemProps) {
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const content = (
    <View style={[styles.container, style]}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artist}
        </Text>
      </View>
      {duration && <Text style={styles.duration}>{formatDuration(duration)}</Text>}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{content}</TouchableOpacity>;
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  info: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  artist: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  duration: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});

