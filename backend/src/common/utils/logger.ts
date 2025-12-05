/** Sistema de logging centralizado (suprime logs em produção) */
class Logger {
  private readonly isDevelopment: boolean;

  constructor() {
    // Usa process.env diretamente para evitar dependência circular
    this.isDevelopment = (process.env.NODE_ENV || 'development') === 'development';
  }

  /** Log de informações (apenas em desenvolvimento) */
  info(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, ...args);
    }
  }

  /** Log de avisos (apenas em desenvolvimento) */
  warn(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  /** Log de erros (sempre exibido) */
  error(message: string, error?: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error || '');
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error(`[ERROR] ${message}`, errorMessage);
    
    if (this.isDevelopment && errorStack) {
      console.error('[STACK]', errorStack);
    }
  }

  /** Log de debug (apenas em desenvolvimento) */
  debug(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
}

/** Instância singleton do logger */
export const logger = new Logger();

