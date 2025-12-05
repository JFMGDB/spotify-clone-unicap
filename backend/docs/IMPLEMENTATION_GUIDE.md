# Guia de Implementacao - Backend

> Ultima atualizacao: 05/12/2025

Este guia fornece instrucoes passo a passo para configurar e preparar o ambiente do backend antes de testar a API.

---

## Indice

1. [Pre-requisitos](#pre-requisitos)
2. [Instalacao de Dependencias](#instalacao-de-dependencias)
3. [Configuracao do Ambiente](#configuracao-do-ambiente)
4. [Configuracao do Banco de Dados](#configuracao-do-banco-de-dados)
5. [Execucao de Migrations](#execucao-de-migrations)
6. [Inicializacao do Servidor](#inicializacao-do-servidor)
7. [Verificacoes Pre-Teste](#verificacoes-pre-teste)
8. [Troubleshooting](#troubleshooting)

---

## Pre-requisitos

Antes de comecar, certifique-se de ter instalado:

### Software Necessario

1. **Node.js** (versao 20.x LTS ou superior)
   - Verificar instalacao: `node --version`
   - Download: https://nodejs.org/

2. **npm** (geralmente vem com Node.js)
   - Verificar instalacao: `npm --version`

3. **PostgreSQL** (uma das opcoes abaixo):
   - **Opcao A**: Conta no Neon DB (recomendado para desenvolvimento)
     - Criar conta: https://neon.tech
   - **Opcao B**: PostgreSQL local instalado
     - Download: https://www.postgresql.org/download/

4. **Postman** (para testar a API)
   - Download: https://www.postman.com/downloads/

### Verificacao Rapida

Execute os seguintes comandos no terminal para verificar se tudo esta instalado:

```bash
node --version    # Deve retornar v20.x ou superior
npm --version     # Deve retornar versao do npm
```

---

## Instalacao de Dependencias

### Passo 1: Navegar ate o Diretorio do Backend

```bash
cd backend
```

### Passo 2: Instalar Dependencias

```bash
npm install
```

Este comando ira:
- Ler o arquivo `package.json`
- Instalar todas as dependencias listadas em `dependencies` e `devDependencies`
- Criar a pasta `node_modules/` com todos os pacotes

**Tempo estimado**: 2-5 minutos (dependendo da conexao)

### Passo 3: Verificar Instalacao

Apos a instalacao, verifique se nao houve erros. Voce deve ver:
- Pasta `node_modules/` criada
- Arquivo `package-lock.json` atualizado
- Nenhum erro no terminal

---

## Configuracao do Ambiente

### Passo 1: Criar Arquivo .env

Crie um arquivo `.env` na raiz do diretorio `backend/`:

```bash
# No Windows (PowerShell)
New-Item -Path .env -ItemType File

# No Linux/Mac
touch .env
```

### Passo 2: Configurar Variaveis de Ambiente

Abra o arquivo `.env` e adicione as seguintes variaveis:

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

### Passo 3: Obter DATABASE_URL

#### Opcao A: Usando Neon DB (Recomendado)

1. Acesse https://neon.tech
2. Faca login ou crie uma conta
3. Crie um novo projeto:
   - Clique em "Create Project"
   - Escolha um nome (ex: `spotify-clone`)
   - Selecione a regiao mais proxima
   - Clique em "Create Project"
4. Obtenha a Connection String:
   - No painel do projeto, va para "Connection Details"
   - Copie a **Connection String** completa
   - Cole no arquivo `.env` como valor de `DATABASE_URL`

**Formato da Connection String:**
```
postgresql://username:password@hostname/database?sslmode=require
```

#### Opcao B: Usando PostgreSQL Local

Se voce tem PostgreSQL instalado localmente:

```env
DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/spotify_clone?sslmode=disable
```

**Nota**: Substitua `sua_senha` pela senha do seu PostgreSQL e `spotify_clone` pelo nome do banco de dados.

### Passo 4: Gerar JWT_SECRET

Gere uma chave secreta segura para JWT:

**No Linux/Mac:**
```bash
openssl rand -base64 32
```

**No Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Cole o resultado no arquivo `.env` como valor de `JWT_SECRET`.

### Passo 5: Verificar Arquivo .env Final

Seu arquivo `.env` deve estar assim (com valores reais):

```env
DATABASE_URL=postgresql://neondb_owner:abc123xyz@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=K8mN2pQ5rS7tU9vW1xY3zA5bC7dE9fG1hI3jK5lM7nO9pQ1rS3tU5vW7xY9z
JWT_EXPIRES_IN=1h
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081
```

**IMPORTANTE**: 
- Nunca commite o arquivo `.env` no Git
- O arquivo `.env` ja deve estar no `.gitignore`
- Mantenha suas credenciais seguras

---

## Configuracao do Banco de Dados

### Passo 1: Verificar Conexao

Antes de executar migrations, vamos testar se a conexao com o banco esta funcionando.

Execute o servidor em modo desenvolvimento:

```bash
npm run dev
```

Voce deve ver no terminal:

```
Conexao com banco de dados estabelecida com sucesso
Servidor rodando em http://localhost:3000
```

**Se houver erro de conexao:**
- Verifique se a `DATABASE_URL` esta correta
- Verifique se o banco de dados esta acessivel
- Para Neon DB, confirme que o projeto esta ativo
- Para PostgreSQL local, verifique se o servico esta rodando

Pare o servidor (Ctrl+C) apos verificar a conexao.

### Passo 2: Verificar Schema

O schema do banco de dados esta definido em `src/db/schema.ts`. Ele inclui:
- `users` - Usuarios do sistema
- `artists` - Artistas
- `albums` - Albuns
- `tracks` - Musicas/Faixas
- `playlists` - Playlists
- `playlist_tracks` - Relacionamento entre playlists e tracks

---

## Execucao de Migrations

### Passo 1: Gerar Migrations

As migrations sao geradas automaticamente a partir do schema. Execute:

```bash
npm run db:generate
```

Este comando ira:
- Analisar o schema em `src/db/schema.ts`
- Comparar com o estado atual do banco
- Gerar arquivos de migration em `src/db/migrations/`

### Passo 2: Aplicar Schema no Banco

Aplique o schema no banco de dados usando o comando `push`:

```bash
npm run db:migrate
```

**Nota**: Na versao 0.20.6 do drizzle-kit, o comando `migrate` nao esta disponivel. O script `db:migrate` foi configurado para usar `push:pg`, que sincroniza o schema diretamente com o banco de dados PostgreSQL.

Este comando ira:
- Sincronizar o schema com o banco de dados
- Criar as tabelas que nao existem
- Atualizar tabelas existentes conforme o schema
- Configurar relacionamentos e constraints

### Passo 3: Verificar Tabelas (Opcional)

Para visualizar o banco de dados, voce pode usar o Drizzle Studio:

```bash
npm run db:studio
```

Isso abrira uma interface web (geralmente em `http://localhost:4983`) onde voce pode:
- Ver todas as tabelas
- Visualizar dados
- Fazer queries manuais

---

## Inicializacao do Servidor

### Passo 1: Iniciar Servidor em Modo Desenvolvimento

```bash
npm run dev
```

Este comando usa `nodemon` para reiniciar automaticamente o servidor quando voce fizer alteracoes no codigo.

### Passo 2: Verificar Logs

Voce deve ver no terminal:

```
[INFO] Conexao com banco de dados estabelecida com sucesso
[INFO] Servidor rodando em http://localhost:3000
[INFO] Ambiente: development
[INFO] Health check: http://localhost:3000/health
```

### Passo 3: Testar Health Check

Em outro terminal, teste se o servidor esta respondendo:

**No Windows (PowerShell):**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/health -Method GET
```

**No Linux/Mac:**
```bash
curl http://localhost:3000/health
```

**Resposta esperada:**
```json
{
  "status": "ok"
}
```

**Alternativa**: Abra no navegador: `http://localhost:3000/health`

---

## Verificacoes Pre-Teste

Antes de importar a collection do Postman, verifique:

### Checklist de Verificacoes

- [ ] **Servidor esta rodando**
  - Comando: `npm run dev` executado
  - Logs mostram "Servidor rodando em http://localhost:3000"

- [ ] **Banco de dados conectado**
  - Logs mostram "Conexao com banco de dados estabelecida com sucesso"
  - Sem erros de conexao

- [ ] **Migrations aplicadas**
  - Comando `npm run db:migrate` executado com sucesso
  - Tabelas criadas no banco (verificar via Drizzle Studio se necessario)

- [ ] **Health check responde**
  - `curl http://localhost:3000/health` retorna `{"status": "ok"}`
  - Status code: 200

- [ ] **Porta 3000 disponivel**
  - Nenhum outro processo usando a porta 3000
  - Se houver conflito, altere `PORT` no `.env`

- [ ] **Arquivo .env configurado**
  - `DATABASE_URL` preenchida e valida
  - `JWT_SECRET` preenchida (nao vazia)
  - `PORT` definida (padrao: 3000)

- [ ] **Dependencias instaladas**
  - Pasta `node_modules/` existe
  - Sem erros no `npm install`

---

## Troubleshooting

### Erro: "Cannot find module"

**Causa**: Dependencias nao instaladas ou `node_modules` corrompido.

**Solucao**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 is already in use"

**Causa**: Outro processo esta usando a porta 3000.

**Solucao**:
1. Encontre o processo:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Linux/Mac
   lsof -i :3000
   ```

2. Encerre o processo ou altere a porta no `.env`:
   ```env
   PORT=3001
   ```

### Erro: "DATABASE_URL nao configurada"

**Causa**: Arquivo `.env` nao existe ou `DATABASE_URL` esta vazia.

**Solucao**:
1. Verifique se o arquivo `.env` existe na raiz de `backend/`
2. Verifique se `DATABASE_URL` esta preenchida
3. Reinicie o servidor apos alterar `.env`

### Erro: "Connection refused" ou "Timeout"

**Causa**: Banco de dados inacessivel ou `DATABASE_URL` incorreta.

**Solucao**:
1. Verifique se a `DATABASE_URL` esta correta
2. Para Neon DB: verifique se o projeto esta ativo
3. Para PostgreSQL local: verifique se o servico esta rodando
4. Teste a conexao manualmente (use um cliente PostgreSQL)

### Erro: "Table does not exist"

**Causa**: Migrations nao foram aplicadas.

**Solucao**:
```bash
npm run db:generate
npm run db:migrate
```

### Erro: "unknown command 'generate'" ou "Did you mean generate:pg?"

**Causa**: Versao do drizzle-kit que requer comando especifico para PostgreSQL.

**Solucao**:
O script `db:generate` no `package.json` ja foi atualizado para usar `generate:pg`. Se ainda encontrar o erro:

1. Verifique se o `package.json` esta atualizado:
   ```json
   "db:generate": "drizzle-kit generate:pg"
   ```

2. Ou execute diretamente:
   ```bash
   npx drizzle-kit generate:pg
   ```

### Erro: "unknown command 'migrate'" ou "unknown command 'push'"

**Causa**: Versao 0.20.6 do drizzle-kit requer comandos especificos com sufixo `:pg` para PostgreSQL.

**Solucao**:
O script `db:migrate` no `package.json` ja foi atualizado para usar `push:pg`. Se ainda encontrar o erro:

1. Verifique se o `package.json` esta atualizado:
   ```json
   "db:migrate": "drizzle-kit push:pg"
   "db:push": "drizzle-kit push:pg"
   ```

2. O comando `push:pg` sincroniza o schema diretamente com o banco PostgreSQL, o que e ideal para desenvolvimento.

### Erro: "Only 'pg' is available options for '--driver'" ou "Invalid input"

**Causa**: Versao 0.20.18+ do drizzle-kit requer configuracao diferente no `drizzle.config.ts`.

**Solucao**:
1. Abra o arquivo `drizzle.config.ts`
2. Certifique-se de que esta usando:
   ```typescript
   driver: 'pg',
   dbCredentials: {
     connectionString: process.env.DATABASE_URL || '',
   },
   ```
3. Salve o arquivo e execute o comando novamente

### Erro: "JWT_SECRET nao configurada"

**Causa**: `JWT_SECRET` vazia no `.env`.

**Solucao**:
1. Gere uma nova chave secreta (veja secao "Gerar JWT_SECRET")
2. Adicione no `.env`
3. Reinicie o servidor

### Erro: "Invalid token" no Postman

**Causa**: Token expirado ou invalido.

**Solucao**:
1. Execute `Auth > Login` novamente
2. O token sera atualizado automaticamente
3. Verifique se o script de captura de token esta funcionando

### Health Check retorna erro

**Causa**: Servidor nao esta rodando ou ha erro na aplicacao.

**Solucao**:
1. Verifique os logs do terminal
2. Verifique se ha erros de sintaxe no codigo
3. Verifique se todas as dependencias estao instaladas
4. Verifique se o arquivo `.env` esta configurado corretamente

---

## Comandos de Referencia Rapida

```bash
# Instalar dependencias
npm install

# Iniciar servidor em desenvolvimento
npm run dev

# Gerar migrations
npm run db:generate

# Aplicar migrations
npm run db:migrate

# Abrir Drizzle Studio
npm run db:studio

# Compilar TypeScript
npm run build

# Executar testes
npm test

# Executar testes com coverage
npm run test:coverage
```

---

## Proximos Passos

Apos completar todas as verificacoes:

1. **Importar Collection no Postman**
   - Abra o Postman
   - Clique em "Import"
   - Selecione `backend/Spotify-Clone-API.postman_collection.json`

2. **Configurar Variaveis**
   - Na collection, va em "Variables"
   - Verifique se `base_url` esta como `http://localhost:3000`
   - Outras variaveis ja tem valores padrao

3. **Testar Health Check**
   - Execute `Health Check > Health Check`
   - Deve retornar `{"status": "ok"}`

4. **Fazer Login/Register**
   - Execute `Auth > Register` ou `Auth > Login`
   - O token sera salvo automaticamente

5. **Testar Endpoints**
   - Siga o fluxo recomendado no `POSTMAN_GUIDE.md`

