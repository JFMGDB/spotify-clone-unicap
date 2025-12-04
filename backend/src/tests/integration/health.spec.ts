import request from 'supertest';
import { createApp } from '../../app';

/** Testes de integração para o endpoint de health check */
describe('Health Check', () => {
  const app = createApp();

  it('deve retornar status 200 e { status: "ok" }', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toEqual({ status: 'ok' });
  });

  it('deve retornar 404 para rotas inexistentes', async () => {
    const response = await request(app)
      .get('/rota-inexistente')
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('message');
    expect(response.body.error).toHaveProperty('code');
  });
});

