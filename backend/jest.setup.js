// Configura variáveis de ambiente para testes
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.PORT = process.env.PORT || '3000';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8081';

