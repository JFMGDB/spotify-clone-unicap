# Configuração do Neon DB

Este guia explica como configurar a conexão com o Neon DB (PostgreSQL na nuvem).

## Passo 1: Criar Projeto no Neon

1. Acesse [https://neon.tech](https://neon.tech)
2. Crie uma conta ou faça login
3. Clique em "Create Project"
4. Escolha um nome para o projeto (ex: `spotify-clone`)
5. Selecione a região mais próxima
6. Clique em "Create Project"

## Passo 2: Obter Connection String

1. No painel do Neon, vá para a seção "Connection Details"
2. Copie a **Connection String** (formato: `postgresql://user:password@host/database?sslmode=require`)
3. **IMPORTANTE**: Esta string contém credenciais sensíveis, nunca commite no Git!

## Passo 3: Configurar no Backend

1. No diretório `backend/`, copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

2. Abra o arquivo `.env` e cole a connection string:
   ```env
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   JWT_SECRET=sua-chave-secreta-aqui
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:8081
   ```

3. Gere uma chave secreta para JWT (pode usar qualquer string aleatória):
   ```bash
   # No Linux/Mac:
   openssl rand -base64 32
   
   # Ou use qualquer gerador online de strings aleatórias
   ```

## Passo 4: Testar Conexão

1. Instale as dependências (se ainda não fez):
   ```bash
   cd backend
   npm install
   ```

2. Inicie o servidor:
   ```bash
   npm run dev
   ```

3. Se tudo estiver correto, você verá:
   ```
   ✅ Conexão com banco de dados estabelecida com sucesso
   🚀 Servidor rodando em http://localhost:3000
   ```

4. Teste o health check:
   ```bash
   curl http://localhost:3000/health
   ```

## Próximos Passos

Após configurar o Neon DB, você pode:

1. **Gerar migrations** (quando o schema estiver pronto):
   ```bash
   npm run db:generate
   ```

2. **Aplicar migrations**:
   ```bash
   npm run db:migrate
   ```

3. **Abrir Drizzle Studio** (interface visual do banco):
   ```bash
   npm run db:studio
   ```

## Troubleshooting

### Erro: "connection refused"
- Verifique se a `DATABASE_URL` está correta
- Confirme que o projeto Neon está ativo
- Verifique se há restrições de firewall

### Erro: "SSL required"
- Certifique-se de que a connection string inclui `?sslmode=require`
- Neon DB requer SSL por padrão

### Erro: "authentication failed"
- Verifique se o usuário e senha estão corretos na connection string
- Tente gerar uma nova connection string no painel do Neon

