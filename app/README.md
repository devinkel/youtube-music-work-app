# App - ytmusic-work (Front-end)

Vue 3 front-end for **CHIBATA FM**—your team’s collaborative radio interface to request songs via YouTube Music.

Built with [Vue 3](https://vuejs.org/) + Vite, styled with minimal Material Design, and deployed on Cloudflare Pages.

---

## 📦 Folder Structure (in `/app`)

```
app/
├── public/           # Static assets and index.html
├── src/
│   ├── App.vue       # Main component (UI + logic)
│   ├── main.js       # Vue app entry point
│   └── style.css     # Shared styles (Material-minimal + custom loader)
├── .env.local        # Local environment variables (VITE_API_URL)
├── package.json      # Dependencies & scripts
└── vite.config.js    # Vite configuration
```

---

## 🔧 Prerequisites

* **Node.js v16+** (or higher)
* **npm** (comes with Node.js)
* A published Cloudflare Worker URL for the backend API

---

## 🔒 Environment Variables

Create a file named `.env.local` in the `app/` folder:

```env
VITE_API_URL=https://<your-worker>.workers.dev
```

* **VITE\_API\_URL**: the base URL of your deployed backend Worker (e.g., `https://ytmusic-worker.your-subdomain.workers.dev`).

Note: Vite prefixes exposed variables with `VITE_`, making them available in `import.meta.env`.

---

## 🚀 Running Locally

1. **Install dependencies**

   ```bash
   cd app
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

   * Opens at `http://localhost:3000` by default.
   * Supports hot module replacement (HMR) for instant UI updates.

3. **Test the flow**

   * In your browser, go to `http://localhost:3000`.
   * Search for a song, preview results, and click to add it.

---

## 🛠️ Available Scripts

Inside the `app/` directory, run:

* `npm run dev` - Start the development server.
* `npm run build` - Bundle for production into `dist/`.
* `npm run serve` - Preview the production build locally.

---

## ☁️ Deploy to Cloudflare Pages

1. **Push your code**

   ```bash
   cd app
   git add .
   git commit -m "Add front-end for CHIBATA FM"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**

   * In Cloudflare dashboard, go to **Pages → Create a project**.
   * Select your repository and branch (e.g., `main`).

3. **Configure build settings**

   * **Framework preset**: `Vite`
   * **Build command**: `npm install && npm run build`
   * **Build directory**: `dist`

4. **Set environment variable**

   * In **Settings → Environment variables**, add:

     * `VITE_API_URL` = `https://<your-worker>.workers.dev`

     * `VITE_WORK_EMAIL_DOMAIN` = `@yourcompany.email`

5. **Deploy**

   * Save and wait for the Pages build to finish.
   * Your front-end will be live at `https://<project>.pages.dev` (or your custom domain).

---

## 🎉 What’s Next?

* **Customize** the theme colors or animations in `style.css`.
* **Add features** like user avatars, chat of requests, or genre filters.
* **Invite your team** to start requesting tracks and turn your workspace into your own radio station! 😉
