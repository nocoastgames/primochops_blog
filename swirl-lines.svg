export async function onRequestPost() {
  const cookie = `session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie },
  });
}
