# Port-folio

A simple personal portfolio website with optional PWA features (installable and works offline).

Quick start

- Open `index.html` in your browser for a quick preview.
- To enable the service worker and PWA features, serve the folder over HTTP. Example (PowerShell):

```powershell
python -m http.server 8000
# then open http://localhost:8000
```

PWA & offline

- This project includes `manifest.json` and `service-worker.js`.
- If offline, the site uses `offline.html` as a fallback for navigations.

Key files (short)

- `index.html` — main page
- `style.css`, `font.css` — styles
- `script.js`, `Functions/JS_Functions.js` — scripts
- `manifest.json`, `service-worker.js`, `offline.html` — PWA support
- `Assets/`, `Data/`, `textures/` — images, sounds and JSON content

Contribute / License

- Edit files, test locally, and open a pull request.
- See `LICENSE` for license terms.
