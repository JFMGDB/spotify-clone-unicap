import { useState } from 'react';
import { playlistsService } from '@/src/features/playlists/services/playlists.service';
import { Alert } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function usePlaylistActions() {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const createPlaylist = async (name: string, description?: string) => {
    try {
      // Verifica se está autenticado antes de criar
      if (!isAuthenticated) {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          Alert.alert('Erro', 'Você precisa estar autenticado para criar uma playlist');
          throw new Error('Não autenticado');
        }
      }

      setLoading(true);
      const playlist = await playlistsService.create({
        name,
        description,
        isPublic: false,
      });
      Alert.alert('Sucesso', 'Playlist criada com sucesso!');
      return playlist;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || 'Erro ao criar playlist';
      Alert.alert('Erro', message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
    try {
      setLoading(true);
      await playlistsService.addTrack(playlistId, trackId);
      Alert.alert('Sucesso', 'Música adicionada à playlist!');
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Erro ao adicionar música';
      Alert.alert('Erro', message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    try {
      setLoading(true);
      await playlistsService.removeTrack(playlistId, trackId);
      Alert.alert('Sucesso', 'Música removida da playlist!');
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Erro ao remover música';
      Alert.alert('Erro', message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
  };
}

