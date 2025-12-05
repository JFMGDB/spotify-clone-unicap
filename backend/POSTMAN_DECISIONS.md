# Decisões de Design - Postman Collection

Este documento explica as decisões arquiteturais e de design tomadas na criação da collection do Postman para a API do Spotify Clone.

## Análise do Codebase

### Estrutura Identificada

Após análise do codebase, identifiquei a seguinte estrutura:

1. **Backend**: Express.js + TypeScript + Drizzle ORM
2. **Autenticação**: JWT (JSON Web Tokens) via Bearer Token
3. **Validação**: express-validator para validação de dados
4. **Rotas Organizadas**: Módulos separados por domínio (auth, users, artists, albums, tracks, playlists)

### Endpoints Mapeados

- **Health Check**: `/health` e `/`
- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Users**: `/api/users/me`, `/api/users/:id`
- **Artists**: CRUD completo + listagem
- **Albums**: CRUD completo + listagem por artista
- **Tracks**: CRUD completo + listagem por álbum e artista
- **Playlists**: CRUD completo + gerenciamento de tracks

## Decisões de Design

### 1. Organização por Módulos

**Decisão**: Organizar as requisições em pastas que correspondem aos módulos do backend.

**Justificativa**: 
- Mantém consistência com a estrutura do código
- Facilita navegação e localização de endpoints
- Segue o princípio DRY (Don't Repeat Yourself) ao agrupar funcionalidades relacionadas

### 2. Uso de Variáveis de Collection

**Decisão**: Utilizar variáveis de collection ao invés de variáveis de ambiente.

**Justificativa**:
- Variáveis de collection são compartilhadas automaticamente entre todas as requisições
- Não requer configuração adicional de ambientes
- Simplifica o uso para desenvolvedores que apenas querem testar a API
- Permite fácil customização sem criar múltiplos ambientes

**Variáveis Implementadas**:
- `base_url`: URL base da API (facilita mudança entre dev/prod)
- `auth_token`: Token JWT (preenchido automaticamente)
- `user_id`: ID do usuário autenticado (preenchido automaticamente)
- IDs de entidades: `artist_id`, `album_id`, `track_id`, `playlist_id`
- Dados de teste: `test_email`, `test_password`, `test_name`
- Dados de exemplo para criação: variáveis para cada campo das entidades

### 3. Autenticação Automática

**Decisão**: Implementar scripts de teste nas requisições de Register e Login para capturar automaticamente o token e user_id.

**Justificativa**:
- Elimina trabalho manual de copiar/colar tokens
- Reduz erros de digitação
- Melhora a experiência do desenvolvedor
- Segue boas práticas de automação de testes

**Implementação**:
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    if (response.token) {
        pm.collectionVariables.set('auth_token', response.token);
        pm.collectionVariables.set('user_id', response.user.id);
    }
}
```

### 4. Bearer Token Authentication

**Decisão**: Configurar autenticação Bearer Token em todas as rotas protegidas usando a variável `auth_token`.

**Justificativa**:
- Padrão da indústria para APIs REST
- Consistente com a implementação do backend (auth.middleware.ts)
- Configuração automática via variável elimina necessidade de configurar manualmente
- Suportado nativamente pelo Postman

### 5. Valores Padrão para Variáveis

**Decisão**: Definir valores padrão realistas para todas as variáveis.

**Justificativa**:
- Permite testar a API imediatamente após importar
- Reduz barreira de entrada para novos desenvolvedores
- Valores são facilmente substituíveis quando necessário
- Exemplos claros do formato esperado para cada campo

**Valores Padrão**:
- `base_url`: `http://localhost:3000` (porta padrão do Express)
- `test_email`: `test@example.com`
- `test_password`: `password123` (atende validação mínima de 6 caracteres)
- URLs de exemplo para imagens e áudios
- Datas no formato ISO 8601

### 6. Estrutura de URLs com Variáveis

**Decisão**: Usar variáveis de path (ex: `:id`) ao invés de valores hardcoded.

