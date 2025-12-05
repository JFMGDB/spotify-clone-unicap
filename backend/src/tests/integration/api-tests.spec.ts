import request from 'supertest';
import { createApp } from '../../app';

/** Testes de integração para todas as funcionalidades da API conforme TESTING_GUIDE.md */
describe('API Tests - Spotify Clone', () => {
  const app = createApp();
  let authToken: string;
  let userId: string;
  let artistId: string;
  let albumId: string;
  let trackId: string;
  let playlistId: string;

  // Passo 1: Configuração Inicial - Health Check
  describe('Passo 1: Configuração Inicial', () => {
    it('deve retornar status 200 e { status: "ok" } no health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  // Passo 2: Testes de Autenticação
  describe('Passo 2: Testes de Autenticação', () => {
    const testUser = {
      name: 'João Silva',
      email: `joao${Date.now()}@example.com`,
      password: 'senha123',
    };

    it('2.1 - deve registrar um novo usuário com sucesso', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: testUser.name,
          email: testUser.email,
          password: testUser.password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.user).toHaveProperty('id');

      authToken = response.body.token;
      userId = response.body.user.id;
    });

    it('2.2 - deve fazer login com sucesso', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.token).toBeTruthy();

      authToken = response.body.token;
    });

    it('2.3.1 - deve rejeitar email inválido no registro', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Teste',
          email: 'email-invalido',
          password: 'senha123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('2.3.2 - deve rejeitar senha muito curta', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Teste',
          email: 'teste@example.com',
          password: '123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('2.3.3 - deve rejeitar email já cadastrado', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Teste',
          email: testUser.email,
          password: 'senha123',
        })
        .expect(409);

      expect(response.body).toHaveProperty('error');
    });

    it('2.3.4 - deve rejeitar credenciais inválidas no login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'senhaerrada',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  // Passo 3: Testes de Artistas
  describe('Passo 3: Testes de Artistas', () => {
    it('3.1 - deve criar um artista com sucesso', async () => {
      const response = await request(app)
        .post('/api/artists')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'The Beatles',
          imageUrl: 'https://example.com/beatles.jpg',
          bio: 'Banda de rock britânica formada em 1960',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('The Beatles');
      expect(response.body.bio).toBe('Banda de rock britânica formada em 1960');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      artistId = response.body.id;
    });

    it('3.2 - deve listar todos os artistas', async () => {
      const response = await request(app)
        .get('/api/artists')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('3.2 - deve buscar artistas por nome', async () => {
      const response = await request(app)
        .get('/api/artists')
        .query({ search: 'Beatles' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0].name.toLowerCase()).toContain('beatles');
      }
    });

    it('3.3 - deve buscar artista por ID', async () => {
      const response = await request(app)
        .get(`/api/artists/${artistId}`)
        .expect(200);

      expect(response.body.id).toBe(artistId);
      expect(response.body.name).toBe('The Beatles');
    });

    it('3.4 - deve atualizar artista', async () => {
      const response = await request(app)
        .put(`/api/artists/${artistId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bio: 'Nova biografia atualizada',
        })
        .expect(200);

      expect(response.body.bio).toBe('Nova biografia atualizada');
    });

    it('3.5 - deve deletar artista', async () => {
      await request(app)
        .delete(`/api/artists/${artistId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verifica se foi deletado
      await request(app)
        .get(`/api/artists/${artistId}`)
        .expect(404);
    });

    // Recria artista para testes seguintes
    it('3.1 - recria artista para testes seguintes', async () => {
      const response = await request(app)
        .post('/api/artists')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'The Beatles',
          imageUrl: 'https://example.com/beatles.jpg',
          bio: 'Banda de rock britânica formada em 1960',
        })
        .expect(201);

      artistId = response.body.id;
    });
  });

  // Passo 4: Testes de Álbuns
  describe('Passo 4: Testes de Álbuns', () => {
    it('4.1 - deve criar um álbum com sucesso', async () => {
      const response = await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Abbey Road',
          artistId: artistId,
          coverUrl: 'https://example.com/abbey-road.jpg',
          releaseDate: '1969-09-26T00:00:00Z',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Abbey Road');
      expect(response.body.artistId).toBe(artistId);
      expect(response.body).toHaveProperty('createdAt');

      albumId = response.body.id;
    });

    it('4.2 - deve listar todos os álbuns', async () => {
      const response = await request(app)
        .get('/api/albums')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('4.3 - deve buscar álbuns de um artista', async () => {
      const response = await request(app)
        .get(`/api/albums/artist/${artistId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0].artistId).toBe(artistId);
      }
    });

    it('4.4 - deve buscar álbum por ID', async () => {
      const response = await request(app)
        .get(`/api/albums/${albumId}`)
        .expect(200);

      expect(response.body.id).toBe(albumId);
      expect(response.body.title).toBe('Abbey Road');
      expect(response.body).toHaveProperty('artist');
    });
  });

  // Passo 5: Testes de Tracks
  describe('Passo 5: Testes de Tracks', () => {
    it('5.1 - deve criar uma track com sucesso', async () => {
      const response = await request(app)
        .post('/api/tracks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Come Together',
          albumId: albumId,
          artistId: artistId,
          duration: 259,
          audioUrl: 'https://example.com/come-together.mp3',
          trackNumber: 1,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Come Together');
      expect(response.body.albumId).toBe(albumId);
      expect(response.body.artistId).toBe(artistId);
      expect(response.body.duration).toBe(259);

      trackId = response.body.id;
    });

    it('5.2 - deve listar todas as tracks', async () => {
      const response = await request(app)
        .get('/api/tracks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('5.3 - deve buscar tracks de um álbum', async () => {
      const response = await request(app)
        .get(`/api/tracks/album/${albumId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0].albumId).toBe(albumId);
      }
    });

    it('5.4 - deve buscar tracks de um artista', async () => {
      const response = await request(app)
        .get(`/api/tracks/artist/${artistId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0].artistId).toBe(artistId);
      }
    });
  });

  // Passo 6: Testes de Playlists
  describe('Passo 6: Testes de Playlists', () => {
    it('6.1 - deve criar uma playlist com sucesso', async () => {
      const response = await request(app)
        .post('/api/playlists')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Minhas Favoritas',
          description: 'Músicas que eu mais gosto',
          coverUrl: 'https://example.com/playlist-cover.jpg',
          isPublic: true,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Minhas Favoritas');
      expect(response.body.description).toBe('Músicas que eu mais gosto');
      expect(response.body.isPublic).toBe(true);
      expect(response.body.userId).toBe(userId);

      playlistId = response.body.id;
    });

    it('6.2 - deve listar playlists (públicas e do usuário)', async () => {
      const response = await request(app)
        .get('/api/playlists')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('6.3 - deve buscar playlist por ID', async () => {
      const response = await request(app)
        .get(`/api/playlists/${playlistId}`)
        .expect(200);

      expect(response.body.id).toBe(playlistId);
      expect(response.body.name).toBe('Minhas Favoritas');
    });

    it('6.4 - deve adicionar track à playlist', async () => {
      const response = await request(app)
        .post(`/api/playlists/${playlistId}/tracks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          trackId: trackId,
        })
        .expect(201);

      expect(response.status).toBe(201);
    });

    it('6.5 - deve listar tracks de uma playlist', async () => {
      const response = await request(app)
        .get(`/api/playlists/${playlistId}/tracks`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('track');
      }
    });

    it('6.6 - deve remover track de uma playlist', async () => {
      await request(app)
        .delete(`/api/playlists/${playlistId}/tracks/${trackId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('6.7 - deve atualizar playlist', async () => {
      const response = await request(app)
        .put(`/api/playlists/${playlistId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Novo Nome',
          isPublic: false,
        })
        .expect(200);

      expect(response.body.name).toBe('Novo Nome');
      expect(response.body.isPublic).toBe(false);
    });

    it('6.8 - deve deletar playlist', async () => {
      await request(app)
        .delete(`/api/playlists/${playlistId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });
  });

  // Passo 8: Testes de Integração
  describe('Passo 8: Testes de Integração', () => {
    let testArtistId: string;
    let testAlbumId: string;
    let testTrackId: string;
    let testPlaylistId: string;

    it('8.1 - Fluxo completo: Criar Playlist e Adicionar Músicas', async () => {
      // 1. Criar artista
      const artistResponse = await request(app)
        .post('/api/artists')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Artista Teste' })
        .expect(201);
      testArtistId = artistResponse.body.id;

      // 2. Criar álbum
      const albumResponse = await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Álbum Teste',
          artistId: testArtistId,
        })
        .expect(201);
      testAlbumId = albumResponse.body.id;

      // 3. Criar tracks
      const trackResponse = await request(app)
        .post('/api/tracks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Música 1',
          albumId: testAlbumId,
          artistId: testArtistId,
          duration: 180,
          audioUrl: 'https://example.com/music1.mp3',
        })
        .expect(201);
      testTrackId = trackResponse.body.id;

      // 4. Criar playlist
      const playlistResponse = await request(app)
        .post('/api/playlists')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Playlist Teste' })
        .expect(201);
      testPlaylistId = playlistResponse.body.id;

      // 5. Adicionar músicas à playlist
      await request(app)
        .post(`/api/playlists/${testPlaylistId}/tracks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ trackId: testTrackId })
        .expect(201);

      // 6. Verificar playlist
      const playlistCheck = await request(app)
        .get(`/api/playlists/${testPlaylistId}`)
        .expect(200);
      expect(playlistCheck.body.name).toBe('Playlist Teste');

      // 7. Verificar tracks na playlist
      const tracksCheck = await request(app)
        .get(`/api/playlists/${testPlaylistId}/tracks`)
        .expect(200);
      expect(Array.isArray(tracksCheck.body)).toBe(true);
      expect(tracksCheck.body.length).toBeGreaterThan(0);
    });

    it('8.2.1 - deve retornar 401 ao acessar rota protegida sem token', async () => {
      await request(app)
        .get('/api/playlists')
        .expect(401);
    });

    it('8.2.2 - deve retornar 401 ao criar playlist sem autenticação', async () => {
      await request(app)
        .post('/api/playlists')
        .send({ name: 'Teste' })
        .expect(401);
    });
  });

  // Passo 9: Testes de Erros e Validações
  describe('Passo 9: Testes de Erros e Validações', () => {
    it('9.1.1 - deve retornar erro 400 para email inválido no registro', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Teste',
          email: 'email-invalido',
          password: 'senha123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('9.1.2 - deve retornar erro 400 para campos obrigatórios faltando', async () => {
      const response = await request(app)
        .post('/api/artists')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('9.1.3 - deve retornar erro 404 para ID inválido', async () => {
      const response = await request(app)
        .get('/api/artists/id-invalido')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});

