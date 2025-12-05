import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { playlistsService, Playlist } from '@/src/features/playlists/services/playlists.service';
import { albumsService, Album } from '@/src/features/albums/services/albums.service';
import { Card } from '@/src/shared/components/Card';
import { LoadingSpinner } from '@/src/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/src/shared/components/ErrorMessage';
import { colors } from '@/src/shared/theme/colors';
import { spacing } from '@/src/shared/theme/spacing';
import { typography } from '@/src/shared/theme/typography';
import { router } from 'expo-router';
import { getErrorMessage } from '@/src/shared/utils/errorHandler';

export default function HomeScreen() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [playlistsData, albumsData] = await Promise.all([
        playlistsService.getAll(),
        albumsService.getAll(),
      ]);

      setPlaylists(playlistsData.slice(0, 6));
      setAlbums(albumsData.slice(0, 6));
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.name || 'Usuário'}</Text>
          <Text style={styles.subtitle}>O que você quer ouvir hoje?</Text>
        </View>

        {playlists.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suas playlists</Text>
            <FlatList
              data={playlists}
              horizontal
              showsHorizontalScrollIndicator={false}
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
            <Text style={styles.sectionTitle}>Álbuns populares</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  greeting: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
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
});
