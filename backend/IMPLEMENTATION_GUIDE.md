# Guia Prático de Implementação - Antes de Testar no Postman

Este guia fornece instruções passo a passo para configurar e preparar o ambiente do backend antes de testar a API no Postman.

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação de Dependências](#instalação-de-dependências)
3. [Configuração do Ambiente](#configuração-do-ambiente)
4. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
5. [Execução de Migrations](#execução-de-migrations)
6. [Inicialização do Servidor](#inicialização-do-servidor)
7. [Verificações Pré-Teste](#verificações-pré-teste)
8. [Checklist Final](#checklist-final)
9. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Software Necessário

1. **Node.js** (versão 20.x LTS ou superior)
   - Verificar instalação: `node --version`
   - Download: [https://nodejs.org/](https://nodejs.org/)

2. **npm** (geralmente vem com Node.js)
   - Verificar instalação: `npm --version`

3. **PostgreSQL** (uma das opções abaixo):
   - **Opção A**: Conta no Neon DB (recomendado para desenvolvimento)
     - Criar conta: [https://neon.tech](https://neon.tech)
   - **Opção B**: PostgreSQL local instalado
     - Download: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

4. **Postman** (para testar a API)
   - Download: [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

### Verificação Rápida

Execute os seguintes comandos no terminal para verificar se tudo está instalado:

```bash
node --version    # Deve retornar v20.x ou superior
npm --version     # Deve retornar versão do npm
```

---

## Instalação de Dependências

### Passo 1: Navegar até o Diretório do Backend

```bash
cd backend
```

### Passo 2: Instalar Dependências

```bash
npm install
```

Este comando irá:
- Ler o arquivo `package.json`
- Instalar todas as dependências listadas em `dependencies` e `devDependencies`
- Criar a pasta `node_modules/` com todos os pacotes

**Tempo estimado**: 2-5 minutos (dependendo da conexão)

### Passo 3: Verificar Instalação

Após a instalação, verifique se não houve erros. Você deve ver:
- Pasta `node_modules/` criada
- Arquivo `package-lock.json` atualizado
- Nenhum erro no terminal

---

## Configuração do Ambiente

### Passo 1: Criar Arquivo .env

Crie um arquivo `.env` na raiz do diretório `backend/`:

```bash
# No Windows (PowerShell)
New-Item -Path .env -ItemType File

# No Linux/Mac
touch .env
```

### Passo 2: Configurar Variáveis de Ambiente

Abra o arquivo `.env` e adicione as seguintes variáveis:

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

### Passo 3: Obter DATABASE_URL

#### Opção A: Usando Neon DB (Recomendado)

1. Acesse [https://neon.tech](https://neon.tech)
2. Faça login ou crie uma conta
3. Crie um novo projeto:
   - Clique em "Create Project"
   - Escolha um nome (ex: `spotify-clone`)
   - Selecione a região mais próxima
   - Clique em "Create Project"
4. Obtenha a Connection String:
   - No painel do projeto, vá para "Connection Details"
   - Copie a **Connection String** completa
   - Cole no arquivo `.env` como valor de `DATABASE_URL`

**Formato da Connection String:**
```
postgresql://username:password@hostname/database?sslmode=require
```

#### Opção B: Usando PostgreSQL Local

Se você tem PostgreSQL instalado localmente:

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

**Alternativa**: Use um gerador online de strings aleatórias ou crie uma string longa e aleatória manualmente.

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
- O arquivo `.env` já deve estar no `.gitignore`
- Mantenha suas credenciais seguras

---

## Configuração do Banco de Dados

### Passo 1: Verificar Conexão

Antes de executar migrations, vamos testar se a conexão com o banco está funcionando.

Execute o servidor em modo desenvolvimento:

```bash
npm run dev
```

Você deve ver no terminal:

```
✅ Conexão com banco de dados estabelecida com sucesso
🚀 Servidor rodando em http://localhost:3000
```

**Se houver erro de conexão:**
- Verifique se a `DATABASE_URL` está correta
- Verifique se o banco de dados está acessível
- Para Neon DB, confirme que o projeto está ativo
- Para PostgreSQL local, verifique se o serviço está rodando

Pare o servidor (Ctrl+C) após verificar a conexão.

### Passo 2: Verificar Schema

O schema do banco de dados está definido em `src/db/schema.ts`. Ele inclui:
- `users` - Usuários do sistema
- `artists` - Artistas
- `albums` - Álbuns
- `tracks` - Músicas/Faixas
- `playlists` - Playlists
- `playlist_tracks` - Relacionamento entre playlists e tracks

---

## Execução de Migrations

### Passo 1: Gerar Migrations

As migrations são geradas automaticamente a partir do schema. Execute:

```bash
npm run db:generate
```

Este comando irá:
- Analisar o schema em `src/db/schema.ts`
- Comparar com o estado atual do banco
- Gerar arquivos de migration em `src/db/migrations/`

**Saída esperada:**
```
✓ Generated migrations
```

### Passo 2: Aplicar Schema no Banco

Aplique o schema no banco de dados usando o comando `push`:

```bash
npm run db:migrate
```

**Nota**: Na versão 0.20.6 do drizzle-kit, o comando `migrate` não está disponível. O script `db:migrate` foi configurado para usar `push:pg`, que sincroniza o schema diretamente com o banco de dados PostgreSQL.

Este comando irá:
- Sincronizar o schema com o banco de dados
- Criar as tabelas que não existem
- Atualizar tabelas existentes conforme o schema
- Configurar relacionamentos e constraints

**Saída esperada:**
```
✓ Schema pushed successfully
```

**Alternativa - Usar Migrations (se preferir):**
Se você gerou migrations no Passo 1 e prefere aplicá-las manualmente, você pode usar um cliente PostgreSQL ou executar os arquivos SQL gerados em `src/db/migrations/` diretamente no banco.

### Passo 3: Verificar Tabelas (Opcional)

Para visualizar o banco de dados, você pode usar o Drizzle Studio:

```bash
npm run db:studio
```

Isso abrirá uma interface web (geralmente em `http://localhost:4983`) onde você pode:
- Ver todas as tabelas
- Visualizar dados
- Fazer queries manuais

**Nota**: Mantenha o Drizzle Studio aberto em uma aba separada, não precisa fechar.

---

## Inicialização do Servidor

### Passo 1: Iniciar Servidor em Modo Desenvolvimento

```bash
npm run dev
```

Este comando usa `nodemon` para reiniciar automaticamente o servidor quando você fizer alterações no código.

### Passo 2: Verificar Logs

Você deve ver no terminal:

```
[INFO] Conexão com banco de dados estabelecida com sucesso
[INFO] Servidor rodando em http://localhost:3000
[INFO] Ambiente: development
[INFO] Health check: http://localhost:3000/health
```

### Passo 3: Testar Health Check (Terminal)

Em outro terminal, teste se o servidor está respondendo:

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

### Passo 4: Testar Endpoint Raiz

Teste o endpoint raiz:

```bash
curl http://localhost:3000/
```

**Resposta esperada:**
```json
{
  "message": "API está rodando com sucesso"
}
```

---

## Verificações Pré-Teste

Antes de importar a collection do Postman, verifique:

### ✅ Checklist de Verificações

- [x] **Servidor está rodando**
  - Comando: `npm run dev` executado
  - Logs mostram "Servidor rodando em http://localhost:3000"

- [x] **Banco de dados conectado**
  - Logs mostram "Conexão com banco de dados estabelecida com sucesso"
  - Sem erros de conexão

- [x] **Migrations aplicadas**
  - Comando `npm run db:migrate` executado com sucesso
  - Tabelas criadas no banco (verificar via Drizzle Studio se necessário)

- [x] **Health check responde**
  - `curl http://localhost:3000/health` retorna `{"status": "ok"}`
  - Status code: 200

- [x] **Porta 3000 disponível**
  - Nenhum outro processo usando a porta 3000
  - Se houver conflito, altere `PORT` no `.env`

- [x] **Arquivo .env configurado**
  - `DATABASE_URL` preenchida e válida
  - `JWT_SECRET` preenchida (não vazia)
  - `PORT` definida (padrão: 3000)

- [x] **Dependências instaladas**
  - Pasta `node_modules/` existe
  - Sem erros no `npm install`

---

## Checklist Final

Antes de abrir o Postman, confirme:

### Configuração do Ambiente
- [x] Node.js instalado e funcionando
- [x] Dependências instaladas (`npm install`)
- [x] Arquivo `.env` criado e configurado
- [x] `DATABASE_URL` válida e testada
- [x] `JWT_SECRET` configurada

### Banco de Dados
- [x] Conexão com banco estabelecida
- [x] Migrations geradas (`npm run db:generate`)
- [x] Migrations aplicadas (`npm run db:migrate`)
- [x] Tabelas criadas no banco

### Servidor
- [x] Servidor rodando (`npm run dev`)
- [x] Health check respondendo (status 200)
- [x] Endpoint raiz funcionando
- [x] Sem erros no terminal

### Postman
- [ ] Postman instalado
- [ ] Collection importada (`Spotify-Clone-API.postman_collection.json`)
- [ ] Variável `base_url` configurada como `http://localhost:3000`

---

## Próximos Passos

Após completar todas as verificações:

1. **Importar Collection no Postman**
   - Abra o Postman
   - Clique em "Import"
   - Selecione `backend/Spotify-Clone-API.postman_collection.json`

2. **Configurar Variáveis**
   - Na collection, vá em "Variables"
   - Verifique se `base_url` está como `http://localhost:3000`
   - Outras variáveis já têm valores padrão

3. **Testar Health Check**
   - Execute `Health Check > Health Check`
   - Deve retornar `{"status": "ok"}`

4. **Fazer Login/Register**
   - Execute `Auth > Register` ou `Auth > Login`
   - O token será salvo automaticamente

5. **Testar Endpoints**
   - Siga o fluxo recomendado no `POSTMAN_GUIDE.md`

---

## Troubleshooting

### Erro: "Cannot find module"

**Causa**: Dependências não instaladas ou `node_modules` corrompido.

**Solução**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 is already in use"

**Causa**: Outro processo está usando a porta 3000.

**Solução**:
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

### Erro: "DATABASE_URL não configurada"

**Causa**: Arquivo `.env` não existe ou `DATABASE_URL` está vazia.

**Solução**:
1. Verifique se o arquivo `.env` existe na raiz de `backend/`
2. Verifique se `DATABASE_URL` está preenchida
3. Reinicie o servidor após alterar `.env`

### Erro: "Connection refused" ou "Timeout"

**Causa**: Banco de dados inacessível ou `DATABASE_URL` incorreta.

**Solução**:
1. Verifique se a `DATABASE_URL` está correta
2. Para Neon DB: verifique se o projeto está ativo
3. Para PostgreSQL local: verifique se o serviço está rodando
4. Teste a conexão manualmente (use um cliente PostgreSQL)

### Erro: "Table does not exist"

**Causa**: Migrations não foram aplicadas.

**Solução**:
```bash
npm run db:generate
npm run db:migrate
```

### Erro: "unknown command 'generate'" ou "Did you mean generate:pg?"

**Causa**: Versão do drizzle-kit que requer comando específico para PostgreSQL.

**Solução**:
O script `db:generate` no `package.json` já foi atualizado para usar `generate:pg`. Se ainda encontrar o erro:

1. Verifique se o `package.json` está atualizado:
   ```json
   "db:generate": "drizzle-kit generate:pg"
   ```

2. Se necessário, atualize manualmente:
   ```bash
   # Edite package.json e altere:
   "db:generate": "drizzle-kit generate:pg"
   ```

3. Ou execute diretamente:
   ```bash
   npx drizzle-kit generate:pg
   ```

### Erro: "unknown command 'migrate'" ou "unknown command 'push'"

**Causa**: Versão 0.20.6 do drizzle-kit requer comandos específicos com sufixo `:pg` para PostgreSQL.

**Solução**:
O script `db:migrate` no `package.json` já foi atualizado para usar `push:pg`. Se ainda encontrar o erro:

1. Verifique se o `package.json` está atualizado:
   ```json
   "db:migrate": "drizzle-kit push:pg"
   "db:push": "drizzle-kit push:pg"
   ```

2. O comando `push:pg` sincroniza o schema diretamente com o banco PostgreSQL, o que é ideal para desenvolvimento.

3. Se preferir usar migrations tradicionais, você pode:
   - Executar os arquivos SQL gerados manualmente no banco
   - Ou atualizar o drizzle-kit para uma versão mais recente que suporta `migrate`

**Nota**: Para desenvolvimento, usar `push:pg` é mais prático e rápido. Na versão 0.20.6, todos os comandos do drizzle-kit para PostgreSQL requerem o sufixo `:pg` (ex: `generate:pg`, `push:pg`).

### Erro: "Only 'pg' is available options for '--driver'" ou "Invalid input"

**Causa**: Versão 0.20.18+ do drizzle-kit requer configuração diferente no `drizzle.config.ts`.

**Solução**:
1. Abra o arquivo `drizzle.config.ts`
2. Certifique-se de que está usando:
   ```typescript
   driver: 'pg',  // ao invés de dialect: 'postgresql'
   dbCredentials: {
     connectionString: process.env.DATABASE_URL || '',  // ao invés de url
   },
   ```
3. Salve o arquivo e execute o comando novamente

**Mudanças na versão 0.20.18+**:
- `dialect: 'postgresql'` → `driver: 'pg'`
- `url` → `connectionString`

**Nota**: Versões mais recentes do drizzle-kit (0.20.18+) usam `driver` e `connectionString` na configuração.

### Erro: "JWT_SECRET não configurada"

**Causa**: `JWT_SECRET` vazia no `.env`.

**Solução**:
1. Gere uma nova chave secreta (veja seção "Gerar JWT_SECRET")
2. Adicione no `.env`
3. Reinicie o servidor

### Erro: "Invalid token" no Postman

**Causa**: Token expirado ou inválido.

**Solução**:
1. Execute `Auth > Login` novamente
2. O token será atualizado automaticamente
3. Verifique se o script de captura de token está funcionando

### Health Check retorna erro

**Causa**: Servidor não está rodando ou há erro na aplicação.

**Solução**:
1. Verifique os logs do terminal
2. Verifique se há erros de sintaxe no código
3. Verifique se todas as dependências estão instaladas
4. Verifique se o arquivo `.env` está configurado corretamente

---

## Comandos de Referência Rápida

```bash
# Instalar dependências
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

## Suporte Adicional

Se você encontrar problemas não listados aqui:

1. Verifique os logs do servidor no terminal
2. Consulte a documentação do Drizzle ORM: [https://orm.drizzle.team](https://orm.drizzle.team)
3. Consulte a documentação do Express.js: [https://expressjs.com](https://expressjs.com)
4. Verifique o arquivo `POSTMAN_GUIDE.md` para instruções de uso da collection

---

**Pronto!** Após completar todas as etapas deste guia, você estará pronto para testar a API no Postman.

