// Shared helpers for functions/api/* routes.
// Not a route itself — no onRequest export, so Pages won't treat this as a URL.

export function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  const match = header.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export function isLoggedIn(request, env) {
  const session = getCookie(request, 'session');
  return !!session && !!env.ADMIN_SESSION_SECRET && session === env.ADMIN_SESSION_SECRET;
}

export function requireAuth(request, env) {
  if (!isLoggedIn(request, env)) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return null;
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
