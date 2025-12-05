# Guia de Uso - Postman Collection

> Ultima atualizacao: 05/12/2025

Este documento explica como utilizar a collection do Postman para testar a API do Spotify Clone.

---

## Importando a Collection

1. Abra o Postman
2. Clique em **Import** no canto superior esquerdo
3. Selecione o arquivo `Spotify-Clone-API.postman_collection.json`
4. A collection sera importada com todas as rotas organizadas

---

## Configuracao Inicial

### Variaveis da Collection

A collection utiliza variaveis para facilitar o uso. As principais variaveis sao:

#### Variaveis de Ambiente
- `base_url`: URL base da API (padrao: `http://localhost:3000`)
- `auth_token`: Token JWT gerado apos login (preenchido automaticamente)
- `user_id`: ID do usuario autenticado (preenchido automaticamente)

#### Variaveis de Entidades
- `artist_id`: ID de um artista
- `album_id`: ID de um album
- `track_id`: ID de uma track
- `playlist_id`: ID de uma playlist

#### Variaveis de Teste
- `test_email`: Email para testes (padrao: `test@example.com`)
- `test_password`: Senha para testes (padrao: `password123`)
- `test_name`: Nome para testes (padrao: `Test User`)

#### Variaveis de Dados de Exemplo
- `artist_name`, `artist_image_url`, `artist_bio`
- `album_title`, `album_cover_url`, `album_release_date`
- `track_title`, `track_duration`, `track_audio_url`, `track_number`
- `playlist_name`, `playlist_description`, `playlist_cover_url`, `playlist_is_public`

### Configurando Variaveis

1. Na collection, clique em **Variables**
2. Edite os valores conforme necessario
3. As variaveis sao compartilhadas entre todas as requisicoes da collection

---

## Fluxo de Teste Recomendado

### 1. Health Check

Primeiro, verifique se a API esta rodando:
- Execute `Health Check > Health Check`
- Deve retornar `{ "status": "ok" }`

### 2. Autenticacao

Antes de testar rotas protegidas, voce precisa se autenticar:

#### Opcao A: Registrar um novo usuario
- Execute `Auth > Register`
- O token sera salvo automaticamente na variavel `auth_token`
- O `user_id` tambem sera salvo automaticamente

#### Opcao B: Fazer login com usuario existente
- Execute `Auth > Login`
- O token sera salvo automaticamente na variavel `auth_token`
- O `user_id` tambem sera salvo automaticamente

**Nota**: Os scripts de teste nas requisicoes de Register e Login capturam automaticamente o token e o user_id da resposta e os salvam nas variaveis da collection.

### 3. Testar Rotas Publicas

Algumas rotas nao requerem autenticacao:
- `Artists > Get All Artists`
- `Artists > Get Artist by ID`
- `Albums > Get All Albums`
- `Albums > Get Album by ID`
- `Albums > Get Albums by Artist`
- `Tracks > Get All Tracks`
- `Tracks > Get Track by ID`
- `Tracks > Get Tracks by Album`
- `Tracks > Get Tracks by Artist`
- `Playlists > Get Playlist by ID`
- `Playlists > Get Playlist Tracks`

### 4. Testar Rotas Protegidas

Apos autenticacao, voce pode testar rotas que requerem token:

#### Usuarios
- `Users > Get Current User`: Retorna dados do usuario autenticado
- `Users > Get User by ID`: Retorna dados de um usuario especifico

#### Artistas (CRUD)
1. `Artists > Create Artist`: Cria um novo artista
   - Copie o `id` retornado e atualize a variavel `artist_id`
2. `Artists > Get Artist by ID`: Busca o artista criado
3. `Artists > Update Artist`: Atualiza dados do artista
4. `Artists > Delete Artist`: Remove o artista

#### Albuns (CRUD)
1. `Albums > Create Album`: Cria um novo album
   - Requer um `artist_id` valido
   - Copie o `id` retornado e atualize a variavel `album_id`
2. `Albums > Get Album by ID`: Busca o album criado
3. `Albums > Get Albums by Artist`: Lista albuns de um artista
4. `Albums > Update Album`: Atualiza dados do album
5. `Albums > Delete Album`: Remove o album

#### Tracks (CRUD)
1. `Tracks > Create Track`: Cria uma nova track
   - Requer um `artist_id` valido
   - `album_id` e opcional
   - Copie o `id` retornado e atualize a variavel `track_id`
2. `Tracks > Get Track by ID`: Busca a track criada
3. `Tracks > Get Tracks by Album`: Lista tracks de um album
4. `Tracks > Get Tracks by Artist`: Lista tracks de um artista
5. `Tracks > Update Track`: Atualiza dados da track
6. `Tracks > Delete Track`: Remove a track

#### Playlists (CRUD + Gerenciamento de Tracks)
1. `Playlists > Create Playlist`: Cria uma nova playlist
   - Copie o `id` retornado e atualize a variavel `playlist_id`
