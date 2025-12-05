import apiClient from '@/src/shared/lib/api-client';

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export const artistsService = {
  getAll: async (search?: string): Promise<Artist[]> => {
    const params = search ? { search } : {};
    const response = await apiClient.get('/api/artists', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Artist> => {
    const response = await apiClient.get(`/api/artists/${id}`);
    return response.data;
  },
};

