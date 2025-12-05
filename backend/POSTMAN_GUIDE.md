# Guia de Uso - Postman Collection

Este documento explica como utilizar a collection do Postman para testar a API do Spotify Clone.

## Importando a Collection

1. Abra o Postman
2. Clique em **Import** no canto superior esquerdo
3. Selecione o arquivo `Spotify-Clone-API.postman_collection.json`
4. A collection será importada com todas as rotas organizadas

## Configuração Inicial

### Variáveis da Collection

A collection utiliza variáveis para facilitar o uso. As principais variáveis são:

#### Variáveis de Ambiente
- `base_url`: URL base da API (padrão: `http://localhost:3000`)
- `auth_token`: Token JWT gerado após login (preenchido automaticamente)
- `user_id`: ID do usuário autenticado (preenchido automaticamente)

#### Variáveis de Entidades
- `artist_id`: ID de um artista
- `album_id`: ID de um álbum
- `track_id`: ID de uma track
- `playlist_id`: ID de uma playlist

#### Variáveis de Teste
- `test_email`: Email para testes (padrão: `test@example.com`)
- `test_password`: Senha para testes (padrão: `password123`)
- `test_name`: Nome para testes (padrão: `Test User`)

#### Variáveis de Dados de Exemplo
- `artist_name`, `artist_image_url`, `artist_bio`
- `album_title`, `album_cover_url`, `album_release_date`
- `track_title`, `track_duration`, `track_audio_url`, `track_number`
- `playlist_name`, `playlist_description`, `playlist_cover_url`, `playlist_is_public`

### Configurando Variáveis

1. Na collection, clique em **Variables**
2. Edite os valores conforme necessário
3. As variáveis são compartilhadas entre todas as requisições da collection

## Fluxo de Teste Recomendado

### 1. Health Check
Primeiro, verifique se a API está rodando:
- Execute `Health Check > Health Check`
- Deve retornar `{ "status": "ok" }`

### 2. Autenticação
Antes de testar rotas protegidas, você precisa se autenticar:

#### Opção A: Registrar um novo usuário
- Execute `Auth > Register`
- O token será salvo automaticamente na variável `auth_token`
- O `user_id` também será salvo automaticamente

#### Opção B: Fazer login com usuário existente
- Execute `Auth > Login`
- O token será salvo automaticamente na variável `auth_token`
- O `user_id` também será salvo automaticamente

**Nota**: Os scripts de teste nas requisições de Register e Login capturam automaticamente o token e o user_id da resposta e os salvam nas variáveis da collection.

### 3. Testar Rotas Públicas
Algumas rotas não requerem autenticação:
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
Após autenticação, você pode testar rotas que requerem token:

#### Usuários
- `Users > Get Current User`: Retorna dados do usuário autenticado
- `Users > Get User by ID`: Retorna dados de um usuário específico

#### Artistas (CRUD)
1. `Artists > Create Artist`: Cria um novo artista
   - Copie o `id` retornado e atualize a variável `artist_id`
2. `Artists > Get Artist by ID`: Busca o artista criado
3. `Artists > Update Artist`: Atualiza dados do artista
4. `Artists > Delete Artist`: Remove o artista

#### Álbuns (CRUD)
1. `Albums > Create Album`: Cria um novo álbum
   - Requer um `artist_id` válido
   - Copie o `id` retornado e atualize a variável `album_id`
2. `Albums > Get Album by ID`: Busca o álbum criado
3. `Albums > Get Albums by Artist`: Lista álbuns de um artista
4. `Albums > Update Album`: Atualiza dados do álbum
5. `Albums > Delete Album`: Remove o álbum

#### Tracks (CRUD)
1. `Tracks > Create Track`: Cria uma nova track
   - Requer um `artist_id` válido
   - `album_id` é opcional
   - Copie o `id` retornado e atualize a variável `track_id`
2. `Tracks > Get Track by ID`: Busca a track criada
3. `Tracks > Get Tracks by Album`: Lista tracks de um álbum
4. `Tracks > Get Tracks by Artist`: Lista tracks de um artista
5. `Tracks > Update Track`: Atualiza dados da track
6. `Tracks > Delete Track`: Remove a track

