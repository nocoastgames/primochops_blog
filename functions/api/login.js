import { json } from '../_lib/auth.js';

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Bad request' }, 400);
  }

  if (!env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET) {
    return json({ error: 'Server not configured — missing ADMIN_PASSWORD or ADMIN_SESSION_SECRET' }, 500);
  }

  if (body.password !== env.ADMIN_PASSWORD) {
    return json({ error: 'Wrong password' }, 401);
  }

  const cookie = `session=${encodeURIComponent(env.ADMIN_SESSION_SECRET)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`;
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie },
  });
}
