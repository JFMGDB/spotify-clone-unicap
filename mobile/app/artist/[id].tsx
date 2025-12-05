import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { artistsService, Artist } from '@/src/features/artists/services/artists.service';
import { albumsService, Album } from '@/src/features/albums/services/albums.service';
import { tracksService, Track } from '@/src/features/tracks/services/tracks.service';
import { Card } from '@/src/shared/components/Card';
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

export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
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

      const [artistData, albumsData, tracksData] = await Promise.all([
        artistsService.getById(id),
        albumsService.getByArtistId(id),
        tracksService.getByArtistId(id),
      ]);

      setArtist(artistData);
      setAlbums(albumsData);
      setTracks(tracksData.slice(0, 10)); // Limita a 10 músicas
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = async (track: Track) => {
    await playTrack(track, tracks);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !artist) {
    return <ErrorMessage message={error || 'Artista não encontrado'} onRetry={loadData} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {artist.imageUrl && (
          <Image source={{ uri: artist.imageUrl }} style={styles.image} />
        )}
        <Text style={styles.name}>{artist.name}</Text>
        {artist.bio && <Text style={styles.bio}>{artist.bio}</Text>}
      </View>

      {tracks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Músicas populares</Text>
          {tracks.map((track) => (
            <View key={track.id} style={styles.trackContainer}>
              <TrackItem
                title={track.title}
                artist={artist.name}
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
      )}

      {selectedTrackId && (
        <AddToPlaylistModal
          visible={showAddToPlaylist}
          onClose={() => {
            setShowAddToPlaylist(false);
            setSelectedTrackId(null);
          }}
          trackId={selectedTrackId}
        />
      )}

      {albums.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Álbuns</Text>
          <FlatList
            data={albums}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card
                title={item.title}
                subtitle={item.artist?.name}
                imageUrl={item.coverUrl}
                onPress={() => router.push(`/album/${item.id}`)}
                style={styles.card}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        </View>
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  name: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  bio: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: 160,
    marginRight: spacing.md,
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: spacing.xs,
    marginHorizontal: spacing.md,
    overflow: 'hidden',
  },
  trackItem: {
    flex: 1,
  },
  addButton: {
    padding: spacing.md,
  },
});

