import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { playlistsService, Playlist, PlaylistTrack } from '@/src/features/playlists/services/playlists.service';
import { TrackItem } from '@/src/shared/components/TrackItem';
import { LoadingSpinner } from '@/src/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/src/shared/components/ErrorMessage';
import { colors } from '@/src/shared/theme/colors';
import { spacing } from '@/src/shared/theme/spacing';
import { typography } from '@/src/shared/theme/typography';
import { useTrackPlayer } from '@/src/shared/hooks/useTrackPlayer';
import { getErrorMessage } from '@/src/shared/utils/errorHandler';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { playTrack } = useTrackPlayer();

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError('');

      const [playlistData, tracksData] = await Promise.all([
        playlistsService.getById(id),
        playlistsService.getTracks(id),
      ]);

      setPlaylist(playlistData);
      setTracks(tracksData);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = async (track: PlaylistTrack['track']) => {
    const allTracks = tracks.map((pt) => pt.track);
    await playTrack(track, allTracks);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !playlist) {
    return <ErrorMessage message={error || 'Playlist não encontrada'} onRetry={loadData} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {playlist.coverUrl && (
          <Image source={{ uri: playlist.coverUrl }} style={styles.cover} />
        )}
        <Text style={styles.title}>{playlist.name}</Text>
        {playlist.description && (
          <Text style={styles.description}>{playlist.description}</Text>
        )}
        <Text style={styles.meta}>{tracks.length} músicas</Text>
      </View>

      <View style={styles.tracks}>
        {tracks.map((playlistTrack) => (
          <View key={playlistTrack.track.id} style={styles.trackContainer}>
            <TrackItem
              title={playlistTrack.track.title}
              artist={playlistTrack.track.artist?.name || 'Artista desconhecido'}
              duration={playlistTrack.track.duration}
              onPress={() => handlePlayTrack(playlistTrack.track)}
              style={styles.trackItem}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  cover: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  meta: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  tracks: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  trackContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  trackItem: {
    flex: 1,
  },
});

