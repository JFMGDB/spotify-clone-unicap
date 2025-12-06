/**
 * Utilitário para tratamento de erros da API
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Mapeia códigos de erro para mensagens amigáveis ao usuário
 */
const ERROR_MESSAGES: Record<string, string> = {
  // Erros de autenticação
  UNAUTHORIZED: 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.',
  INVALID_TOKEN: 'Sua sessão expirou. Por favor, faça login novamente.',
  NO_TOKEN: 'Você precisa estar autenticado para realizar esta ação.',
  
  // Erros de validação
  VALIDATION_ERROR: 'Por favor, verifique os dados informados e tente novamente.',
  INVALID_INPUT: 'Os dados informados são inválidos. Verifique e tente novamente.',
  
  // Erros de existência
  ALREADY_EXISTS: 'Este email já está cadastrado. Tente fazer login ou use outro email.',
  
  // Erros gerais
  NOT_FOUND: 'O recurso solicitado não foi encontrado.',
  FORBIDDEN: 'Você não tem permissão para realizar esta ação.',
  INTERNAL_ERROR: 'Ocorreu um erro interno. Tente novamente mais tarde.',
  DATABASE_ERROR: 'Erro ao acessar o banco de dados. Tente novamente mais tarde.',
};

/**
 * Mapeia status HTTP para mensagens amigáveis
 */
function getMessageFromStatus(status: number, code?: string): string {
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  switch (status) {
    case 400:
      return 'Dados inválidos. Verifique as informações e tente novamente.';
    case 401:
      return 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
    case 403:
      return 'Você não tem permissão para realizar esta ação.';
    case 404:
      return 'Recurso não encontrado.';
    case 409:
      return 'Este email já está cadastrado. Tente fazer login ou use outro email.';
    case 500:
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    case 503:
      return 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
    default:
      return 'Erro ao processar requisição. Tente novamente.';
  }
}

/**
 * Extrai mensagem de erro de uma resposta da API de forma amigável
 */
export function getErrorMessage(error: unknown): string {
  // Erro de rede (sem conexão)
  if (isNetworkError(error)) {
    return 'Sem conexão com a internet. Verifique sua conexão e tente novamente.';
  }

  // Erro de timeout
  if (isTimeoutError(error)) {
    return 'A requisição demorou muito para responder. Verifique sua conexão e tente novamente.';
  }

  // Erro com response da API
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { 
      response?: { 
        status?: number;
        data?: { 
          error?: { 
            message?: string;
            code?: string;
          } 
        } 
      } 
    };
    
    const status = apiError.response?.status;
    const code = apiError.response?.data?.error?.code;
    const message = apiError.response?.data?.error?.message;

    // Se houver código de erro, usa o mapeamento
    if (code && ERROR_MESSAGES[code]) {
      return ERROR_MESSAGES[code];
    }

    // Se houver mensagem específica do backend, usa ela
    if (message) {
      return message;
    }

    // Se houver status, usa o mapeamento por status
    if (status) {
      return getMessageFromStatus(status, code);
    }
  }

  // Erro com mensagem direta
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = String(error.message);
    
    // Verifica se é uma mensagem de erro conhecida
    if (errorMessage.includes('Network Error') || errorMessage.includes('network')) {
      return 'Sem conexão com a internet. Verifique sua conexão e tente novamente.';
    }
    
    if (errorMessage.includes('timeout')) {
      return 'A requisição demorou muito para responder. Verifique sua conexão e tente novamente.';
    }

    return errorMessage;
  }
  
  return 'Ocorreu um erro inesperado. Tente novamente.';
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
  if (error && typeof error === 'object') {
    // Erro do Axios sem response (sem conexão)
    if ('response' in error && !(error as any).response) {
      return true;
    }
    
    if ('message' in error) {
      const message = String(error.message).toLowerCase();
      return message.includes('network') || 
             message.includes('fetch') || 
             message.includes('econnrefused') ||
             message.includes('enotfound');
    }
  }
  return false;
}

/**
 * Verifica se o erro é de timeout
 */
export function isTimeoutError(error: unknown): boolean {
  if (error && typeof error === 'object') {
    if ('code' in error && String(error.code) === 'ECONNABORTED') {
      return true;
    }
    
    if ('message' in error) {
      const message = String(error.message).toLowerCase();
      return message.includes('timeout');
    }
  }
  return false;
}

