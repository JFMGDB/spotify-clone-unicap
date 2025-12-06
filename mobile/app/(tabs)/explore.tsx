import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { tracksService, Track } from '@/src/features/tracks/services/tracks.service';
import { artistsService, Artist } from '@/src/features/artists/services/artists.service';
import { albumsService, Album } from '@/src/features/albums/services/albums.service';
import { Card } from '@/src/shared/components/Card';
import { TrackItem } from '@/src/shared/components/TrackItem';
import { LoadingSpinner } from '@/src/shared/components/LoadingSpinner';
import { colors } from '@/src/shared/theme/colors';
import { spacing } from '@/src/shared/theme/spacing';
import { typography } from '@/src/shared/theme/typography';
import { router } from 'expo-router';
import { useTrackPlayer } from '@/src/shared/hooks/useTrackPlayer';
import { getErrorMessage } from '@/src/shared/utils/errorHandler';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { playTrack } = useTrackPlayer();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setTracks([]);
      setArtists([]);
      setAlbums([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [tracksData, artistsData, albumsData] = await Promise.all([
        tracksService.getAll(query.trim()),
        artistsService.getAll(query.trim()),
        albumsService.getAll(query.trim()),
      ]);

      setTracks(tracksData);
      setArtists(artistsData);
      setAlbums(albumsData);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setTracks([]);
      setArtists([]);
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Limpar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Se a query estiver vazia, limpar resultados imediatamente
    if (!query.trim()) {
      setTracks([]);
      setArtists([]);
      setAlbums([]);
      setError(null);
      return;
    }

    // Debounce: aguardar 500ms antes de fazer a busca
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 500);
  };

  // Limpar timeout ao desmontar o componente
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handlePlayTrack = async (track: Track) => {
    await playTrack(track, tracks);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar músicas, artistas, álbuns..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : searchQuery.trim() && tracks.length === 0 && artists.length === 0 && albums.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum resultado encontrado para "{searchQuery}"</Text>
        </View>
      ) : (
        <FlatList
          data={[
            ...(tracks.length > 0 ? [{ type: 'tracks', data: tracks }] : []),
            ...(artists.length > 0 ? [{ type: 'artists', data: artists }] : []),
            ...(albums.length > 0 ? [{ type: 'albums', data: albums }] : []),
          ]}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          renderItem={({ item }) => {
            if (item.type === 'tracks') {
              const tracksData = item.data as Track[];
              return (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Músicas</Text>
                  {tracksData.map((track) => (
                    <TrackItem
                      key={track.id}
                      title={track.title}
                      artist={track.artist?.name || 'Artista desconhecido'}
                      duration={track.duration}
                      onPress={() => handlePlayTrack(track)}
                    />
                  ))}
                </View>
              );
            }

            if (item.type === 'artists') {
              const artistsData = item.data as Artist[];
              return (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Artistas</Text>
                  <FlatList
                    data={artistsData}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(artist) => artist.id}
                    renderItem={({ item: artist }) => (
                      <Card
                        title={artist.name}
                        imageUrl={artist.imageUrl}
                        onPress={() => router.push(`/artist/${artist.id}`)}
                        style={styles.card}
                      />
                    )}
                    contentContainerStyle={styles.listContent}
                  />
                </View>
              );
            }

            if (item.type === 'albums') {
              const albumsData = item.data as Album[];
              return (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Álbuns</Text>
                  <FlatList
                    data={albumsData}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(album) => album.id}
                    renderItem={({ item: album }) => (
                      <Card
                        title={album.title}
                        subtitle={album.artist?.name}
                        imageUrl={album.coverUrl}
                        onPress={() => router.push(`/album/${album.id}`)}
                        style={styles.card}
                      />
                    )}
                    contentContainerStyle={styles.listContent}
                  />
                </View>
              );
            }

            return null;
          }}
          contentContainerStyle={styles.content}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  searchInput: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    paddingBottom: spacing.xl,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
