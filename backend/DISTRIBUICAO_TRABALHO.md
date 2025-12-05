# Distribuição de Trabalho - Backend Spotify Clone

Este documento divide os arquivos do backend entre 8 desenvolvedores para realização de commits em diferentes contas.

## Autor 1 - Módulo de Autenticação (Auth)

### Arquivos:
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/auth.service.ts`
- `src/modules/auth/auth.routes.ts`
- `src/modules/auth/auth.validators.ts`

### Descrição:
Responsável pela implementação completa do módulo de autenticação, incluindo registro de usuários, login, geração de tokens JWT e validações relacionadas.

---

## Autor 2 - Módulo de Usuários (Users)

### Arquivos:
- `src/modules/users/users.controller.ts`
- `src/modules/users/users.service.ts`
- `src/modules/users/users.routes.ts`

### Descrição:
Responsável pela implementação do módulo de usuários, incluindo busca de usuários por ID, busca do usuário autenticado e operações relacionadas.

---

## Autor 3 - Módulo de Artistas (Artists)

### Arquivos:
- `src/modules/artists/artists.controller.ts`
- `src/modules/artists/artists.service.ts`
- `src/modules/artists/artists.routes.ts`
- `src/modules/artists/artists.validators.ts`

### Descrição:
Responsável pela implementação completa do módulo de artistas, incluindo CRUD completo, busca por nome e validações.

---

## Autor 4 - Módulo de Álbuns (Albums)

### Arquivos:
- `src/modules/albums/albums.controller.ts`
- `src/modules/albums/albums.service.ts`
- `src/modules/albums/albums.routes.ts`
- `src/modules/albums/albums.validators.ts`

### Descrição:
Responsável pela implementação completa do módulo de álbuns, incluindo CRUD completo, busca por artista e validações.

---

## Autor 5 - Módulo de Tracks (Músicas)

### Arquivos:
- `src/modules/tracks/tracks.controller.ts`
- `src/modules/tracks/tracks.service.ts`
- `src/modules/tracks/tracks.routes.ts`
- `src/modules/tracks/tracks.validators.ts`

### Descrição:
Responsável pela implementação completa do módulo de tracks (músicas), incluindo CRUD completo, busca por álbum e artista, e validações.

---

## Autor 6 - Módulo de Playlists

### Arquivos:
- `src/modules/playlists/playlists.controller.ts`
- `src/modules/playlists/playlists.service.ts`
- `src/modules/playlists/playlists.routes.ts`
- `src/modules/playlists/playlists.validators.ts`

### Descrição:
Responsável pela implementação completa do módulo de playlists, incluindo CRUD completo, gerenciamento de tracks em playlists (adicionar/remover) e validações.

---

## Autor 7 - Infraestrutura e Configuração

### Arquivos:
- `src/config/db.ts`
- `src/config/env.ts`
- `src/db/schema.ts`
- `drizzle.config.ts`
- `src/common/errors/AppError.ts`
- `src/common/errors/error-codes.ts`
- `src/common/middleware/auth.middleware.ts`
- `src/common/middleware/error.middleware.ts`
- `src/common/utils/logger.ts`
- `src/common/utils/validation.ts`
- `src/common/types/express.d.ts`
- `src/routes/health.routes.ts`
- `src/routes/index.ts`
- `src/app.ts`
- `src/server.ts`
- `tsconfig.json`
- `jest.config.js`
- `jest.setup.js`
- `nodemon.json`
- `package.json`

### Descrição:
Responsável pela infraestrutura base da aplicação, incluindo configuração do banco de dados, variáveis de ambiente, schema do banco, middlewares de autenticação e erro, utilitários comuns, rotas principais, configuração do servidor Express e arquivos de configuração do projeto.

---

## Autor 8 - Testes e Documentação

### Arquivos:
- `src/tests/integration/health.spec.ts`
- `src/tests/integration/api-tests.spec.ts`
- `README.md`
- `QUICK_START.md`
- `IMPLEMENTATION_GUIDE.md`
- `POSTMAN_GUIDE.md`
- `POSTMAN_DECISIONS.md`
- `setup-neon-db.md`
- `Spotify-Clone-API.postman_collection.json`

### Descrição:
Responsável pela implementação de testes de integração, testes de API e toda a documentação do projeto, incluindo guias de início rápido, guias de implementação, documentação do Postman e configuração do banco de dados.

---

## Observações Importantes

1. **Consistência**: Todos os módulos seguem o mesmo padrão de estrutura (controller, service, routes, validators).

2. **Dependências**: O Autor 7 (Infraestrutura) deve ser o primeiro a fazer commit, pois os outros módulos dependem desses arquivos base.

3. **Ordem Sugerida de Commits**:
   - Autor 7 (Infraestrutura) - Base do projeto
   - Autor 1 (Auth) - Sistema de autenticação
   - Autor 2 (Users) - Módulo de usuários
   - Autor 3 (Artists) - Módulo de artistas
   - Autor 4 (Albums) - Módulo de álbuns
   - Autor 5 (Tracks) - Módulo de tracks
   - Autor 6 (Playlists) - Módulo de playlists
   - Autor 8 (Testes) - Testes e documentação

4. **Padrões a Seguir**:
   - SOLID: Cada módulo segue o princípio de responsabilidade única
   - DRY: Utilitários comuns estão em `src/common/utils`
   - Componentização: Cada módulo é independente e reutilizável

5. **Arquivos de Migração**: As migrações do banco de dados (`src/db/migrations/`) devem ser geradas após o commit do schema pelo Autor 7.

