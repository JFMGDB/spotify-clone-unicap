import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { albumsService, Album } from '@/src/features/albums/services/albums.service';
import { tracksService, Track } from '@/src/features/tracks/services/tracks.service';
import { TrackItem } from '@/src/shared/components/TrackItem';
import { LoadingSpinner } from '@/src/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/src/shared/components/ErrorMessage';
import { AddToPlaylistModal } from '@/src/shared/components/AddToPlaylistModal';
import { colors } from '@/src/shared/theme/colors';
import { spacing } from '@/src/shared/theme/spacing';
import { typography } from '@/src/shared/theme/typography';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getErrorMessage } from '@/src/shared/utils/errorHandler';
import { useTrackPlayer } from '@/src/shared/hooks/useTrackPlayer';

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
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

      const [albumData, tracksData] = await Promise.all([
        albumsService.getById(id),
        tracksService.getByAlbumId(id),
      ]);

      setAlbum(albumData);
      setTracks(tracksData);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = async (track: Track) => {
    await playTrack(track, tracks, album);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !album) {
    return <ErrorMessage message={error || 'Álbum não encontrado'} onRetry={loadData} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {album.coverUrl && (
          <Image source={{ uri: album.coverUrl }} style={styles.cover} />
        )}
        <Text style={styles.title}>{album.title}</Text>
        <Text
          style={styles.artist}
          onPress={() => router.push(`/artist/${album.artistId}`)}
        >
          {album.artist?.name || 'Artista desconhecido'}
        </Text>
        {album.releaseDate && (
          <Text style={styles.meta}>
            {new Date(album.releaseDate).getFullYear()} • {tracks.length} músicas
          </Text>
        )}
      </View>

      <View style={styles.tracks}>
        {tracks.map((track) => (
          <View key={track.id} style={styles.trackContainer}>
            <TrackItem
              title={track.title}
              artist={track.artist?.name || 'Artista desconhecido'}
              duration={track.duration}
              onPress={() => handlePlayTrack(track)}
              style={styles.trackItem}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setSelectedTrackId(track.id);
                setShowAddToPlaylist(true);
              }}
            >
              <IconSymbol name="plus" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {selectedTrackId && (
        <AddToPlaylistModal
          visible={showAddToPlaylist}
          onClose={() => {
            setShowAddToPlaylist(false);
            setSelectedTrackId(null);
          }}
          trackId={selectedTrackId}
          onSuccess={() => {
            // Opcional: recarregar dados se necessário
          }}
        />
      )}
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
  artist: {
    ...typography.bodyBold,
    color: colors.primary,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  trackItem: {
    flex: 1,
  },
  addButton: {
    padding: spacing.md,
  },
});

