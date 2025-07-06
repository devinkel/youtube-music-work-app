[Read this in English](#-chibata-fm-en)

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

---

# Chibata FM EN

A collaborative radio project where your team can add songs to a shared YouTube Music playlist.

This repository contains two main folders:

* **api/**: Backend implemented as a Cloudflare Worker using Hono.js.
* **app/**: Front-end built with Vue 3 and deployed on Cloudflare Pages.

---

## 📦 Project Structure

```
ytmusic-work/
├── api/      # Cloudflare Worker (Hono.js)
└── app/      # Vue 3 Front-end (Vite)
```

---

## 🔑 Google Cloud Setup for YouTube API

1. **Create a Google Cloud project**

   * Go to [https://console.cloud.google.com/apis](https://console.cloud.google.com/apis)
   * Click **Create Project** and give it a name.

2. **Enable YouTube Data API v3**

   * In the Cloud Console, navigate to **APIs & Services → Library**
   * Search for **YouTube Data API v3** and click **Enable**.

3. **Create OAuth 2.0 credentials**

   * Go to **APIs & Services → Credentials** and click **Create Credentials → OAuth client ID**.
   * Choose **Web application**.
   * Under **Authorized redirect URIs**, add:

     ```
     https://developers.google.com/oauthplayground
     ```
   * Note down the **Client ID** and **Client Secret**.

4. **Obtain your Refresh Token**

   * Visit the **OAuth 2.0 Playground**: [https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)
   * Click the gear icon (⚙️), enable **Use your own OAuth credentials**, and paste your Client ID/Secret.
   * Under **Select & authorize APIs**, pick the scope:

     ```
     https://www.googleapis.com/auth/youtube.force-ssl
     ```
   * Click **Authorize APIs**, sign in, then click **Exchange authorization code for tokens**.
   * Copy the **refresh\_token** from the response.

---

## 🔒 Environment Variables

### Backend (`api/`)

In the `api` folder, add your secrets via Wrangler:

```bash
cd api
wrangler secret put CLIENT_ID       # Your OAuth Client ID
wrangler secret put CLIENT_SECRET   # Your OAuth Client Secret
wrangler secret put REFRESH_TOKEN   # The refresh_token you obtained
wrangler secret put PLAYLIST_ID     # The ID of your YouTube Music playlist
```

### Front-end (`app/`)

In the `app` folder, create a `.env.local` file:

```
VITE_API_URL=https://<your-worker-subdomain>.workers.dev
```

> Replace `<your-worker-subdomain>` with the URL returned after you publish your Worker.

---

## 🚀 Running Locally

### 1. Backend (Cloudflare Worker)

```bash
cd api
npm install
wrangler dev    # starts the Worker at http://localhost:8787
```

Test endpoints with:

```bash
curl "http://localhost:8787/preview?query=Never%20Gonna%20Give%20You%20Up"
curl http://localhost:8787/add-song \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"videoId":"dQw4w9WgXcQ"}'
```

### 2. Front-end (Vue 3)

```bash
cd app
npm install
npm run dev    # starts Vite at http://localhost:3000
```

Open your browser at `http://localhost:3000`, search for a song, preview results, and add to the playlist.

---

## ☁️ Deploying to Production

### Backend

```bash
cd api
wrangler publish    # deploys your Worker to Cloudflare
```

### Front-end

1. Commit and push the `app/` folder to your Git repository (e.g., GitHub).
2. In the Cloudflare dashboard, go to **Pages → Create a project**.
3. Connect your repository and configure:

   * **Framework preset**: Vite
   * **Build command**: `npm install && npm run build`
   * **Build directory**: `dist`
   * **Environment variable**: `VITE_API_URL` set to your Worker URL
4. Save and deploy.

---

**That’s it!** Your **CHIBATA FM** is live: a playful, collaborative radio where your team can tune in and request their favorite YouTube Music tracks. 🎶😎
