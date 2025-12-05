import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Audio } from 'expo-av';

interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  duration: number;
  audioUrl: string;
  albumId?: string;
  coverUrl?: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  position: number;
  duration: number;
  play: (track: Track, queue?: Track[]) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  addToQueue: (tracks: Track[]) => void;
  clearQueue: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const soundRef = useRef<Audio.Sound | null>(null);
  const positionUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const queueRef = useRef<Track[]>([]);
  const currentIndexRef = useRef<number>(-1);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (positionUpdateIntervalRef.current) {
        clearInterval(positionUpdateIntervalRef.current);
      }
    };
  }, []);

  const updatePosition = async () => {
    if (soundRef.current) {
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          setPosition(status.positionMillis || 0);
          setDuration(status.durationMillis || 0);
        }
      } catch (error) {
        console.error('Erro ao atualizar posição:', error);
      }
    }
  };

  const play = async (track: Track, newQueue?: Track[]) => {
    try {
      // Para o áudio atual se estiver tocando
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Configura a fila
      if (newQueue) {
        setQueue(newQueue);
        queueRef.current = newQueue;
        const index = newQueue.findIndex((t) => t.id === track.id);
        const finalIndex = index >= 0 ? index : 0;
        setCurrentIndex(finalIndex);
        currentIndexRef.current = finalIndex;
      } else {
        setCurrentIndex(0);
        currentIndexRef.current = 0;
        queueRef.current = [track];
      }

      setCurrentTrack(track);

      // Configura o áudio
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;
      setIsPlaying(true);

      // Atualiza posição periodicamente
      positionUpdateIntervalRef.current = setInterval(updatePosition, 1000);

      // Listener para quando terminar
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            // Só avança se houver próxima música na queue
            if (queueRef.current.length > 0 && currentIndexRef.current < queueRef.current.length - 1) {
              next();
            } else {
              setIsPlaying(false);
              setPosition(0);
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao reproduzir:', error);
      setIsPlaying(false);
    }
  };

  const pause = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
        if (positionUpdateIntervalRef.current) {
          clearInterval(positionUpdateIntervalRef.current);
        }
      } catch (error) {
        console.error('Erro ao pausar:', error);
      }
    }
  };

  const resume = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.playAsync();
        setIsPlaying(true);
        positionUpdateIntervalRef.current = setInterval(updatePosition, 1000);
      } catch (error) {
        console.error('Erro ao retomar:', error);
      }
    }
  };

  const next = async () => {
    if (queueRef.current.length > 0 && currentIndexRef.current < queueRef.current.length - 1) {
      const nextIndex = currentIndexRef.current + 1;
      const nextTrack = queueRef.current[nextIndex];
      setCurrentIndex(nextIndex);
      currentIndexRef.current = nextIndex;
      await play(nextTrack, queueRef.current);
    }
  };

  const previous = async () => {
    if (queueRef.current.length > 0 && currentIndexRef.current > 0) {
      const prevIndex = currentIndexRef.current - 1;
      const prevTrack = queueRef.current[prevIndex];
      setCurrentIndex(prevIndex);
      currentIndexRef.current = prevIndex;
      await play(prevTrack, queueRef.current);
    }
  };

  const seekTo = async (positionMillis: number) => {
    if (soundRef.current) {
      try {
        await soundRef.current.setPositionAsync(positionMillis);
        setPosition(positionMillis);
      } catch (error) {
        console.error('Erro ao buscar posição:', error);
      }
    }
  };

  const addToQueue = (tracks: Track[]) => {
    setQueue((prev) => {
      const newQueue = [...prev, ...tracks];
      queueRef.current = newQueue;
      return newQueue;
    });
  };

  const clearQueue = () => {
    setQueue([]);
    queueRef.current = [];
    setCurrentIndex(-1);
    currentIndexRef.current = -1;
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        position,
        duration,
        play,
        pause,
        resume,
        next,
        previous,
        seekTo,
        addToQueue,
        clearQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer deve ser usado dentro de um PlayerProvider');
  }
  return context;
}

