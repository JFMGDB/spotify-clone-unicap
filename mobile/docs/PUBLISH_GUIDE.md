# Guia de Publicacao no Expo Go

> Ultima atualizacao: 05/12/2025

Este guia explica como publicar o aplicativo Spotify Clone no Expo Go usando o EAS (Expo Application Services).

---

## Pre-requisitos

- Node.js v20.x LTS ou superior
- Conta no Expo (https://expo.dev/signup)
- EAS CLI instalado globalmente

---

## Instalacao do EAS CLI

```bash
npm install -g eas-cli
```

---

## Login no EAS

```bash
eas login
```

Voce sera direcionado para o navegador para autenticar.

---

## Configuracao do Projeto

O projeto ja esta configurado com:

- `eas.json`: Configuracoes de build e update
- `app.json`: Configuracoes do Expo com projectId e updates
- `expo-updates`: Pacote para atualizacoes OTA (Over-The-Air)

---

## Publicar no Expo Go

### Branch Preview (Desenvolvimento)

Para publicar uma versao de preview:

```bash
npm run publish:preview
```

Ou diretamente com o EAS:

```bash
eas update --branch preview --message "Descricao da atualizacao"
```

### Branch Production (Producao)

Para publicar uma versao de producao:

```bash
npm run publish:production
```

Ou diretamente com o EAS:

```bash
eas update --branch production --message "Versao X.X.X"
```

---

## Acessar o App no Expo Go

Apos a publicacao, o app pode ser acessado de duas formas:

### 1. Via Dashboard do Expo

Acesse o dashboard do projeto:

https://expo.dev/accounts/andersonmsmarinho/projects/spotify-clone-unicap

Navegue ate a secao "Updates" e clique no update desejado para obter o QR Code.

### 2. Via Link Direto

Apos a publicacao, o EAS fornece um link no formato:

```
https://expo.dev/accounts/andersonmsmarinho/projects/spotify-clone-unicap/updates/[UPDATE_ID]
```

---

## Informacoes do Projeto

| Propriedade | Valor |
|-------------|-------|
| Slug | spotify-clone-unicap |
| Project ID | 46852c7d-1f40-4ade-9ae0-31d27e4e0530 |
| Owner | andersonmsmarinho |
| Bundle ID (iOS) | com.unicap.spotifyclone |
| Package (Android) | com.unicap.spotifyclone |
| API URL (Producao) | https://spotify-clone-unicap.vercel.app |

---

## Configuracao de Ambiente

O app usa a URL da API configurada em `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://spotify-clone-unicap.vercel.app"
    }
  }
}
```

Para desenvolvimento local, altere para o IP da sua maquina:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://SEU_IP_LOCAL:3000"
    }
  }
}
```

---

## Troubleshooting

### Erro de execucao no PowerShell

Se encontrar problemas com a politica de execucao do PowerShell:

1. Abra o PowerShell como Administrador
2. Execute: `Set-ExecutionPolicy RemoteSigned`
3. Ou use o CMD ao inves do PowerShell

### Erro de rede ao publicar

Verifique sua conexao com a internet e tente novamente. O EAS precisa de acesso aos servidores do Expo.

### Projeto nao encontrado

Se o projeto nao for encontrado, execute:

```bash
eas init --non-interactive --force
```

---

## Recursos Externos

- [Documentacao do EAS Update](https://docs.expo.dev/eas-update/introduction/)
- [Expo Go](https://expo.dev/go)
- [EAS CLI Reference](https://docs.expo.dev/eas/cli/)

