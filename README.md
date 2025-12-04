## Spotify Clone – Monorepo (Backend + Mobile)

Este repositório contém o projeto **Spotify Clone**, integrado às disciplinas de **AOS (Backend)** e **Programação Mobile (React Native + Expo)**.

- **Backend**: API REST em **Node.js + Express.js + PostgreSQL (Neon DB)**.
- **Mobile**: App em **React Native + Expo**, com **Expo Router** e **Zustand**.

Este README foca em **estrutura de pastas e setup**.

---

## 📋 Estrutura Geral do Monorepo

```
.
├── README.md
├── backend/          # API REST (Express + TypeScript + Drizzle ORM)
└── mobile/           # App Mobile (React Native + Expo + Expo Router)
```

---

## Início Rápido

### Backend

1. Entre no diretório do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
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

   O servidor estará disponível em `http://localhost:3000`

   Para mais detalhes, consulte [backend/README.md](./backend/README.md)

### Mobile

1. Entre no diretório do mobile:
   ```bash
   cd mobile
   ```

2. Instale as dependências:
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
│   ├── config/          # Configurações (DB, env)
│   ├── db/              # Schema Drizzle, migrations, seeds
│   ├── common/          # Código compartilhado
│   │   ├── middleware/  # Middlewares (auth, error, validation)
│   │   ├── errors/      # Classes de erro customizadas
│   │   ├── utils/       # Utilitários
│   │   └── types/       # Tipos TypeScript
│   ├── modules/         # Módulos por domínio
│   │   ├── auth/
│   │   ├── users/
│   │   ├── artists/
│   │   ├── albums/
│   │   ├── tracks/
│   │   └── playlists/
│   ├── routes/          # Agregação de rotas
│   └── tests/           # Testes automatizados
├── drizzle.config.ts     # Configuração do Drizzle Kit
└── package.json
```

### Mobile

```
mobile/
├── app/                 # Rotas (Expo Router file-based)
│   ├── (auth)/         # Stack de autenticação
│   ├── (tabs)/         # Navegação principal (tabs)
│   ├── playlist/
│   ├── album/
│   ├── artist/
│   └── player/
├── src/
│   ├── features/       # Features por domínio
│   ├── shared/         # Código compartilhado
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── hooks/      # Custom hooks
│   │   ├── lib/        # Bibliotecas (apiClient, etc.)
│   │   ├── theme/      # Tema (React Native Paper)
│   │   └── config/     # Configurações
│   └── stores/         # Stores Zustand
└── package.json
```

---

## Tecnologias

### Backend
- **Express.js**: Framework web
- **TypeScript**: Tipagem estática
- **Drizzle ORM**: ORM type-safe para PostgreSQL
- **PostgreSQL (Neon DB)**: Banco de dados na nuvem
- **Jest**: Framework de testes
- **bcrypt**: Hash de senhas
- **jsonwebtoken**: Autenticação JWT

### Mobile
- **React Native**: Framework mobile
- **Expo**: Plataforma e ferramentas
- **Expo Router**: Roteamento baseado em arquivos
- **TypeScript**: Tipagem estática
- **Zustand**: Gerenciamento de estado
- **React Native Paper**: UI Kit
- **Axios**: Cliente HTTP

---

## Documentação

- **Backend README**: [backend/README.md](./backend/README.md)
- **Mobile README**: [mobile/README.md](./mobile/README.md)
- **Setup Neon DB**: [backend/setup-neon-db.md](./backend/setup-neon-db.md)

---

## Status do Projeto

### Épico 1 - Infraestrutura e Setup ✅
- [x] Estrutura de monorepo criada
- [x] Backend configurado (Express + TypeScript + Drizzle)
- [x] Mobile configurado (Expo + Expo Router + TypeScript)
- [x] Arquivos de ambiente e .gitignore configurados
- [ ] Neon DB configurado (requer ação manual - ver [SETUP_NEON_DB.md](./backend/SETUP_NEON_DB.md))

### Próximos Épicos
- Épico 2: Autenticação e Segurança
- Épico 3: Modelagem e Banco de Dados
- Épico 4-7: CRUD das Entidades
- Épico 8: Relacionamentos
- Épico 9-13: Telas, UI/UX, Testes, Deploy

---

## Equipe

*Nomes e RAs dos integrantes serão adicionados aqui*

---

## Licença

Este é um projeto acadêmico desenvolvido para as disciplinas de AOS e Programação Mobile - UNICAP 2025.2.
