import apiClient from '@/src/shared/lib/api-client';

export interface Album {
  id: string;
  title: string;
  artistId: string;
  coverUrl?: string;
  releaseDate?: string;
  createdAt: string;
  updatedAt: string;
  artist?: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

export const albumsService = {
  getAll: async (search?: string): Promise<Album[]> => {
    const params = search ? { search } : {};
    const response = await apiClient.get('/api/albums', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Album> => {
    const response = await apiClient.get(`/api/albums/${id}`);
    return response.data;
  },

  getByArtistId: async (artistId: string): Promise<Album[]> => {
    const response = await apiClient.get(`/api/albums/artist/${artistId}`);
    return response.data;
  },
};

