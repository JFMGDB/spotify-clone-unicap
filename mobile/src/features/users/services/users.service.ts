import apiClient from '@/src/shared/lib/api-client';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const usersService = {
  /** Busca informações do usuário autenticado */
  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  },

  /** Busca um usuário por ID */
  getById: async (id: string): Promise<UserProfile> => {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },
};

