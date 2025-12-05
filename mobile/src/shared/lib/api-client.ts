import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { env } from '../config/env';

/** Cliente Axios configurado para a API */
const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Interceptor para adicionar token JWT automaticamente */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token && token.trim()) {
        // Garante que o header seja definido corretamente
        if (!config.headers) {
          config.headers = {} as any;
        }
        config.headers.Authorization = `Bearer ${token.trim()}`;
      } else {
        console.warn('Token não encontrado no AsyncStorage para requisição:', config.url);
        // Não bloqueia a requisição, mas o backend retornará 401 se necessário
      }
    } catch (error) {
      console.error('Erro ao obter token do AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/** Interceptor para tratar erros de resposta */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado - limpa token e redireciona para login
      try {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('auth_user');
      } catch (storageError) {
        console.error('Erro ao remover token:', storageError);
      }
    }
    
    // Formata mensagem de erro para facilitar uso
    if (error.response?.data?.error) {
      error.message = error.response.data.error.message || 'Erro ao processar requisição';
      error.code = error.response.data.error.code;
    } else if (!error.message) {
      error.message = error.response?.status === 500
        ? 'Erro interno do servidor'
        : error.response?.status === 404
        ? 'Recurso não encontrado'
        : 'Erro ao processar requisição';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

