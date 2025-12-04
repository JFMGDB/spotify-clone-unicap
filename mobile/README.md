# Spotify Clone - Mobile

Aplicativo mobile desenvolvido em **React Native + Expo** com **Expo Router** e **TypeScript**.

## Início Rápido

### Pré-requisitos

- Node.js v20.x LTS ou superior
- npm ou yarn
- Expo Go instalado no dispositivo móvel (iOS ou Android)
- Ou emulador Android / Simulador iOS configurado

### Instalação

1. Entre no diretório do projeto:
   ```bash
   cd mobile
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente (opcional):
   ```bash
   # Crie um arquivo .env na raiz do projeto
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   ```

### Executar em Desenvolvimento

```bash
npm start
```

Ou use os comandos específicos:
- `npm run android` - Abre no emulador Android
- `npm run ios` - Abre no simulador iOS
- `npm run web` - Abre no navegador
- `npm run lint` - Executa o linter

No output, você encontrará opções para abrir o app em:
- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), um sandbox limitado para testar desenvolvimento com Expo

### Testar no Dispositivo

1. Execute `npm start`
2. Escaneie o QR Code com:
   - **iOS**: Câmera nativa ou Expo Go
   - **Android**: Expo Go

## Estrutura do Projeto

```
spotify-clone/
  app/                    # Rotas (Expo Router file-based)
    _layout.tsx          # Root layout
    (auth)/              # Stack de autenticação
    (tabs)/              # Navegação principal (tabs)
    album/               # Rotas de álbuns
    artist/              # Rotas de artistas
    player/              # Rotas do player
    playlist/            # Rotas de playlists
    index.tsx            # Tela inicial
  src/
    features/            # Features por domínio
      auth/
      playlists/
      player/
      profile/
      search/
    shared/             # Código compartilhado
      components/       # Componentes reutilizáveis
      hooks/            # Custom hooks
      lib/              # Bibliotecas (apiClient, etc.)
      theme/            # Tema (React Native Paper)
      config/           # Configurações
    stores/             # Stores Zustand
  assets/               # Imagens e recursos estáticos
  components/           # Componentes do template Expo
  constants/            # Constantes do template
  hooks/                # Hooks do template
```

## Tecnologias

- **React Native**: Framework mobile
- **Expo**: Plataforma e ferramentas (~54.0.26)
- **Expo Router**: Roteamento baseado em arquivos (~6.0.16)
- **TypeScript**: Tipagem estática (~5.9.2)
- **React**: 19.1.0
- **React Native**: 0.81.5
- **React Navigation**: Navegação nativa
- **React Native Reanimated**: Animações performáticas
- **React Native Gesture Handler**: Gestos nativos

## Desenvolvimento

Você pode começar a desenvolver editando os arquivos dentro do diretório **app**. Este projeto usa [roteamento baseado em arquivos](https://docs.expo.dev/router/introduction).

### Comandos Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run android` - Abre no emulador Android
- `npm run ios` - Abre no simulador iOS
- `npm run web` - Abre no navegador
- `npm run lint` - Executa o linter
- `npm run reset-project` - Move código inicial para app-example e cria app vazio

## Próximos Passos

1. Configurar React Native Paper e tema (Épico 10)
2. Implementar telas de autenticação (Épico 2)
3. Implementar integração com API (Épico 2)
4. Implementar telas principais (Épicos 4-9)

## Recursos

- [Expo documentation](https://docs.expo.dev/): Aprenda fundamentos ou vá para tópicos avançados com nossos [guides](https://docs.expo.dev/guides)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Siga um tutorial passo a passo onde você criará um projeto que roda em Android, iOS e web
- [Expo Router documentation](https://docs.expo.dev/router/introduction/): Documentação do sistema de roteamento

## Comunidade

Junte-se à comunidade de desenvolvedores criando apps universais:

- [Expo no GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)