2. `Playlists > Get Playlist by ID`: Busca a playlist criada
3. `Playlists > Get Playlists by User`: Lista playlists de um usuario
4. `Playlists > Get Playlist Tracks`: Lista tracks de uma playlist
5. `Playlists > Add Track to Playlist`: Adiciona uma track a playlist
   - Requer `playlist_id` e `track_id` validos
6. `Playlists > Remove Track from Playlist`: Remove uma track da playlist
7. `Playlists > Update Playlist`: Atualiza dados da playlist
8. `Playlists > Delete Playlist`: Remove a playlist

---

## Dicas de Uso

### Atualizando IDs Manualmente

Apos criar uma entidade (artista, album, track, playlist), voce pode:
1. Copiar o `id` da resposta JSON
2. Ir em **Variables** da collection
3. Atualizar a variavel correspondente (`artist_id`, `album_id`, etc.)

### Testando Cenarios de Erro

Para testar validacoes e erros:
- Tente criar entidades com dados invalidos
- Tente acessar rotas protegidas sem token
- Tente acessar recursos que nao existem
- Tente atualizar/deletar recursos de outros usuarios

### Autenticacao Automatica

As requisicoes de Register e Login possuem scripts de teste que:
- Capturam o token JWT da resposta
- Salvam automaticamente na variavel `auth_token`
- Salvam o `user_id` na variavel `user_id`

Todas as requisicoes protegidas ja estao configuradas para usar o `auth_token` automaticamente via Bearer Token.

### Ordem de Criacao de Dados

Para criar dados relacionados, siga esta ordem:
1. Criar um Artista
2. Criar um Album (vinculado ao artista)
3. Criar Tracks (vinculadas ao artista e opcionalmente ao album)
4. Criar uma Playlist
5. Adicionar Tracks a Playlist

---

## Estrutura da Collection

A collection esta organizada em pastas:

- **Health Check**: Endpoints de verificacao de saude da API
- **Auth**: Autenticacao (register, login)
- **Users**: Gerenciamento de usuarios
- **Artists**: CRUD de artistas
- **Albums**: CRUD de albuns
- **Tracks**: CRUD de tracks
- **Playlists**: CRUD de playlists e gerenciamento de tracks

---

## Requisitos da API

### Validacoes Comuns

- **Email**: Deve ser um email valido
- **Senha**: Minimo de 6 caracteres
- **Nome**: Minimo de 2 caracteres
- **UUIDs**: IDs devem ser UUIDs validos
- **URLs**: URLs devem ser validas (quando aplicavel)
- **Duracao**: Deve ser um numero inteiro maior que zero (em segundos)
- **Datas**: Devem estar no formato ISO 8601

### Headers Obrigatorios

- **Content-Type**: `application/json` (para requisicoes POST/PUT)
- **Authorization**: `Bearer {token}` (para rotas protegidas - configurado automaticamente)

---

## Troubleshooting

### Token nao esta sendo salvo

- Verifique se a resposta do login/register contem o campo `token`
- Verifique os scripts de teste nas requisicoes de Auth
- Execute novamente a requisicao de login/register

### Erro 401 Unauthorized

- Verifique se voce executou Login ou Register antes
- Verifique se o token nao expirou (padrao: 1 hora)
- Faca login novamente se necessario

### Erro 404 Not Found

- Verifique se o servidor esta rodando na porta correta (padrao: 3000)
- Verifique se a variavel `base_url` esta configurada corretamente
- Verifique se o endpoint existe na API

### Erro 400 Bad Request

- Verifique se todos os campos obrigatorios estao preenchidos
- Verifique se os tipos de dados estao corretos (UUIDs, numeros, etc.)
- Verifique se as validacoes estao sendo atendidas

### IDs nao encontrados

- Certifique-se de criar as entidades na ordem correta
- Atualize as variaveis de ID apos criar cada entidade
- Verifique se os IDs estao corretos nas variaveis da collection

---

## Decisoes de Design

### Organizacao por Modulos

As requisicoes estao organizadas em pastas que correspondem aos modulos do backend, mantendo consistencia com a estrutura do codigo e facilitando navegacao.

### Uso de Variaveis de Collection

A collection utiliza variaveis de collection (ao inves de variaveis de ambiente) para:
- Compartilhamento automatico entre todas as requisicoes
- Simplificacao do uso sem configuracao adicional
- Facilidade de customizacao

### Autenticacao Automatica

As requisicoes de Register e Login possuem scripts que capturam automaticamente o token JWT e o user_id da resposta, salvando-os nas variaveis da collection. Todas as rotas protegidas usam Bearer Token configurado automaticamente via variavel `auth_token`.

### Valores Padrao

Todas as variaveis possuem valores padrao realistas, permitindo testar a API imediatamente apos importar a collection.

### Estrutura de URLs

As URLs usam variaveis de path (ex: `:id`) ao inves de valores hardcoded, facilitando reutilizacao e testes com diferentes IDs.

### Consistencia com o Codebase

A collection reflete exatamente:
- Validacoes definidas nos validators
- Estrutura de headers esperada pelo middleware
- Schema do banco de dados (UUIDs, timestamps, tipos de dados)

