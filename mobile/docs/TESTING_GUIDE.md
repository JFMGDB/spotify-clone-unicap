# Roteiro de Testes - Spotify Clone

> Ultima atualizacao: 05/12/2025

Este documento contem um guia completo para testar todas as funcionalidades da aplicacao.

---

## Pre-requisitos

### Backend

1. Node.js v20.x LTS ou superior instalado
2. Banco de dados Neon DB configurado (ou PostgreSQL local)
3. Arquivo `.env` configurado com:
   - `DATABASE_URL` - Connection string do banco
   - `JWT_SECRET` - Chave secreta para JWT
   - `PORT` - Porta do servidor (padrao: 3000)
   - `CORS_ORIGIN` - URL do app mobile (padrao: http://localhost:8081)

### Mobile

1. Expo CLI instalado globalmente: `npm install -g expo-cli`
2. Expo Go instalado no dispositivo movel (iOS/Android)
3. Ou emulador Android / Simulador iOS configurado

---

## Passo 1: Configuracao Inicial

### 1.1 Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` baseado em `.env.example`:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=sua-chave-secreta-aqui
PORT=3000
CORS_ORIGIN=http://localhost:8081
NODE_ENV=development
```

Execute as migrations do banco:

```bash
npm run db:push
# ou
npm run db:migrate
```

Inicie o servidor:

```bash
npm run dev
```

O servidor deve estar rodando em `http://localhost:3000`

**Teste inicial:**
```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{"status":"ok"}
```

### 1.2 Mobile

```bash
cd mobile
npm install
```

Configure a URL da API no arquivo `mobile/src/shared/config/env.ts` ou crie um arquivo `app.json` com:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3000"
    }
  }
}
```

**Nota:** Para testar em dispositivo fisico, substitua `localhost` pelo IP da sua maquina na rede local.

Inicie o app:

```bash
npm start
```

Escaneie o QR Code com o Expo Go ou pressione `a` para Android / `i` para iOS.

---

## Passo 2: Testes de Autenticacao

### 2.1 Registro de Usuario

1. Ao abrir o app, voce deve ser redirecionado para a tela de login
2. Clique em "Cadastre-se"
3. Preencha o formulario:
   - Nome: "Joao Silva"
   - Email: "joao@example.com"
   - Senha: "senha123"
   - Confirmar senha: "senha123"
4. Clique em "Cadastrar"

**Resultado esperado:**
- Usuario registrado com sucesso
- Redirecionamento automatico para a tela Home
- Token JWT armazenado no AsyncStorage

**Teste via API (opcional):**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Joao Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### 2.2 Login

1. Faca logout (se estiver logado)
2. Na tela de login, preencha:
   - Email: "joao@example.com"
   - Senha: "senha123"
3. Clique em "Entrar"

**Resultado esperado:**
- Login bem-sucedido
- Redirecionamento para a tela Home
- Token JWT armazenado

**Teste via API (opcional):**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### 2.3 Validacoes de Autenticacao

Teste os seguintes cenarios:

1. **Email invalido:**
   - Email: "email-invalido"
   - Deve mostrar erro de validacao

2. **Senha muito curta:**
   - Senha: "123"
   - Deve mostrar erro "Senha deve ter no minimo 6 caracteres"

3. **Email ja cadastrado:**
   - Tente registrar com o mesmo email novamente
   - Deve mostrar erro "Email ja cadastrado"

4. **Credenciais invalidas:**
   - Email: "joao@example.com"
   - Senha: "senhaerrada"
   - Deve mostrar erro "Email ou senha invalidos"

---

## Passo 3: Testes de Artistas

### 3.1 Criar Artista

**Via API (necessario estar autenticado):**

```bash
# Primeiro, obtenha um token JWT fazendo login
TOKEN="seu-token-jwt-aqui"

curl -X POST http://localhost:3000/api/artists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "The Beatles",
    "imageUrl": "https://example.com/beatles.jpg",
    "bio": "Banda de rock britanica formada em 1960"
  }'
