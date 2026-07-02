function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT slug, title, excerpt, created_at
     FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 30`
  ).all();

  const items = results.map(p => `
  <item>
    <title>${escapeXml(p.title)}</title>
    <link>https://blog.primochops.com/posts/${escapeXml(p.slug)}</link>
    <guid>https://blog.primochops.com/posts/${escapeXml(p.slug)}</guid>
    <description>${escapeXml(p.excerpt)}</description>
    <pubDate>${new Date(p.created_at.replace(' ', 'T') + 'Z').toUTCString()}</pubDate>
  </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Fab Tabs Shop Notes</title>
  <link>https://blog.primochops.com/</link>
  <description>Fitment guides, build notes, and fabrication know-how from Fab Tabs — garage-built chopper parts.</description>
  <language>en-us</language>
  ${items}
</channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml;charset=UTF-8' } });
}
