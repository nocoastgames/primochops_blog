import { requireAuth, json } from '../../_lib/auth.js';

// GET /api/posts/:slug -> a single post (published-only unless authed)
export async function onRequestGet({ request, env, params }) {
  const post = await env.DB.prepare(`SELECT * FROM posts WHERE slug = ?1`)
    .bind(params.slug)
    .first();

  if (!post) return json({ error: 'Not found' }, 404);

  if (!post.published) {
    const authFail = requireAuth(request, env);
    if (authFail) return authFail;
  }

  return json({ post });
}

// PUT /api/posts/:slug -> update a post (requires auth)
export async function onRequestPut({ request, env, params }) {
  const authFail = requireAuth(request, env);
  if (authFail) return authFail;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Bad request' }, 400);
  }

  const existing = await env.DB.prepare(`SELECT id FROM posts WHERE slug = ?1`)
    .bind(params.slug)
    .first();
  if (!existing) return json({ error: 'Not found' }, 404);

  const title = (body.title || '').trim();
  const category = (body.category || 'General').trim();
  const excerpt = (body.excerpt || '').trim();
  const bodyHtml = body.body_html || '';
  const published = body.published === false ? 0 : 1;

  await env.DB.prepare(
    `UPDATE posts
     SET title = ?1, category = ?2, excerpt = ?3, body_html = ?4,
         published = ?5, updated_at = datetime('now')
     WHERE slug = ?6`
  ).bind(title, category, excerpt, bodyHtml, published, params.slug).run();

  return json({ ok: true });
}

// DELETE /api/posts/:slug -> delete a post (requires auth)
export async function onRequestDelete({ request, env, params }) {
  const authFail = requireAuth(request, env);
  if (authFail) return authFail;

  await env.DB.prepare(`DELETE FROM posts WHERE slug = ?1`).bind(params.slug).run();
  return json({ ok: true });
}
