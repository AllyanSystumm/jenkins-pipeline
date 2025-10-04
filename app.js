const express = require('express');
const path = require('path');

const app = express();

// Read environment: prefer ENV, fallback to NODE_ENV, default to 'dev'
const envName = (process.env.ENV || process.env.NODE_ENV || 'dev').toLowerCase();
const port = process.env.PORT || 3000;

// Serve static assets
app.use('/static', express.static(path.join(__dirname, 'public')));

// Simple route that returns rendered HTML with the env value
app.get('/', (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Welcome</title>
      <style>
        body { font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; background:#f7fafc; }
        .card { background:white; padding:32px 40px; border-radius:12px; box-shadow: 0 6px 20px rgba(16,24,40,0.08); text-align:center; }
        h1 { margin:0 0 8px 0; font-size:28px; }
        p { margin:0; color:#334155; }
        .env { font-weight:700; color:#0f172a; background:#eef2ff; padding:4px 10px; border-radius:6px; display:inline-block; margin-left:8px; }
      </style>
    </head>
    <body>
      <div class="card" role="main">
        <h1>Welcome to <span class="env">${escapeHtml(envName)}</span></h1>
        <p>Server running on port ${port}</p>
      </div>
    </body>
    </html>
  `);
});

// basic health check
app.get('/health', (req, res) => res.json({ status: 'ok', env: envName }));

// start server
app.listen(port, () => {
  console.log(`env-welcome app listening on port ${port} (env=${envName})`);
});

// small helper to avoid accidental HTML injection (though envName is controlled)
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
