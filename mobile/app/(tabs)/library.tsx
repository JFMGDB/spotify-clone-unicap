import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { playlistsService, Playlist } from '@/src/features/playlists/services/playlists.service';
import { albumsService, Album } from '@/src/features/albums/services/albums.service';
import { Card } from '@/src/shared/components/Card';
import { LoadingSpinner } from '@/src/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/src/shared/components/ErrorMessage';
import { CreatePlaylistModal } from '@/src/shared/components/CreatePlaylistModal';
import { usePlaylistActions } from '@/src/shared/hooks/usePlaylistActions';
import { colors } from '@/src/shared/theme/colors';
import { spacing } from '@/src/shared/theme/spacing';
import { typography } from '@/src/shared/theme/typography';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getErrorMessage } from '@/src/shared/utils/errorHandler';

export default function LibraryScreen() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { createPlaylist } = usePlaylistActions();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const [playlistsData, albumsData] = await Promise.all([
        playlistsService.getByUserId(user.id),
        albumsService.getAll(),
      ]);

      setPlaylists(playlistsData);
      setAlbums(albumsData);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (name: string, description?: string) => {
    await createPlaylist(name, description);
    await loadData();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sua Biblioteca</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <IconSymbol name="plus" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <CreatePlaylistModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreatePlaylist}
      />

      {playlists.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suas Playlists</Text>
          <FlatList
            data={playlists}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card
                title={item.name}
                subtitle={item.description}
                imageUrl={item.coverUrl}
                onPress={() => router.push(`/playlist/${item.id}`)}
                style={styles.card}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}

      {albums.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Álbuns</Text>
          <FlatList
            data={albums}
            numColumns={2}
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

      {playlists.length === 0 && albums.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Sua biblioteca está vazia</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    flex: 1,
  },
  addButton: {
    padding: spacing.sm,
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
    flex: 1,
    margin: spacing.sm,
    maxWidth: '48%',
  },
  empty: {
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

