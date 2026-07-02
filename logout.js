export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT slug, updated_at FROM posts WHERE published = 1 ORDER BY created_at DESC`
  ).all();

  const urls = results.map(p => `
  <url>
    <loc>https://blog.primochops.com/posts/${p.slug}</loc>
    <lastmod>${p.updated_at.slice(0, 10)}</lastmod>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://blog.primochops.com/</loc></url>${urls}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml;charset=UTF-8' } });
}
