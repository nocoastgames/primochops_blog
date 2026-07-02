import { requireAuth, json, slugify } from '../../_lib/auth.js';

// GET /api/posts            -> published posts, newest first
// GET /api/posts?all=1      -> all posts incl. drafts (requires auth)
// GET /api/posts?q=keyword  -> full-text search across title/excerpt/body
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const all = url.searchParams.get('all') === '1';

  if (all) {
    const authFail = requireAuth(request, env);
    if (authFail) return authFail;
  }

  let stmt;
  if (q && q.trim()) {
    // Full-text search via the FTS5 index kept in sync by triggers.
    stmt = env.DB.prepare(
      `SELECT posts.id, posts.slug, posts.title, posts.category, posts.excerpt,
              posts.published, posts.created_at, posts.updated_at
       FROM posts_fts
       JOIN posts ON posts.id = posts_fts.rowid
       WHERE posts_fts MATCH ?1
       ${all ? '' : 'AND posts.published = 1'}
       ORDER BY rank`
    ).bind(q.trim() + '*');
  } else {
    stmt = env.DB.prepare(
      `SELECT id, slug, title, category, excerpt, published, created_at, updated_at
       FROM posts
       ${all ? '' : 'WHERE published = 1'}
       ORDER BY created_at DESC`
    );
  }

  const { results } = await stmt.all();
  return json({ posts: results });
}

// POST /api/posts -> create a new post (requires auth)
export async function onRequestPost({ request, env }) {
  const authFail = requireAuth(request, env);
  if (authFail) return authFail;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Bad request' }, 400);
  }

  const title = (body.title || '').trim();
  if (!title) return json({ error: 'Title is required' }, 400);

  const slug = (body.slug && body.slug.trim()) ? slugify(body.slug) : slugify(title);
  const category = (body.category || 'General').trim();
  const excerpt = (body.excerpt || '').trim();
  const bodyHtml = body.body_html || '';
  const published = body.published === false ? 0 : 1;

  try {
    await env.DB.prepare(
      `INSERT INTO posts (slug, title, category, excerpt, body_html, published)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)`
    ).bind(slug, title, category, excerpt, bodyHtml, published).run();
  } catch (err) {
    if (String(err).includes('UNIQUE')) {
      return json({ error: `A post with slug "${slug}" already exists` }, 409);
    }
    return json({ error: 'Database error: ' + String(err) }, 500);
  }

  return json({ ok: true, slug });
}
