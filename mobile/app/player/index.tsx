import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { usePlayer } from '@/src/contexts/PlayerContext';
import { colors } from '@/src/shared/theme/colors';
import { spacing } from '@/src/shared/theme/spacing';
import { typography } from '@/src/shared/theme/typography';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function PlayerScreen() {
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    pause,
    resume,
    next,
    previous,
    seekTo,
  } = usePlayer();

  if (!currentTrack) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nenhuma música tocando</Text>
      </View>
    );
  }

  const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number) => {
    seekTo(value);
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <IconSymbol name="chevron.down" size={32} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        {currentTrack.coverUrl && (
          <Image source={{ uri: currentTrack.coverUrl }} style={styles.cover} />
        )}

        <View style={styles.info}>
          <Text style={styles.title}>{currentTrack.title}</Text>
          <Text style={styles.artist}>{currentTrack.artist}</Text>
        </View>

        <View style={styles.progress}>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${progressPercentage}%` }]} />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatTime(position)}</Text>
            <Text style={styles.time}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={previous} style={styles.controlButton}>
            <IconSymbol name="backward.fill" size={32} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isPlaying ? pause : resume}
            style={styles.playButton}
          >
            <IconSymbol
              name={isPlaying ? 'pause.fill' : 'play.fill'}
              size={48}
              color={colors.background}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={next} style={styles.controlButton}>
            <IconSymbol name="forward.fill" size={32} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeButton: {
    padding: spacing.md,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  cover: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: spacing.xl,
    backgroundColor: colors.backgroundSecondary,
  },
  info: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  artist: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  progress: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  sliderTrack: {
    width: '100%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: spacing.sm,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  time: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    padding: spacing.md,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

