# Guia de Execucao - Spotify Clone Mobile

> Ultima atualizacao: 05/12/2025

Este guia mostra como rodar o aplicativo mobile do Spotify Clone.

---

## Pre-requisitos

### 1. Node.js

- **Versao requerida:** v20.x LTS ou superior
- Verificar instalacao:
  ```bash
  node --version
  ```

### 2. Expo Go (para testar em dispositivo fisico)

- **Android:** Baixe o Expo Go na Play Store
- **iOS:** Baixe o Expo Go na App Store

### 3. Backend rodando

**IMPORTANTE:** O backend deve estar rodando antes de iniciar o mobile.

```bash
# Em um terminal separado:
cd backend
npm install
npm run dev
```

O backend deve estar em `http://localhost:3000`

---

## Passos para Rodar o Mobile

### Passo 1: Instalar Dependencias

```bash
cd mobile
npm install
```

### Passo 2: Configurar a URL da API

#### Opcao A: Testar no Emulador (localhost funciona)

Nao precisa mudar nada, a configuracao padrao ja usa `http://localhost:3000`.

#### Opcao B: Testar em Dispositivo Fisico

Voce precisa usar o IP da sua maquina na rede local.

1. Descubra seu IP local:
   ```bash
   ipconfig
   ```
   Procure por **IPv4 Address** (ex: `192.168.1.100`)

2. Edite o arquivo `mobile/app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "apiUrl": "http://SEU_IP_AQUI:3000"
       }
     }
   }
   ```
   Exemplo:
   ```json
   {
     "expo": {
       "extra": {
         "apiUrl": "http://192.168.1.100:3000"
       }
     }
   }
   ```

3. **Tambem configure o CORS no backend**
   
   No arquivo `backend/.env`, adicione seu IP:
   ```env
   CORS_ORIGIN=http://192.168.1.100:8081
   ```

### Passo 3: Iniciar o Expo

```bash
npm start
```

Voce vera um QR Code no terminal e varias opcoes:

```
Press a - open Android
Press i - open iOS simulator
Press w - open web
Press r - reload app
Press j - open debugger
Press m - toggle menu
```

### Passo 4: Abrir o App

#### No Dispositivo Fisico (Expo Go)

1. Abra o app **Expo Go** no seu celular
2. Escaneie o QR Code que aparece no terminal
3. O app vai carregar automaticamente

#### No Emulador Android

1. Certifique-se que o Android Studio esta instalado com um emulador configurado
2. Inicie o emulador
3. Pressione `a` no terminal do Expo
4. Ou execute:
   ```bash
   npm run android
   ```

#### No Simulador iOS (apenas macOS)

1. Certifique-se que o Xcode esta instalado
2. Pressione `i` no terminal do Expo
3. Ou execute:
   ```bash
   npm run ios
   ```

#### No Navegador Web

```bash
npm run web
```
Ou pressione `w` no terminal do Expo.

---

## Comandos Uteis

| Comando | Descricao |
|---------|-----------|
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run android` | Abre no emulador Android |
| `npm run ios` | Abre no simulador iOS |
| `npm run web` | Abre no navegador |
| `npm run lint` | Verifica erros de codigo |

---

## Troubleshooting

### Erro: "Network Error" ou "Unable to connect to API"

**Causa:** O app mobile nao consegue se conectar ao backend.

**Solucoes:**
1. Verifique se o backend esta rodando (`http://localhost:3000/health`)
2. Se estiver usando dispositivo fisico, use o IP local (nao `localhost`)
3. Verifique se o CORS esta configurado corretamente no backend
4. Certifique-se que celular e computador estao na mesma rede Wi-Fi

### Expo Go nao abre o app

**Solucoes:**
1. Verifique se esta na mesma rede Wi-Fi
2. Tente pressionar `r` no terminal para recarregar
3. Feche e abra o Expo Go novamente
4. Tente com `npx expo start --tunnel` (cria um tunel publico)

### Emulador Android nao abre

**Solucoes:**
1. Verifique se o Android Studio esta instalado
2. Configure as variaveis de ambiente:
   ```bash
   # Adicione ao PATH do sistema:
   %LOCALAPPDATA%\Android\Sdk\platform-tools
   %LOCALAPPDATA%\Android\Sdk\emulator
   ```
3. Certifique-se que ha um AVD (emulador) configurado no Android Studio

### Erro de dependencias / Metro Bundler

**Solucoes:**
```bash
# Limpe o cache do npm
npm cache clean --force

# Delete node_modules e reinstale
rm -rf node_modules
npm install

# Limpe o cache do Expo
npx expo start --clear
```

### Tela branca ou app nao carrega

**Solucoes:**
1. Pressione `r` para recarregar
2. Feche o app no dispositivo e abra novamente
3. Reinicie o servidor Expo (Ctrl+C e `npm start`)

---

## Configuracao do Android Studio (Windows)

Se voce quiser usar o emulador Android:

### 1. Instalar Android Studio

Baixe em: https://developer.android.com/studio

### 2. Configurar SDK

1. Abra Android Studio
2. Va em **More Actions** -> **SDK Manager**
3. Instale:
   - Android SDK Platform 34 (ou mais recente)
   - Android SDK Build-Tools
   - Android Emulator
   - Intel x86 Emulator Accelerator (HAXM)

### 3. Criar um Emulador (AVD)

1. Va em **More Actions** -> **Virtual Device Manager**
2. Clique em **Create Device**
3. Escolha um dispositivo (ex: Pixel 6)
4. Escolha uma imagem do sistema (ex: API 34)
5. Finalize a criacao

### 4. Configurar Variaveis de Ambiente

Adicione ao PATH do Windows:
- `%LOCALAPPDATA%\Android\Sdk\platform-tools`
- `%LOCALAPPDATA%\Android\Sdk\emulator`

Crie a variavel `ANDROID_HOME`:
- `%LOCALAPPDATA%\Android\Sdk`

---

## Estrutura do Projeto Mobile

```
mobile/
  app/                    # Rotas (file-based routing)
    _layout.tsx           # Layout raiz
    index.tsx             # Tela inicial
    (auth)/               # Telas de autenticacao
      login.tsx
      register.tsx
    (tabs)/               # Navegacao por abas
      index.tsx           # Home
      explore.tsx         # Busca
      library.tsx         # Biblioteca
    album/[id].tsx        # Detalhes do album
    artist/[id].tsx       # Perfil do artista
    playlist/[id].tsx     # Detalhes da playlist
    player/index.tsx      # Player em tela cheia
  src/
    contexts/             # Contextos React (Auth, Player)
    features/             # Features por dominio
    shared/               # Componentes e configs compartilhados
  assets/                 # Imagens e recursos
```

---

## Fluxo de Uso do App

1. **Login/Registro**
   - Ao abrir o app, voce sera direcionado para a tela de login
   - Crie uma conta ou faca login

2. **Home**
   - Veja suas playlists e albuns populares
   - Navegue pelas musicas

3. **Busca (Explore)**
   - Pesquise artistas, albuns e musicas

4. **Biblioteca**
   - Acesse suas playlists salvas

5. **Player**
   - Toque em uma musica para reproduzir
   - Use o MiniPlayer para controles rapidos

---

## Checklist Rapido

- [ ] Node.js v20+ instalado
- [ ] Backend rodando em `localhost:3000`
- [ ] Dependencias do mobile instaladas (`npm install`)
- [ ] URL da API configurada (se dispositivo fisico)
- [ ] Expo Go instalado no celular (se dispositivo fisico)
- [ ] Mesma rede Wi-Fi (celular e computador)