**Justificativa**:
- Facilita reutilização das requisições
- Permite testar com diferentes IDs sem editar manualmente
- Mantém consistência com a estrutura de rotas do Express
- Permite atualização centralizada via variáveis da collection

### 7. Descrições Detalhadas

**Decisão**: Adicionar descrições em todas as requisições explicando seu propósito e requisitos.

**Justificativa**:
- Melhora a documentação inline
- Ajuda desenvolvedores a entender o propósito de cada endpoint
- Indica claramente quais rotas requerem autenticação
- Facilita onboarding de novos membros da equipe

### 8. Organização de Requisições por Operação

**Decisão**: Organizar requisições dentro de cada módulo seguindo ordem lógica (GET, POST, PUT, DELETE).

**Justificativa**:
- Facilita localização de operações específicas
- Segue convenções REST padrão
- Ordem natural de uso (criar, ler, atualizar, deletar)
- Consistente com a organização do código backend

### 9. Suporte a Relacionamentos

**Decisão**: Incluir endpoints que demonstram relacionamentos entre entidades (ex: álbuns por artista, tracks por álbum).

**Justificativa**:
- Testa funcionalidades importantes do domínio
- Demonstra como as entidades se relacionam
- Útil para testar queries relacionais do Drizzle ORM
- Reflete casos de uso reais da aplicação

### 10. Content-Type Explícito

**Decisão**: Definir header `Content-Type: application/json` explicitamente em todas as requisições POST/PUT.

**Justificativa**:
- Garante que o servidor interprete corretamente o body
- Boa prática de APIs REST
- Evita erros de parsing no backend
- Consistente com o uso de express.json() no backend

## Consistência com o Codebase

### Alinhamento com Validações

A collection reflete exatamente as validações definidas nos validators:
- **Auth**: Email válido, senha mínima de 6 caracteres, nome mínimo de 2 caracteres
- **Artists**: Nome obrigatório, URLs opcionais validadas
- **Albums**: Título obrigatório, artistId UUID obrigatório, datas ISO 8601
- **Tracks**: Título obrigatório, artistId UUID obrigatório, duration inteiro positivo, audioUrl URL válida
- **Playlists**: Nome obrigatório, campos opcionais com tipos corretos

### Alinhamento com Middleware

- Rotas protegidas usam `authMiddleware` - todas configuradas com Bearer Token
- Rotas públicas não têm autenticação configurada
- Estrutura de headers segue o padrão esperado pelo middleware

### Alinhamento com Schema do Banco

Os campos das requisições correspondem exatamente ao schema do Drizzle ORM:
- UUIDs para IDs
- Timestamps para datas
- Booleanos para flags (isPublic)
- Strings para textos
- Integers para números (duration, trackNumber)

## Extensibilidade

A collection foi projetada para ser facilmente extensível:

1. **Novos Endpoints**: Basta adicionar novas requisições nas pastas apropriadas
2. **Novas Variáveis**: Adicionar na seção `variable` da collection
3. **Novos Scripts**: Adicionar eventos `test` ou `prerequest` conforme necessário
4. **Ambientes**: Pode ser facilmente adaptada para usar variáveis de ambiente do Postman

## Manutenibilidade

Características que facilitam manutenção:

1. **Variáveis Centralizadas**: Mudanças na URL base ou estrutura afetam todas as requisições automaticamente
2. **Nomenclatura Consistente**: Nomes de variáveis seguem padrão claro (`{entity}_id`, `{entity}_{field}`)
3. **Documentação Inline**: Descrições explicam o propósito de cada requisição
4. **Estrutura Modular**: Fácil localizar e modificar requisições específicas

## Conclusão

A collection foi projetada seguindo os princípios SOLID e DRY, mantendo consistência com o codebase existente e priorizando a experiência do desenvolvedor. A estrutura modular, uso de variáveis e automação de autenticação tornam a collection fácil de usar, manter e estender.

