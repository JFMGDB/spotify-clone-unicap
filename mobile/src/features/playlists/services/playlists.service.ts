import apiClient from '@/src/shared/lib/api-client';

export interface Playlist {
  id: string;
  name: string;
  userId: string;
  description?: string;
  coverUrl?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistTrack {
  track: {
    id: string;
    title: string;
    artistId: string;
    duration: number;
    audioUrl: string;
    artist?: {
      id: string;
      name: string;
    };
  };
  addedAt: string;
}

export const playlistsService = {
  getAll: async (): Promise<Playlist[]> => {
    const response = await apiClient.get('/api/playlists');
    return response.data;
  },

  getById: async (id: string): Promise<Playlist> => {
    const response = await apiClient.get(`/api/playlists/${id}`);
    return response.data;
  },

  getByUserId: async (userId: string): Promise<Playlist[]> => {
    const response = await apiClient.get(`/api/playlists/user/${userId}`);
    return response.data;
  },

  getTracks: async (playlistId: string): Promise<PlaylistTrack[]> => {
    const response = await apiClient.get(`/api/playlists/${playlistId}/tracks`);
    return response.data;
  },

  create: async (data: {
    name: string;
    description?: string;
    coverUrl?: string;
    isPublic?: boolean;
  }): Promise<Playlist> => {
    const response = await apiClient.post('/api/playlists', data);
    return response.data;
  },

  update: async (
    id: string,
    data: {
      name?: string;
      description?: string;
      coverUrl?: string;
      isPublic?: boolean;
    }
  ): Promise<Playlist> => {
    const response = await apiClient.put(`/api/playlists/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/playlists/${id}`);
  },

  addTrack: async (playlistId: string, trackId: string): Promise<void> => {
    await apiClient.post(`/api/playlists/${playlistId}/tracks`, { trackId });
  },

  removeTrack: async (playlistId: string, trackId: string): Promise<void> => {
    await apiClient.delete(`/api/playlists/${playlistId}/tracks/${trackId}`);
  },
};

