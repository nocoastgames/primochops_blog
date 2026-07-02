import { renderPage, escapeHtml, formatDate } from './_lib/render.js';

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT slug, title, category, excerpt, created_at
     FROM posts WHERE published = 1 ORDER BY created_at DESC`
  ).all();

  const cards = results.length
    ? results.map(p => `
      <li class="tag-card">
        <div class="meta"><span class="stamp">${escapeHtml(p.category)}</span> ${formatDate(p.created_at)}</div>
        <h2><a href="/posts/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></h2>
        <p>${escapeHtml(p.excerpt)}</p>
        <a class="read-more" href="/posts/${escapeHtml(p.slug)}">Read the full guide →</a>
      </li>`).join('\n')
    : `<li class="tag-card"><p>No posts yet — the first one's coming soon.</p></li>`;

  const html = renderPage({
    title: 'Fab Tabs Shop Notes — garage-built chopper fabrication',
    description: 'Fitment guides, build notes, and fabrication know-how from Fab Tabs — garage-built chopper parts.',
    bodyHtml: `<ul class="post-list">\n${cards}\n</ul>`,
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
}
