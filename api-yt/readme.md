# API - ytmusic-work/backend

Cloudflare Worker backend for **CHIBATA FM**, a collaborative radio that lets your team add songs to a shared YouTube Music playlist.

Built with [Hono.js](https://hono.dev/) and deployed on Cloudflare Workers.

---

## 📦 Folder Structure

```
api/
├── src/
│   └── index.js       # Main Worker code (Hono routes)
├── package.json
└── wrangler.toml      # Cloudflare Workers configuration
```

---

## 🔑 Google Cloud Setup for YouTube Data API

1. **Create or select a Google Cloud project**

   * Go to: [https://console.cloud.google.com/apis](https://console.cloud.google.com/apis)
   * Create a new project or select an existing one.

2. **Enable the YouTube Data API v3**

   * Navigate to **APIs & Services → Library**
   * Search for **YouTube Data API v3** and click **Enable**.

3. **Create OAuth 2.0 credentials**

   * Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
   * Choose **Web application**.
   * Under **Authorized redirect URIs**, add:

     ```
     https://developers.google.com/oauthplayground
     ```
   * Copy the **Client ID** and **Client Secret**.

4. **Obtain a Refresh Token**

   * Open **OAuth 2.0 Playground**: [https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)
   * Click the gear icon (⚙️), enable **Use your own OAuth credentials**, paste your Client ID and Client Secret.
   * In the left panel, select the scope:

     ```
     https://www.googleapis.com/auth/youtube.force-ssl
     ```
   * Click **Authorize APIs**, sign in with your Google account, then click **Exchange authorization code for tokens**.
   * Copy the **refresh\_token** value.

---

## 🔒 Environment Variables

Store secrets using Cloudflare Wrangler commands:

```bash
cd api
wrangler secret put CLIENT_ID       # OAuth Client ID
wrangler secret put CLIENT_SECRET   # OAuth Client Secret
wrangler secret put REFRESH_TOKEN   # Refresh token from OAuth Playground
wrangler secret put PLAYLIST_ID     # Target YouTube Music playlist ID
```

Example entries in `wrangler.toml`:

```toml
name = "ytmusic-worker"
main = "src/index.js"
compatibility_date = "2025-07-05"
```

Ensure you have no hardcoded credentials in code.

---

## 🚀 Running Locally

1. **Install dependencies**

   ```bash
   cd api
   npm install
   ```

2. **Start Wrangler in development mode**

   ```bash
   wrangler dev
   ```

   * The Worker will run at `http://localhost:8787` by default.

3. **Test endpoints**

   * **Preview search**:

     ```bash
     curl "http://localhost:8787/preview?query=Never%20Gonna%20Give%20You%20Up"
     ```
   * **Add a song**:

     ```bash
     curl http://localhost:8787/add-song \
       -X POST \
       -H 'Content-Type: application/json' \
       -d '{"videoId":"dQw4w9WgXcQ"}'
     ```

Successful responses return JSON objects:

* `/preview` → `{ results: [ { videoId, title, thumbnail, duplicate }, ... ] }`
* `/add-song` → `{ success: true, addedVideoId, playlistItemId }`

---

## ☁️ Deploy to Cloudflare Workers

1. **Publish**

   ```bash
   cd api
   wrangler publish
   ```

2. **Verify**

   * After publishing, note the Worker URL (e.g., `https://ytmusic-worker.your-subdomain.workers.dev`).
   * Update your front-end `VITE_API_URL` accordingly.

---

## 🤝 Contribution & Support

Feel free to open issues or pull requests for enhancements, bug fixes, or design tweaks. Let’s make **CHIBATA FM** the go‑to collaborative radio for your team! 🎵
