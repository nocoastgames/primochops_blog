// Shared page shell so the homepage, post pages, etc. all render with
// identical head tags, header, and footer. Not a route — no onRequest export.

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function formatDate(iso) {
  const d = new Date(iso.replace(' ', 'T') + 'Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const HEAD = (title, description) => `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="alternate" type="application/rss+xml" title="Fab Tabs Shop Notes" href="/rss.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Public+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
`;

const HEADER = `
<header class="site-header">
  <div class="kicker">Fab Tabs / primochops.com</div>
  <h1 class="site-title"><a href="/">Shop Notes</a></h1>
  <p class="site-tagline">Fitment guides, build notes, and fabrication know-how for garage-built choppers — straight from the bench.</p>
  <nav class="site-nav">
    <a href="https://www.primochops.com">← Back to the shop</a>
    <a href="/rss.xml">RSS</a>
  </nav>
</header>
`;

const FOOTER = `
<footer class="site-footer">
  <p>Fab Tabs — garage-built chopper parts. <a href="https://www.primochops.com">primochops.com</a></p>
</footer>
`;

export function renderPage({ title, description, header = true, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>${HEAD(title, description)}</head>
<body>
<div class="wrap">
${header ? HEADER : ''}
<main>
${bodyHtml}
</main>
${FOOTER}
</div>
</body>
</html>`;
}
