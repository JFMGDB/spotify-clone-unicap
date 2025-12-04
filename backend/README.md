# Spotify Clone - Backend

API REST desenvolvida em **Node.js + Express.js + TypeScript** com **Drizzle ORM** e **PostgreSQL (Neon DB)**.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js v20.x LTS ou superior
- npm ou yarn
- Conta no Neon DB (ou PostgreSQL local)

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

   O arquivo `.env.example` contém todas as variáveis necessárias com valores de exemplo. Para mais detalhes sobre configuração do Neon DB, consulte [setup-neon-db.md](./setup-neon-db.md).

3. Edite o arquivo `.env` e configure:
   - `DATABASE_URL`: Connection string do Neon DB
   - `JWT_SECRET`: Chave secreta para assinatura de tokens JWT
   - `PORT`: Porta do servidor (padrão: 3000)

### Executar em Desenvolvimento

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
- `npm run db:studio` - Abre Drizzle Studio
- `npm run db:seed` - Popula banco com dados iniciais

## 🔧 Tecnologias

- **Express.js**: Framework web
- **TypeScript**: Tipagem estática
- **Drizzle ORM**: ORM type-safe para PostgreSQL
- **PostgreSQL (Neon DB)**: Banco de dados
- **Jest**: Framework de testes
- **bcrypt**: Hash de senhas
- **jsonwebtoken**: Autenticação JWT

## 📝 Próximos Passos

1. Configurar conexão com Neon DB (Épico 1 - Tarefa E1-T4)
2. Implementar schema do banco (Épico 3)
3. Implementar autenticação (Épico 2)
4. Implementar CRUD das entidades (Épicos 4-7)

