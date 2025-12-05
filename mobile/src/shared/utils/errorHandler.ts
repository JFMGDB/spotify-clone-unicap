/**
 * Utilitário para tratamento de erros da API
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Extrai mensagem de erro de uma resposta da API
 */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { data?: { error?: { message?: string } } } };
    return apiError.response?.data?.error?.message || 'Erro ao processar requisição';
  }
  
  return 'Erro desconhecido';
}

/**
 * Verifica se o erro é de autenticação
 */
export function isAuthError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { status?: number } };
    return apiError.response?.status === 401;
  }
  return false;
}

/**
 * Verifica se o erro é de rede (sem conexão)
 */
export function isNetworkError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String(error.message).toLowerCase();
    return message.includes('network') || message.includes('timeout') || message.includes('fetch');
  }
  return false;
}

