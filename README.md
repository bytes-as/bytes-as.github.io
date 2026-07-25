# ARCH/DEV Portfolio

Static portfolio built from the Architectural Minimalist design. Works on **Vercel** and **GitHub Pages** with no build step.

## Quick start

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

Or open `index.html` directly in a browser (WebGL background still works).

## Customize

Edit **`js/config.js`**:

```js
window.PORTFOLIO_CONFIG = {
  name: "Arun",
  title: "SYSTEM_ARCHITECT / SENIOR_STAFF",
  email: "you@domain.com",
  formspreeId: "",           // see Contact below
  resumeUrl: "./assets/resume.pdf",
  social: {
    github: "https://github.com/you",
    linkedin: "https://linkedin.com/in/you",
    twitter: "https://x.com/you",
  },
};
```

Then replace placeholder copy in `index.html` (roles, projects, education) with your real content. Drop `resume.pdf` into `assets/`.

Design tokens and rationale live in `DESIGN.md`. The original mockup HTML is `code.html`.

---

## Contact — how it works

Static hosts (Vercel / GitHub Pages) cannot send email by themselves. This site supports two modes:

### Option A — Formspree (recommended)

In-page form submit; messages land in your inbox.

1. Sign up at [formspree.io](https://formspree.io) (free tier is enough).
2. Create a form → copy the form ID (e.g. `xpwzgkqr` from `https://formspree.io/f/xpwzgkqr`).
3. Set it in `js/config.js`:

```js
formspreeId: "xpwzgkqr",
email: "you@domain.com",
```

4. Redeploy. Confirm the first submission from your email if Formspree asks.

Works on **both** Vercel and GitHub Pages — no serverless functions needed.

### Option B — Mailto fallback (zero setup)

Leave `formspreeId` empty. Submit opens the visitor’s email client with your address, subject, and message prefilled. The **DIRECT_LINE** email link always works as a backup.

### Why not a custom API?

A Vercel serverless function would only work on Vercel, not GitHub Pages. Formspree keeps one codebase deployable to either host.

---

## Deploy

### Vercel

1. Push this repo to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Other**. Root directory: `.` — no build command.
4. Deploy.

CLI:

```bash
npx vercel
```

### GitHub Pages

1. Push to GitHub.
2. **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: `main` (or `master`), folder: `/ (root)`
3. Site URL: `https://<user>.github.io/<repo>/`

If the site is under a subpath (`/<repo>/`), either:

- Rename the repo to `<user>.github.io` and use the root site, **or**
- Prefix asset paths with your repo name (e.g. `./css/...` already works as relative paths from `index.html`).

Relative paths (`./css`, `./js`, `./assets`) are already set so project pages work when the site is served from the repo root.

---

## Structure

```
├── index.html          # Live site
├── css/styles.css
├── js/config.js        # Your details + Formspree ID
├── js/main.js          # Shader, motion, contact form
├── assets/             # resume.pdf, portrait, etc.
├── vercel.json
├── DESIGN.md           # Design system
├── code.html           # Original design export
└── screen.png          # Design reference
```
