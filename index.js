import { renderPage, escapeHtml, formatDate } from '../_lib/render.js';

export async function onRequestGet({ env, params }) {
  const post = await env.DB.prepare(
    `SELECT * FROM posts WHERE slug = ?1 AND published = 1`
  ).bind(params.slug).first();

  if (!post) {
    return new Response(renderPage({
      title: 'Post not found — Fab Tabs Shop Notes',
      description: 'This post could not be found.',
      bodyHtml: `<article class="post"><h1 class="post-title">Post not found</h1><p>That one's not here. <a href="/">Back to all posts</a></p></article>`,
    }), { status: 404, headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  }

  const bodyHtml = `
    <article class="post">
      <div class="post-meta"><span class="stamp">${escapeHtml(post.category)}</span> ${formatDate(post.created_at)}</div>
      <h1 class="post-title">${escapeHtml(post.title)}</h1>
      <div class="post-body">${post.body_html}</div>
      <a class="back-link" href="/">← Back to all posts</a>
    </article>`;

  const html = renderPage({
    title: `${post.title} — Fab Tabs Shop Notes`,
    description: post.excerpt,
    bodyHtml,
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
}
