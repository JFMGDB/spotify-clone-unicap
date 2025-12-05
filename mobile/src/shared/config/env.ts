import Constants from 'expo-constants';

/** Configurações de ambiente da aplicação */
export const env = {
  /** URL base da API backend */
  API_URL: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000',
};

