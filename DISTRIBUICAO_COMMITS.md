# Distribuicao de Commits - Spotify Clone Mobile

Este documento lista a distribuicao dos arquivos por autor para o projeto mobile e backend.

---

## Autor 1 - Jamilli (jamilli.silva2013@gmail.com)

**Modulo: Autenticacao (Auth)**

Arquivos:
- mobile/app/(auth)/_layout.tsx
- mobile/app/(auth)/login.tsx
- mobile/app/(auth)/register.tsx
- mobile/src/contexts/AuthContext.tsx
- mobile/src/features/auth/components/LoginScreen.tsx
- mobile/src/features/auth/components/RegisterScreen.tsx

---

## Autor 2 - Enio (enioramosb@gmail.com)

**Modulo: Playlists (Backend + Mobile Service)**

Arquivos:
- backend/src/modules/playlists/playlists.service.ts
- backend/src/modules/playlists/playlists.controller.ts
- backend/src/modules/playlists/playlists.routes.ts
- mobile/src/features/playlists/services/playlists.service.ts
- mobile/src/shared/components/CreatePlaylistModal.tsx
- mobile/src/shared/components/AddToPlaylistModal.tsx
- mobile/src/shared/hooks/usePlaylistActions.ts

---

## Autor 3 - Jose (fguerra127@gmail.com)

**Modulo: Player e Reproducao de Audio**

Arquivos:
- mobile/src/contexts/PlayerContext.tsx
- mobile/src/features/player/components/MiniPlayer.tsx
- mobile/app/player/index.tsx
- mobile/src/shared/hooks/useTrackPlayer.ts

---

## Autor 4 - Walber (walbepereira@gmail.com)

**Modulo: Albums e Tracks (Backend + Mobile Services)**

Arquivos:
- backend/src/modules/albums/albums.service.ts
- backend/src/modules/tracks/tracks.service.ts
- mobile/src/features/albums/services/albums.service.ts
- mobile/src/features/tracks/services/tracks.service.ts
- mobile/src/features/artists/services/artists.service.ts

---

## Autor 5 - Ailton (ailtonc.n64@gmail.com)

**Modulo: Componentes UI Base e Sistema de Tema**

Arquivos:
- mobile/src/shared/components/Button.tsx
- mobile/src/shared/components/Input.tsx
- mobile/src/shared/components/Card.tsx
- mobile/src/shared/components/TrackItem.tsx
- mobile/src/shared/components/LoadingSpinner.tsx
- mobile/src/shared/components/ErrorMessage.tsx
- mobile/src/shared/theme/colors.ts
- mobile/src/shared/theme/spacing.ts
- mobile/src/shared/theme/typography.ts

---

## Autor 6 - Debora (deboralais.arte@gmail.com)

**Modulo: Telas Principais (Home e Busca)**

Arquivos:
- mobile/app/(tabs)/_layout.tsx
- mobile/app/(tabs)/index.tsx
- mobile/app/(tabs)/explore.tsx
- mobile/components/ui/icon-symbol.tsx

---

## Autor 7 - Anderson (andersonmarinhoprofissional@gmail.com)

**Modulo: Telas de Detalhes (Album, Artist, Playlist)**

Arquivos:
- mobile/app/album/[id].tsx
- mobile/app/artist/[id].tsx
- mobile/app/playlist/[id].tsx
- mobile/src/features/users/services/users.service.ts

---

## Autor 8 - Jose (jg.barros.dsantos@gmail.com)

**Modulo: Configuracao, Infraestrutura e Utils**

Arquivos:
- backend/src/app.ts
- backend/src/server.ts
- backend/src/common/middleware/auth.middleware.ts
- backend/src/db/seed.ts
- backend/src/db/reset.ts
- backend/package.json
- mobile/app/_layout.tsx
- mobile/app/index.tsx
- mobile/app/(tabs)/library.tsx
- mobile/app/(tabs)/settings.tsx
- mobile/src/shared/lib/api-client.ts
- mobile/src/shared/config/env.ts
- mobile/src/shared/utils/errorHandler.ts
- mobile/package.json
- mobile/app.json
- mobile/.gitignore

---

## Observacoes

- Cada autor foi responsavel por uma entidade/modulo especifico
- Todos os autores possuem arquivos relacionados ao mobile
- A distribuicao seguiu principios de coesao e baixo acoplamento
- Metodologias aplicadas: SOLID, DRY, Componentizacao