```

**Resultado esperado:**
- Artista criado com sucesso
- Retorna objeto com id, name, imageUrl, bio, createdAt, updatedAt

### 3.2 Listar Artistas

**Via API:**
```bash
curl http://localhost:3000/api/artists
```

**Com busca:**
```bash
curl "http://localhost:3000/api/artists?search=Beatles"
```

**Resultado esperado:**
- Lista de todos os artistas (ou filtrados por busca)

### 3.3 Buscar Artista por ID

```bash
ARTIST_ID="id-do-artista"
curl http://localhost:3000/api/artists/$ARTIST_ID
```

### 3.4 Atualizar Artista

```bash
curl -X PUT http://localhost:3000/api/artists/$ARTIST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "bio": "Nova biografia atualizada"
  }'
```

### 3.5 Deletar Artista

```bash
curl -X DELETE http://localhost:3000/api/artists/$ARTIST_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Passo 4: Testes de Albuns

### 4.1 Criar Album

```bash
curl -X POST http://localhost:3000/api/albums \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Abbey Road",
    "artistId": "id-do-artista",
    "coverUrl": "https://example.com/abbey-road.jpg",
    "releaseDate": "1969-09-26T00:00:00Z"
  }'
```

### 4.2 Listar Albuns

```bash
curl http://localhost:3000/api/albums
```

### 4.3 Buscar Albuns de um Artista

```bash
curl http://localhost:3000/api/albums/artist/$ARTIST_ID
```

### 4.4 Buscar Album por ID

```bash
ALBUM_ID="id-do-album"
curl http://localhost:3000/api/albums/$ALBUM_ID
```

**Resultado esperado:**
- Retorna album com informacoes do artista incluidas

---

## Passo 5: Testes de Tracks (Musicas)

### 5.1 Criar Track

```bash
curl -X POST http://localhost:3000/api/tracks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Come Together",
    "albumId": "id-do-album",
    "artistId": "id-do-artista",
    "duration": 259,
    "audioUrl": "https://example.com/come-together.mp3",
    "trackNumber": 1
  }'
```

**Nota:** O `audioUrl` deve apontar para um arquivo de audio valido para testar a reproducao.

### 5.2 Listar Tracks

```bash
curl http://localhost:3000/api/tracks
```

### 5.3 Buscar Tracks de um Album

```bash
curl http://localhost:3000/api/tracks/album/$ALBUM_ID
```

### 5.4 Buscar Tracks de um Artista

```bash
curl http://localhost:3000/api/tracks/artist/$ARTIST_ID
```

---

## Passo 6: Testes de Playlists

### 6.1 Criar Playlist

**Via API:**
```bash
curl -X POST http://localhost:3000/api/playlists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Minhas Favoritas",
    "description": "Musicas que eu mais gosto",
    "coverUrl": "https://example.com/playlist-cover.jpg",
    "isPublic": true
  }'
```

### 6.2 Listar Playlists

```bash
curl http://localhost:3000/api/playlists \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado:**
- Retorna playlists publicas e do usuario autenticado

### 6.3 Buscar Playlist por ID

```bash
PLAYLIST_ID="id-da-playlist"
curl http://localhost:3000/api/playlists/$PLAYLIST_ID
```

### 6.4 Adicionar Track a Playlist

```bash
curl -X POST http://localhost:3000/api/playlists/$PLAYLIST_ID/tracks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "trackId": "id-da-track"
  }'
```

### 6.5 Listar Tracks de uma Playlist

```bash
curl http://localhost:3000/api/playlists/$PLAYLIST_ID/tracks
```

### 6.6 Remover Track de uma Playlist

```bash
curl -X DELETE http://localhost:3000/api/playlists/$PLAYLIST_ID/tracks/$TRACK_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 6.7 Atualizar Playlist

```bash
curl -X PUT http://localhost:3000/api/playlists/$PLAYLIST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Novo Nome",
    "isPublic": false
  }'
```

### 6.8 Deletar Playlist

