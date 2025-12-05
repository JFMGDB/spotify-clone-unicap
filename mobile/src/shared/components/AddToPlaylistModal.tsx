import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { playlistsService, Playlist } from '@/src/features/playlists/services/playlists.service';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useAuth } from '@/src/contexts/AuthContext';
import { usePlaylistActions } from '../hooks/usePlaylistActions';

interface AddToPlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  trackId: string;
  onSuccess?: () => void;
}

export function AddToPlaylistModal({
  visible,
  onClose,
  trackId,
  onSuccess,
}: AddToPlaylistModalProps) {
  const { user } = useAuth();
  const { addTrackToPlaylist, loading: actionLoading } = usePlaylistActions();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && user) {
      loadPlaylists();
    }
  }, [visible, user]);

  const loadPlaylists = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await playlistsService.getByUserId(user.id);
      setPlaylists(data);
    } catch (error) {
      console.error('Erro ao carregar playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      await addTrackToPlaylist(playlistId, trackId);
      onSuccess?.();
      onClose();
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Adicionar à Playlist</Text>

          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : playlists.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Você não tem playlists ainda</Text>
            </View>
          ) : (
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.playlistItem}
                  onPress={() => handleAddToPlaylist(item.id)}
                  disabled={actionLoading}
                >
                  <Text style={styles.playlistName}>{item.name}</Text>
                  {item.description && (
                    <Text style={styles.playlistDescription} numberOfLines={1}>
                      {item.description}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              style={styles.list}
            />
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  loading: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  list: {
    maxHeight: 400,
  },
  playlistItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  playlistName: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  playlistDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  closeButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});

