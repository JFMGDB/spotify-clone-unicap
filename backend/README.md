# Spotify Clone - Backend

> Ultima atualizacao: 05/12/2025

API REST desenvolvida em Node.js + Express.js + TypeScript com Drizzle ORM e PostgreSQL (Neon DB).

---

## Integrantes

| Nome | RA |
|------|-----|
| Jose Felipe Morais Guerra de Barros | 00000853793 |
| Jamilli Maria Francisca da Silva | 00000854174 |
| Enio Ramos Bezerra | 00000003364 |
| Debora Lais Macedo da Silva | 00000851133 |
| Ailton Cesar Anizio dos Santos | 00000029548 |
| Jose Gabriel Barros dos Santos | 00000847959 |
| Walbert Pereira de Lima | 00000851041 |
| Anderson Marcone da Silva Marinho | 00000853760 |

---

## Inicio Rapido

### Pre-requisitos

- Node.js v20.x LTS ou superior
- npm ou yarn
- Conta no Neon DB (ou PostgreSQL local)

### Instalacao

1. **Instale as dependencias:**

```bash
cd backend
npm install
```

2. **Configure as variaveis de ambiente:**

Crie um arquivo `.env` na raiz de `backend/` com o seguinte conteudo:

```env
# Banco de Dados
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# JWT (Autenticacao)
JWT_SECRET=sua-chave-secreta-super-segura-aqui
JWT_EXPIRES_IN=1h

# Servidor
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:8081
```

**Como obter DATABASE_URL:**
- **Neon DB** (recomendado): Acesse https://neon.tech, crie um projeto e copie a connection string
- **PostgreSQL local**: `postgresql://usuario:senha@localhost:5432/nome_banco?sslmode=disable`

**Como gerar JWT_SECRET:**

```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

3. **Aplique as migrations:**

```bash
npm run db:generate
npm run db:migrate
```

4. **Inicie o servidor:**

```bash
npm run dev
```

O servidor estara disponivel em `http://localhost:3000`

### Testar Health Check

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

---

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configuracoes (DB, env, logger)
│   ├── db/              # Schema Drizzle, migrations, seeds
│   ├── common/          # Codigo compartilhado (middlewares, utils, types)
│   ├── modules/         # Modulos por dominio (auth, users, artists, etc.)
│   ├── routes/          # Agregacao de rotas
│   └── tests/           # Testes automatizados
├── docs/                # Documentacao
├── drizzle.config.ts    # Configuracao do Drizzle Kit
└── package.json
```

---

## Scripts Disponiveis

| Script | Descricao |
|--------|-----------|
| `npm run dev` | Inicia servidor em modo desenvolvimento (nodemon) |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm run start` | Inicia servidor em producao (apos build) |
| `npm test` | Executa testes |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:coverage` | Gera relatorio de cobertura |
| `npm run db:generate` | Gera migrations do Drizzle |
| `npm run db:migrate` | Aplica migrations no banco |
| `npm run db:push` | Push direto do schema (dev apenas) |
| `npm run db:studio` | Abre Drizzle Studio (interface visual do banco) |
| `npm run db:seed` | Popula o banco com dados de exemplo |

---

## Tecnologias

| Tecnologia | Descricao |
|------------|-----------|
| Express.js | Framework web |
| TypeScript | Tipagem estatica |
| Drizzle ORM | ORM type-safe para PostgreSQL |
| PostgreSQL (Neon DB) | Banco de dados |
| Jest | Framework de testes |
| bcrypt | Hash de senhas |
| jsonwebtoken | Autenticacao JWT |

---

## Arquitetura

O projeto segue uma arquitetura modular baseada em dominios, aplicando os principios SOLID e DRY.

### Estrutura de Modulos

Cada modulo segue o padrao:

```
modules/{nome}/
├── {nome}.controller.ts   # Handlers HTTP
├── {nome}.service.ts      # Logica de negocio
├── {nome}.routes.ts       # Definicao de rotas
└── {nome}.validators.ts   # Validacoes (quando aplicavel)
```

### Modulos Disponiveis

| Modulo | Descricao |
|--------|-----------|
| auth | Autenticacao (register, login) |
| users | Gerenciamento de usuarios |
| artists | CRUD de artistas |
| albums | CRUD de albuns |
| tracks | CRUD de musicas/faixas |
| playlists | CRUD de playlists e gerenciamento de tracks |

---

## Endpoints da API

### Autenticacao

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrar novo usuario |
| POST | `/api/auth/login` | Fazer login |

### Usuarios

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/users/me` | Obter usuario autenticado |
| GET | `/api/users/:id` | Obter usuario por ID |

### Artistas

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/artists` | Listar artistas |
| GET | `/api/artists/:id` | Obter artista por ID |
| POST | `/api/artists` | Criar artista |
| PUT | `/api/artists/:id` | Atualizar artista |
| DELETE | `/api/artists/:id` | Deletar artista |

### Albuns

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/albums` | Listar albuns |
| GET | `/api/albums/:id` | Obter album por ID |
| GET | `/api/albums/artist/:artistId` | Listar albuns de um artista |
| POST | `/api/albums` | Criar album |
| PUT | `/api/albums/:id` | Atualizar album |
| DELETE | `/api/albums/:id` | Deletar album |

### Tracks

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/tracks` | Listar tracks |
| GET | `/api/tracks/:id` | Obter track por ID |
| GET | `/api/tracks/album/:albumId` | Listar tracks de um album |
| GET | `/api/tracks/artist/:artistId` | Listar tracks de um artista |
| POST | `/api/tracks` | Criar track |
| PUT | `/api/tracks/:id` | Atualizar track |
| DELETE | `/api/tracks/:id` | Deletar track |

### Playlists

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/playlists` | Listar playlists |
| GET | `/api/playlists/:id` | Obter playlist por ID |
| GET | `/api/playlists/:id/tracks` | Listar tracks de uma playlist |
| POST | `/api/playlists` | Criar playlist |
| POST | `/api/playlists/:id/tracks` | Adicionar track a playlist |
| PUT | `/api/playlists/:id` | Atualizar playlist |
| DELETE | `/api/playlists/:id` | Deletar playlist |
| DELETE | `/api/playlists/:id/tracks/:trackId` | Remover track da playlist |

---

## Documentacao Adicional

- [Guia de Implementacao](./docs/IMPLEMENTATION_GUIDE.md) - Configuracao detalhada e troubleshooting
- [Guia do Postman](./docs/POSTMAN_GUIDE.md) - Como testar a API com Postman
