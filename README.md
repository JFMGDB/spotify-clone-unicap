# Spotify Clone - Monorepo (Backend + Mobile)

> Ultima atualizacao: 05/12/2025

Este repositorio contem o projeto **Spotify Clone**, desenvolvido como trabalho integrado das disciplinas de **Arquitetura Orientada a Servicos (Backend)** e **Programacao Mobile (React Native + Expo)** da UNICAP.

- **Backend**: API REST em Node.js + Express.js + PostgreSQL (Neon DB)
- **Mobile**: Aplicativo em React Native + Expo SDK 54 com Expo Router

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

## Estrutura do Monorepo

```
.
├── README.md
├── backend/              # API REST (Express + TypeScript + Drizzle ORM)
│   ├── docs/             # Documentacao do backend
│   └── src/              # Codigo fonte
└── mobile/               # App Mobile (React Native + Expo + Expo Router)
    ├── docs/             # Documentacao do mobile
    ├── app/              # Rotas (Expo Router)
    └── src/              # Codigo fonte
```

---

## Inicio Rapido

### Backend

1. Entre no diretorio do backend:
   ```bash
   cd backend
   ```

2. Instale as dependencias:
   ```bash
   npm install
   ```

3. Configure as variaveis de ambiente:
   ```bash
   # Copie o arquivo de exemplo
   cp .env.example .env
   
   # Edite o .env e configure:
   # - DATABASE_URL (connection string do Neon DB)
   # - JWT_SECRET (chave secreta para tokens)
   ```

4. Inicie o servidor:
   ```bash
   npm run dev
   ```

   O servidor estara disponivel em `http://localhost:3000`

   Para mais detalhes, consulte [backend/README.md](./backend/README.md)

### Mobile

1. Entre no diretorio do mobile:
   ```bash
   cd mobile
   ```

2. Instale as dependencias:
   ```bash
   npm install
   ```

3. Inicie o app:
   ```bash
   npm start
   ```

   Escaneie o QR Code com o Expo Go no seu dispositivo.

   Para mais detalhes, consulte [mobile/README.md](./mobile/README.md)

---

## Estrutura Detalhada

### Backend

```
backend/
├── src/
│   ├── config/          # Configuracoes (DB, env)
│   ├── db/              # Schema Drizzle, migrations, seeds
│   ├── common/          # Codigo compartilhado
│   │   ├── middleware/  # Middlewares (auth, error, validation)
│   │   ├── errors/      # Classes de erro customizadas
│   │   ├── utils/       # Utilitarios
│   │   └── types/       # Tipos TypeScript
│   ├── modules/         # Modulos por dominio
│   │   ├── auth/
│   │   ├── users/
│   │   ├── artists/
│   │   ├── albums/
│   │   ├── tracks/
│   │   └── playlists/
│   ├── routes/          # Agregacao de rotas
│   └── tests/           # Testes automatizados
├── docs/                # Documentacao
├── drizzle.config.ts    # Configuracao do Drizzle Kit
└── package.json
```

### Mobile

```
mobile/
├── app/                 # Rotas (Expo Router file-based)
│   ├── (auth)/          # Stack de autenticacao
│   ├── (tabs)/          # Navegacao principal (tabs)
│   ├── playlist/
│   ├── album/
│   ├── artist/
│   └── player/
├── src/
│   ├── contexts/        # Contextos React (Auth, Player)
│   ├── features/        # Features por dominio
│   └── shared/          # Codigo compartilhado
│       ├── components/  # Componentes reutilizaveis
│       ├── hooks/       # Custom hooks
│       ├── lib/         # Bibliotecas (apiClient, etc.)
│       ├── theme/       # Tema (cores, tipografia, espacamento)
│       └── config/      # Configuracoes
├── docs/                # Documentacao
└── package.json
```

---

## Tecnologias

### Backend

| Tecnologia | Descricao |
|------------|-----------|
| Express.js | Framework web |
| TypeScript | Tipagem estatica |
| Drizzle ORM | ORM type-safe para PostgreSQL |
| PostgreSQL (Neon DB) | Banco de dados na nuvem |
| Jest | Framework de testes |
| bcrypt | Hash de senhas |
| jsonwebtoken | Autenticacao JWT |

### Mobile

| Tecnologia | Descricao |
|------------|-----------|
| React Native | Framework mobile |
| Expo SDK 54 | Plataforma e ferramentas |
| Expo Router | Roteamento baseado em arquivos |
| TypeScript | Tipagem estatica |
| React 19.1 | Biblioteca de UI |
| Axios | Cliente HTTP |

---

## Metodologias

O projeto segue as seguintes metodologias e principios:

- **SOLID**: Principios de design orientado a objetos
- **DRY (Don't Repeat Yourself)**: Evitar duplicacao de codigo
- **Componentizacao**: Componentes reutilizaveis e modulares
- **Arquitetura Modular**: Separacao por dominios de negocio

---

## Documentacao

### Backend

- [README do Backend](./backend/README.md) - Visao geral e setup
- [Guia de Implementacao](./backend/docs/IMPLEMENTATION_GUIDE.md) - Configuracao detalhada
- [Guia do Postman](./backend/docs/POSTMAN_GUIDE.md) - Testes da API

### Mobile

- [README do Mobile](./mobile/README.md) - Visao geral e setup
- [Guia de Execucao](./mobile/docs/EXECUTION_GUIDE.md) - Como rodar o app
- [Guia de Testes](./mobile/docs/TESTING_GUIDE.md) - Roteiro completo de testes

---

## Status do Projeto

### Infraestrutura e Setup

- [x] Estrutura de monorepo criada
- [x] Backend configurado (Express + TypeScript + Drizzle)
- [x] Mobile configurado (Expo + Expo Router + TypeScript)
- [x] Arquivos de ambiente e .gitignore configurados
- [x] Documentacao organizada

### Funcionalidades Backend

- [x] Autenticacao (registro e login)
- [x] CRUD de Artistas
- [x] CRUD de Albuns
- [x] CRUD de Tracks
- [x] CRUD de Playlists
- [x] Gerenciamento de tracks em playlists

### Funcionalidades Mobile

- [x] Telas de autenticacao
- [x] Navegacao por tabs
- [x] Tela Home
- [x] Tela de Busca
- [x] Tela de Biblioteca
- [x] Detalhes de Playlist/Album/Artista
- [x] Player de musica

---

## Licenca

Este e um projeto academico desenvolvido para as disciplinas de Arquitetura Orientada a Servicos e Programacao Mobile - UNICAP 2025.2.
