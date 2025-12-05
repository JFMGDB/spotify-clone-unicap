import { usePlayer } from '@/src/contexts/PlayerContext';
import { Track } from '@/src/features/tracks/services/tracks.service';
import { Album } from '@/src/features/albums/services/albums.service';

/**
 * Hook para facilitar a reprodução de tracks
 * Centraliza a lógica de conversão de Track para o formato do Player
 */
export function useTrackPlayer() {
  const { play } = usePlayer();

  const playTrack = async (
    track: Track,
    queue?: Track[],
    album?: Album | null
  ) => {
    const trackForPlayer = {
      id: track.id,
      title: track.title,
      artist: track.artist?.name || 'Artista desconhecido',
      artistId: track.artistId,
      duration: track.duration,
      audioUrl: track.audioUrl,
      albumId: track.albumId,
      coverUrl: track.album?.coverUrl || album?.coverUrl,
    };

    if (queue) {
      const queueForPlayer = queue.map((t) => ({
        id: t.id,
        title: t.title,
        artist: t.artist?.name || 'Artista desconhecido',
        artistId: t.artistId,
        duration: t.duration,
        audioUrl: t.audioUrl,
        albumId: t.albumId,
        coverUrl: t.album?.coverUrl || album?.coverUrl,
      }));
      await play(trackForPlayer, queueForPlayer);
    } else {
      await play(trackForPlayer);
    }
  };

  return { playTrack };
}