```bash
curl -X DELETE http://localhost:3000/api/playlists/$PLAYLIST_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Passo 7: Testes no App Mobile

### 7.1 Tela Home

1. Apos fazer login, voce deve ver a tela Home
2. Verifique se aparecem:
   - Saudacao com o nome do usuario
   - Secao "Suas playlists" (se houver playlists)
   - Secao "Albuns populares" (se houver albuns)

**Teste:**
- Toque em um card de playlist - deve abrir detalhes da playlist
- Toque em um card de album - deve abrir detalhes do album

### 7.2 Tela de Busca (Explore)

1. Navegue para a aba "Buscar"
2. Digite no campo de busca (ex: "Beatles")
3. Verifique se aparecem resultados para:
   - Musicas
   - Artistas
   - Albuns

**Testes:**
- Toque em uma musica - deve iniciar reproducao
- Toque em um artista - deve abrir perfil do artista
- Toque em um album - deve abrir detalhes do album

### 7.3 Tela Biblioteca

1. Navegue para a aba "Biblioteca"
2. Verifique se aparecem:
   - Suas playlists
   - Albuns

**Testes:**
- Toque em uma playlist - deve abrir detalhes
- Toque em um album - deve abrir detalhes

### 7.4 Tela de Detalhes da Playlist

1. Abra uma playlist
2. Verifique se aparecem:
   - Capa da playlist (se houver)
   - Nome da playlist
   - Descricao (se houver)
   - Lista de musicas

**Testes:**
- Toque em uma musica - deve iniciar reproducao
- Verifique se o MiniPlayer aparece na parte inferior

### 7.5 Tela de Detalhes do Album

1. Abra um album
2. Verifique se aparecem:
   - Capa do album
   - Titulo do album
   - Nome do artista (clicavel)
   - Ano de lancamento
   - Lista de musicas

**Testes:**
- Toque no nome do artista - deve abrir perfil do artista
- Toque em uma musica - deve iniciar reproducao

### 7.6 Tela de Perfil do Artista

1. Abra o perfil de um artista
2. Verifique se aparecem:
   - Foto do artista
   - Nome do artista
   - Biografia (se houver)
   - Musicas populares
   - Albuns do artista

**Testes:**
- Toque em uma musica - deve iniciar reproducao
- Toque em um album - deve abrir detalhes do album

### 7.7 Player de Musica

1. Inicie a reproducao de uma musica
2. Verifique o MiniPlayer na parte inferior:
   - Nome da musica
   - Nome do artista
   - Botao play/pause

**Testes:**
- Toque no MiniPlayer - deve abrir player em tela cheia
- Toque no botao play/pause - deve pausar/retomar

3. No player em tela cheia, verifique:
   - Capa do album/musica
   - Nome da musica
   - Nome do artista
   - Barra de progresso
   - Tempo atual e total
   - Botoes: anterior, play/pause, proximo

**Testes:**
- Toque em play/pause - deve pausar/retomar
- Toque em proximo - deve avancar para proxima musica (se houver)
- Toque em anterior - deve voltar para musica anterior (se houver)
- Toque no botao de fechar - deve voltar para tela anterior

---

## Passo 8: Testes de Integracao

### 8.1 Fluxo Completo: Criar Playlist e Adicionar Musicas

1. **Criar artista:**
   ```bash
   curl -X POST http://localhost:3000/api/artists \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"name": "Artista Teste"}'
   ```
   Anote o `id` retornado.

2. **Criar album:**
   ```bash
   curl -X POST http://localhost:3000/api/albums \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{
       "title": "Album Teste",
       "artistId": "id-do-artista"
     }'
   ```
   Anote o `id` retornado.

3. **Criar tracks:**
   ```bash
   curl -X POST http://localhost:3000/api/tracks \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{
       "title": "Musica 1",
       "albumId": "id-do-album",
       "artistId": "id-do-artista",
       "duration": 180,
       "audioUrl": "https://example.com/music1.mp3"
     }'
   ```
   Repita para criar mais musicas.

4. **Criar playlist:**
   ```bash
   curl -X POST http://localhost:3000/api/playlists \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"name": "Playlist Teste"}'
   ```
   Anote o `id` retornado.

5. **Adicionar musicas a playlist:**
   ```bash
   curl -X POST http://localhost:3000/api/playlists/id-da-playlist/tracks \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"trackId": "id-da-track"}'
   ```

6. **Verificar no app mobile:**
   - Va para a tela Home
   - A playlist deve aparecer
   - Abra a playlist
   - As musicas devem estar listadas
   - Toque em uma musica para reproduzir

### 8.2 Teste de Autenticacao e Autorizacao

1. **Tentar acessar rota protegida sem token:**
   ```bash
   curl http://localhost:3000/api/playlists
   ```
   Deve retornar erro 401.

2. **Tentar criar playlist sem autenticacao:**
   ```bash
   curl -X POST http://localhost:3000/api/playlists \
     -H "Content-Type: application/json" \
     -d '{"name": "Teste"}'
   ```
   Deve retornar erro 401.

3. **Tentar deletar playlist de outro usuario:**
   - Crie uma playlist com um usuario
   - Faca login com outro usuario
   - Tente deletar a playlist do primeiro usuario
   - Deve retornar erro 403 (Forbidden)

---

## Passo 9: Testes de Erros e Validacoes

### 9.1 Validacoes de Entrada

Teste os seguintes cenarios via API:

1. **Email invalido no registro:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name": "Teste", "email": "email-invalido", "password": "senha123"}'
   ```
   Deve retornar erro 400.

