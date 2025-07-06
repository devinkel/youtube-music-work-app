# Chibata FM (Full-Stack)

Um projeto para criar uma radio colaborativa onde a equipe pode adicionar músicas à sua playlist do YouTube Music.

Este repositório contém dois diretórios:

* **api/**: backend implementado como Cloudflare Worker com Hono.js.
* **app/**: front-end em Vue 3, publicado no Cloudflare Pages.

---

## 📦 Estrutura do Projeto

```
ytmusic-work/
├── api/      # Cloudflare Worker (Hono.js)
└── app/      # Front-end Vue 3 (Vite)
```

---

## 🔑 Configurações no Google Cloud para API

1. **Crie um projeto no Google Cloud**

   * Acesse [https://console.cloud.google.com/apis](https://console.cloud.google.com/apis)
   * Clique em **Criar Projeto** e forneça um nome.

2. **Habilite a YouTube Data API v3**

   * No painel do projeto, vá em **APIs e Serviços → Biblioteca**
   * Busque por **YouTube Data API v3** e clique em **Habilitar**.

3. **Crie credenciais OAuth 2.0**

   * Em **APIs e Serviços → Credenciais**, clique em **Criar Credenciais → OAuth client ID**.
   * Tipo: **Web application**.
   * Em **URIs de redirecionamento autorizados**, adicione:

     ```
     https://developers.google.com/oauthplayground
     ```
   * Anote **Client ID** e **Client Secret**.

4. **Obtenha o Refresh Token**

   * Acesse o **OAuth 2.0 Playground**: [https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)
   * Clique na engrenagem (⚙️) → ative **Use your own OAuth credentials** → cole seu Client ID e Client Secret.
   * Em **Select & authorize APIs**, marque o escopo:

     ```
     https://www.googleapis.com/auth/youtube.force-ssl
     ```
   * Clique em **Authorize APIs**, faça login e depois em **Exchange authorization code for tokens**.
   * Copie o valor de **refresh\_token**.

---

## 🔒 Variáveis de Ambiente

### Backend (dir: `api/`)

No diretório `api`, crie ou insira os segredos via Wrangler:

```bash
cd api
wrangler secret put CLIENT_ID       # seu OAuth Client ID
wrangler secret put CLIENT_SECRET   # seu OAuth Client Secret
wrangler secret put REFRESH_TOKEN   # seu refresh_token gerado
wrangler secret put PLAYLIST_ID     # ID da playlist no YouTube Music
```

### Front-end (dir: `app/`)

No diretório `app`, crie um arquivo `.env.local` com:

```
VITE_API_URL=https://<seu-worker>.workers.dev
```

> Substitua `<seu-worker>.workers.dev` pela URL retornada ao publicar seu Worker.

---

## 🚀 Como rodar em local

### 1. Backend (Cloudflare Worker)

```bash
cd api
npm install
wrangler dev        # inicia o worker em http://localhost:8787
```

Teste com:

```bash
curl http://localhost:8787/preview?query=Never%20Gonna%20Give%20You%20Up
curl http://localhost:8787/add-song -X POST \
  -H 'Content-Type: application/json' \
  -d '{"videoId":"dQw4w9WgXcQ"}'
```

### 2. Front-end (Vue 3)

```bash
cd app
npm install
npm run dev        # inicia Vite em http://localhost:3000
```

Abra o navegador em `http://localhost:3000`, busque uma música, selecione o preview e adicione à playlist.

---

## ☁️ Deploy em produção

### Backend

```bash
cd api
wrangler publish    # publica o Worker na sua conta Cloudflare
```

### Front-end

1. Envie `app/` para um repositório Git (por exemplo, GitHub).
2. No painel Cloudflare Pages:

   * **Connect repository**: selecione seu repositório e branch.
   * **Framework**: Vite
   * **Build command**: `npm install && npm run build`
   * **Build directory**: `dist`
   * **Environment variable**: `VITE_API_URL` com a URL do Worker
3. Clique em **Save and Deploy**.

---

**Pronto!** Agora sua **CHIBATA FM** está no ar: uma rádio colaborativa onde o time pode sintonizar e pedir suas músicas favoritas direto no YouTube Music. 🎶😁