#### Playlists (CRUD + Gerenciamento de Tracks)
1. `Playlists > Create Playlist`: Cria uma nova playlist
   - Copie o `id` retornado e atualize a variável `playlist_id`
2. `Playlists > Get Playlist by ID`: Busca a playlist criada
3. `Playlists > Get Playlists by User`: Lista playlists de um usuário
4. `Playlists > Get Playlist Tracks`: Lista tracks de uma playlist
5. `Playlists > Add Track to Playlist`: Adiciona uma track à playlist
   - Requer `playlist_id` e `track_id` válidos
6. `Playlists > Remove Track from Playlist`: Remove uma track da playlist
7. `Playlists > Update Playlist`: Atualiza dados da playlist
8. `Playlists > Delete Playlist`: Remove a playlist

## Dicas de Uso

### Atualizando IDs Manualmente
Após criar uma entidade (artista, álbum, track, playlist), você pode:
1. Copiar o `id` da resposta JSON
2. Ir em **Variables** da collection
3. Atualizar a variável correspondente (`artist_id`, `album_id`, etc.)

### Testando Cenários de Erro
Para testar validações e erros:
- Tente criar entidades com dados inválidos
- Tente acessar rotas protegidas sem token
- Tente acessar recursos que não existem
- Tente atualizar/deletar recursos de outros usuários

### Autenticação Automática
As requisições de Register e Login possuem scripts de teste que:
- Capturam o token JWT da resposta
- Salvam automaticamente na variável `auth_token`
- Salvam o `user_id` na variável `user_id`

Todas as requisições protegidas já estão configuradas para usar o `auth_token` automaticamente via Bearer Token.

### Ordem de Criação de Dados
Para criar dados relacionados, siga esta ordem:
1. Criar um Artista
2. Criar um Álbum (vinculado ao artista)
3. Criar Tracks (vinculadas ao artista e opcionalmente ao álbum)
4. Criar uma Playlist
5. Adicionar Tracks à Playlist

## Estrutura da Collection

A collection está organizada em pastas:

- **Health Check**: Endpoints de verificação de saúde da API
- **Auth**: Autenticação (register, login)
- **Users**: Gerenciamento de usuários
- **Artists**: CRUD de artistas
- **Albums**: CRUD de álbuns
- **Tracks**: CRUD de tracks
- **Playlists**: CRUD de playlists e gerenciamento de tracks

## Requisitos da API

### Validações Comuns
- **Email**: Deve ser um email válido
- **Senha**: Mínimo de 6 caracteres
- **Nome**: Mínimo de 2 caracteres
- **UUIDs**: IDs devem ser UUIDs válidos
- **URLs**: URLs devem ser válidas (quando aplicável)
- **Duração**: Deve ser um número inteiro maior que zero (em segundos)
- **Datas**: Devem estar no formato ISO 8601

### Headers Obrigatórios
- **Content-Type**: `application/json` (para requisições POST/PUT)
- **Authorization**: `Bearer {token}` (para rotas protegidas - configurado automaticamente)

## Troubleshooting

### Token não está sendo salvo
- Verifique se a resposta do login/register contém o campo `token`
- Verifique os scripts de teste nas requisições de Auth
- Execute novamente a requisição de login/register

### Erro 401 Unauthorized
- Verifique se você executou Login ou Register antes
- Verifique se o token não expirou (padrão: 1 hora)
- Faça login novamente se necessário

### Erro 404 Not Found
- Verifique se o servidor está rodando na porta correta (padrão: 3000)
- Verifique se a variável `base_url` está configurada corretamente
- Verifique se o endpoint existe na API

### Erro 400 Bad Request
- Verifique se todos os campos obrigatórios estão preenchidos
- Verifique se os tipos de dados estão corretos (UUIDs, números, etc.)
- Verifique se as validações estão sendo atendidas

### IDs não encontrados
- Certifique-se de criar as entidades na ordem correta
- Atualize as variáveis de ID após criar cada entidade
- Verifique se os IDs estão corretos nas variáveis da collection

