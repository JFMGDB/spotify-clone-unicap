# Spotify Clone - Backend

API REST desenvolvida em **Node.js + Express.js + TypeScript** com **Drizzle ORM** e **PostgreSQL (Neon DB)**.

## 👥 Integrantes

- José Felipe Morais Guerra de Barros - RA: 00000853793
- Jamilli Maria Francisca da Silva - RA: 00000854174
- Enio Ramos Bezerra - RA: 00000003364
- Débora Laís Macedo da Silva - RA: 00000851133
- Ailton Cesar Anizio dos Santos - RA: 00000029548
- José Gabriel Barros dos Santos - RA: 00000847959
- Walbert Pereira de Lima - RA: 00000851041
- Anderson Marcone da Silva Marinho - RA: 00000853760

## 🚀 Início Rápido

### Pré-requisitos

- Node.js v20.x LTS ou superior
- npm ou yarn
- Conta no Neon DB (ou PostgreSQL local)

### Instalação

1. **Instale as dependências:**
```bash
cd backend
npm install
```

2. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz de `backend/` com o seguinte conteúdo:

```env
# Banco de Dados
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# JWT (Autenticação)
JWT_SECRET=sua-chave-secreta-super-segura-aqui
JWT_EXPIRES_IN=1h

# Servidor
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:8081
```

**Como obter DATABASE_URL:**
- **Neon DB** (recomendado): Acesse [https://neon.tech](https://neon.tech) → Crie projeto → Copie a connection string
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

O servidor estará disponível em `http://localhost:3000`

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

## 📁 Estrutura do Projeto

```
backend/
  src/
    config/          # Configurações (DB, env, logger)
    db/              # Schema Drizzle, migrations, seeds
    common/          # Código compartilhado (middlewares, utils, types)
    modules/         # Módulos por domínio (auth, users, artists, etc.)
    routes/          # Agregação de rotas
    tests/           # Testes automatizados
  drizzle.config.ts  # Configuração do Drizzle Kit
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia servidor em modo desenvolvimento (nodemon)
- `npm run build` - Compila TypeScript para JavaScript
- `npm run start` - Inicia servidor em produção (após build)
- `npm test` - Executa testes
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Gera relatório de cobertura
- `npm run db:generate` - Gera migrations do Drizzle
- `npm run db:migrate` - Aplica migrations no banco
- `npm run db:push` - Push direto do schema (dev apenas)
- `npm run db:studio` - Abre Drizzle Studio (interface visual do banco)
- `npm run db:seed` - Popula o banco com dados de exemplo

## 🔧 Tecnologias

- **Express.js**: Framework web
- **TypeScript**: Tipagem estática
- **Drizzle ORM**: ORM type-safe para PostgreSQL
- **PostgreSQL (Neon DB)**: Banco de dados
- **Jest**: Framework de testes
- **bcrypt**: Hash de senhas
- **jsonwebtoken**: Autenticação JWT

## 📚 Documentação Adicional

- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Guia detalhado de implementação e troubleshooting
- **[POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)** - Guia de uso da collection do Postman
- **[DISTRIBUICAO_TRABALHO.md](./DISTRIBUICAO_TRABALHO.md)** - Distribuição de trabalho entre desenvolvedores

## 📝 Estrutura de Módulos

O projeto segue uma arquitetura modular baseada em domínios:

- **auth** - Autenticação (register, login)
- **users** - Gerenciamento de usuários
- **artists** - CRUD de artistas
- **albums** - CRUD de álbuns
- **tracks** - CRUD de músicas/faixas
- **playlists** - CRUD de playlists e gerenciamento de tracks

Cada módulo segue o padrão:
- `{module}.controller.ts` - Handlers HTTP
- `{module}.service.ts` - Lógica de negócio
- `{module}.routes.ts` - Definição de rotas
- `{module}.validators.ts` - Validações (quando aplicável)