2. **Campos obrigatorios faltando:**
   ```bash
   curl -X POST http://localhost:3000/api/artists \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{}'
   ```
   Deve retornar erro 400.

3. **ID invalido:**
   ```bash
   curl http://localhost:3000/api/artists/id-invalido
   ```
   Deve retornar erro 404.

### 9.2 Testes no App Mobile

1. **Campo vazio:**
   - Tente fazer login sem preencher email/senha
   - Deve mostrar mensagem de erro

2. **Busca vazia:**
   - Na tela de busca, deixe o campo vazio
   - Nao deve mostrar resultados

3. **Sem conexao:**
   - Desligue a internet
   - Tente fazer uma acao que requeira API
   - Deve mostrar mensagem de erro apropriada

---

## Passo 10: Checklist Final

Marque cada item conforme testar:

### Backend

- [ ] Health check funcionando
- [ ] Registro de usuario funcionando
- [ ] Login funcionando
- [ ] JWT middleware protegendo rotas
- [ ] CRUD de artistas funcionando
- [ ] CRUD de albuns funcionando
- [ ] CRUD de tracks funcionando
- [ ] CRUD de playlists funcionando
- [ ] Adicionar/remover tracks de playlists funcionando
- [ ] Validacoes de entrada funcionando
- [ ] Tratamento de erros funcionando

### Mobile

- [ ] Tela de login funcionando
- [ ] Tela de registro funcionando
- [ ] Redirecionamento automatico apos login
- [ ] Tela Home exibindo dados
- [ ] Tela de busca funcionando
- [ ] Tela de biblioteca funcionando
- [ ] Detalhes de playlist funcionando
- [ ] Detalhes de album funcionando
- [ ] Perfil de artista funcionando
- [ ] Player de musica funcionando
- [ ] MiniPlayer aparecendo
- [ ] Navegacao entre telas funcionando
- [ ] Tratamento de erros exibindo mensagens

### Integracao

- [ ] App mobile conectando com API
- [ ] Autenticacao persistindo entre sessoes
- [ ] Token sendo enviado automaticamente
- [ ] Dados sendo carregados corretamente
- [ ] Reproducao de audio funcionando (se URLs de audio validas)

---

## Dicas de Troubleshooting

### Backend nao inicia

- Verifique se o banco de dados esta configurado corretamente
- Verifique se a porta 3000 esta disponivel
- Verifique os logs do servidor

### Mobile nao conecta a API

- Verifique se o backend esta rodando
- Verifique a URL da API no arquivo de configuracao
- Para dispositivo fisico, use o IP da maquina na rede local
- Verifique se o CORS esta configurado corretamente

### Erro de autenticacao

- Verifique se o token esta sendo salvo no AsyncStorage
- Verifique se o token esta sendo enviado no header Authorization
- Verifique se o JWT_SECRET esta configurado

### Player nao reproduz

- Verifique se as URLs de audio sao validas e acessiveis
- Verifique se o expo-av esta instalado corretamente
- Verifique os logs do console para erros

---

## Proximos Passos

Apos completar os testes, voce pode:

1. Adicionar mais dados de teste (artistas, albuns, musicas)
2. Testar com diferentes usuarios
3. Testar cenarios de edge cases
4. Verificar performance com muitos dados
5. Testar em diferentes dispositivos (iOS/Android)

