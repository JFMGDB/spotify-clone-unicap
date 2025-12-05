# Quick Start - Configuração Rápida

Guia rápido para configurar o ambiente em 5 minutos.

## Passos Rápidos

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Criar Arquivo .env
Crie um arquivo `.env` na raiz de `backend/` com:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=sua-chave-secreta-aqui
JWT_EXPIRES_IN=1h
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081
```

**Onde obter DATABASE_URL:**
- Neon DB: [https://neon.tech](https://neon.tech) → Criar projeto → Copiar connection string
- PostgreSQL local: `postgresql://usuario:senha@localhost:5432/nome_banco?sslmode=disable`

**Como gerar JWT_SECRET:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 3. Aplicar Migrations
```bash
npm run db:generate
npm run db:migrate
```

### 4. Iniciar Servidor
```bash
npm run dev
```

### 5. Testar
```bash
curl http://localhost:3000/health
```

Deve retornar: `{"status": "ok"}`

## Próximo Passo

Importe a collection do Postman:
- Arquivo: `backend/Spotify-Clone-API.postman_collection.json`
- Guia completo: `POSTMAN_GUIDE.md`

## Problemas?

Consulte o guia completo: `IMPLEMENTATION_GUIDE.md`

