import apiClient from '@/src/shared/lib/api-client';

export interface Track {
  id: string;
  title: string;
  albumId?: string;
  artistId: string;
  duration: number;
  audioUrl: string;
  trackNumber?: number;
  createdAt: string;
  updatedAt: string;
  artist?: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  album?: {
    id: string;
    title: string;
    coverUrl?: string;
  };
}

export const tracksService = {
  getAll: async (search?: string): Promise<Track[]> => {
    const params = search ? { search } : {};
    const response = await apiClient.get('/api/tracks', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Track> => {
    const response = await apiClient.get(`/api/tracks/${id}`);
    return response.data;
  },

  getByAlbumId: async (albumId: string): Promise<Track[]> => {
    const response = await apiClient.get(`/api/tracks/album/${albumId}`);
    return response.data;
  },

  getByArtistId: async (artistId: string): Promise<Track[]> => {
    const response = await apiClient.get(`/api/tracks/artist/${artistId}`);
    return response.data;
  },
};

