# Spotify Clone - Mobile

> Ultima atualizacao: 05/12/2025

Aplicativo mobile desenvolvido em React Native + Expo SDK 54 com Expo Router e TypeScript.

---

## Integrantes

| Nome | RA |
|------|-----|
| Jose Felipe Morais Guerra de Barros | 00000853793 |
| Jamilli Maria Francisca da Silva | 00000854174 |
| Enio Ramos Bezerra | 00000003364 |
| Debora Lais Macedo da Silva | 00000851133 |
| Ailton Cesar Anizio dos Santos | 00000029548 |
| Jose Gabriel Barros dos Santos | 00000847959 |
| Walbert Pereira de Lima | 00000851041 |
| Anderson Marcone da Silva Marinho | 00000853760 |

---

## Inicio Rapido

### Pre-requisitos

- Node.js v20.x LTS ou superior
- npm ou yarn
- Expo Go instalado no dispositivo movel (iOS ou Android)
- Ou emulador Android / Simulador iOS configurado

### Instalacao

1. Entre no diretorio do projeto:

```bash
cd mobile
```

2. Instale as dependencias:

```bash
npm install
```

3. Configure as variaveis de ambiente (opcional):

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env e configure:
# - EXPO_PUBLIC_API_URL (URL base da API backend)
```

### Executar em Desenvolvimento

```bash
npm start
```

Ou use os comandos especificos:

| Comando | Descricao |
|---------|-----------|
| `npm run android` | Abre no emulador Android |
| `npm run ios` | Abre no simulador iOS |
| `npm run web` | Abre no navegador |
| `npm run lint` | Executa o linter |

### Testar no Dispositivo

1. Execute `npm start`
2. Escaneie o QR Code com:
   - **iOS**: Camera nativa ou Expo Go
   - **Android**: Expo Go

---

## Estrutura do Projeto

```
mobile/
├── app/                    # Rotas (Expo Router file-based)
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Tela inicial
│   ├── (auth)/             # Stack de autenticacao
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/             # Navegacao principal (tabs)
│   │   ├── index.tsx       # Home
│   │   ├── explore.tsx     # Busca
│   │   ├── library.tsx     # Biblioteca
│   │   └── settings.tsx    # Configuracoes
│   ├── album/[id].tsx      # Detalhes do album
│   ├── artist/[id].tsx     # Perfil do artista
│   ├── playlist/[id].tsx   # Detalhes da playlist
│   └── player/index.tsx    # Player em tela cheia
├── src/
│   ├── contexts/           # Contextos React (Auth, Player)
│   ├── features/           # Features por dominio
│   │   ├── auth/
│   │   ├── albums/
│   │   ├── artists/
│   │   ├── playlists/
│   │   ├── tracks/
│   │   └── player/
│   └── shared/             # Codigo compartilhado
│       ├── components/     # Componentes reutilizaveis
│       ├── hooks/          # Custom hooks
│       ├── lib/            # Bibliotecas (apiClient, etc.)
│       ├── theme/          # Tema (cores, tipografia, espacamento)
│       ├── config/         # Configuracoes
│       └── utils/          # Utilitarios
├── assets/                 # Imagens e recursos estaticos
├── docs/                   # Documentacao
└── package.json
```

---

## Tecnologias

| Tecnologia | Versao | Descricao |
|------------|--------|-----------|
| React Native | 0.81.5 | Framework mobile |
| Expo | ~54.0.26 | Plataforma e ferramentas |
| Expo Router | ~6.0.16 | Roteamento baseado em arquivos |
| TypeScript | ~5.9.2 | Tipagem estatica |
| React | 19.1.0 | Biblioteca de UI |
| React Navigation | - | Navegacao nativa |
| React Native Reanimated | - | Animacoes performaticas |
| React Native Gesture Handler | - | Gestos nativos |

---

## Arquitetura

O projeto segue uma arquitetura modular baseada em features, aplicando os principios SOLID, DRY e componentizacao.

### Organizacao por Features

Cada feature representa um dominio de negocio:

```
features/{nome}/
├── components/    # Componentes especificos da feature
├── services/      # Servicos de API
├── hooks/         # Hooks especificos
└── types/         # Tipos TypeScript
```

### Componentes Compartilhados

Componentes reutilizaveis em toda a aplicacao:

| Componente | Descricao |
|------------|-----------|
| Button | Botao padronizado |
| Card | Card generico |
| Input | Campo de entrada |
| LoadingSpinner | Indicador de carregamento |
| ErrorMessage | Mensagem de erro |
| TrackItem | Item de track na lista |
| MiniPlayer | Player compacto |

---

## Navegacao

O app utiliza Expo Router com roteamento baseado em arquivos:

### Estrutura de Rotas

| Rota | Descricao |
|------|-----------|
| `/` | Tela inicial (redirect) |
| `/(auth)/login` | Tela de login |
| `/(auth)/register` | Tela de registro |
| `/(tabs)` | Navegacao principal |
| `/(tabs)/index` | Home |
| `/(tabs)/explore` | Busca |
| `/(tabs)/library` | Biblioteca |
| `/(tabs)/settings` | Configuracoes |
| `/album/[id]` | Detalhes do album |
| `/artist/[id]` | Perfil do artista |
| `/playlist/[id]` | Detalhes da playlist |
| `/player` | Player em tela cheia |

---

## Contextos

### AuthContext

Gerencia o estado de autenticacao:

- Login/Logout
- Registro de usuario
- Persistencia do token
- Usuario atual

### PlayerContext

Gerencia o estado do player de musica:

- Track atual
- Estado de reproducao (play/pause)
- Fila de reproducao
- Controles (proximo, anterior)

---

## Servicos

### API Client

Cliente HTTP configurado com Axios:

- Base URL configuravel
- Interceptors para autenticacao
- Tratamento de erros padronizado

### Servicos por Dominio

| Servico | Descricao |
|---------|-----------|
| albums.service | Operacoes de albuns |
| artists.service | Operacoes de artistas |
| playlists.service | Operacoes de playlists |
| tracks.service | Operacoes de tracks |
| users.service | Operacoes de usuarios |

---

## Tema

O tema e organizado em modulos:

| Modulo | Descricao |
|--------|-----------|
| colors.ts | Paleta de cores |
| typography.ts | Estilos de texto |
| spacing.ts | Espacamentos padronizados |

---

## Comandos Disponiveis

| Comando | Descricao |
|---------|-----------|
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run android` | Abre no emulador Android |
| `npm run ios` | Abre no simulador iOS |
| `npm run web` | Abre no navegador |
| `npm run lint` | Executa o linter |
| `npm run reset-project` | Move codigo inicial para app-example e cria app vazio |

---

## Documentacao Adicional

- [Guia de Execucao](./docs/EXECUTION_GUIDE.md) - Como rodar o app em diferentes ambientes
- [Guia de Testes](./docs/TESTING_GUIDE.md) - Roteiro completo de testes

---

## Recursos Externos

- [Documentacao do Expo](https://docs.expo.dev/)
- [Documentacao do Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)
