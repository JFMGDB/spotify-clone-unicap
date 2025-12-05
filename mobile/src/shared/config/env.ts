import Constants from 'expo-constants';

/** URL da API em producao */
const PRODUCTION_API_URL = 'https://spotify-clone-unicap.vercel.app';

/** URL da API em desenvolvimento (altere para seu IP local) */
const DEVELOPMENT_API_URL = 'http://localhost:3000';

/** Verifica se esta em modo de desenvolvimento */
const isDevelopment = __DEV__;

/** Configurações de ambiente da aplicação */
export const env = {
  /** URL base da API backend */
  API_URL: isDevelopment 
    ? (Constants.expoConfig?.extra?.apiUrl || DEVELOPMENT_API_URL)
    : PRODUCTION_API_URL,
};

