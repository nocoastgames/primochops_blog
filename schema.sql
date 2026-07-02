-- Fab Tabs Shop Notes — D1 schema
-- Run this once against your D1 database to create the posts table.

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  excerpt TEXT NOT NULL DEFAULT '',
  body_html TEXT NOT NULL DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1,      -- 1 = live, 0 = draft
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Full-text search index over title + excerpt + body.
-- This is what lets "search" work later without changing the schema —
-- every post you save automatically stays searchable, no extra step.
CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
  title,
  excerpt,
  body_html,
  content='posts',
  content_rowid='id'
);

-- Keep the search index in sync automatically whenever posts change.
CREATE TRIGGER IF NOT EXISTS posts_ai AFTER INSERT ON posts BEGIN
  INSERT INTO posts_fts(rowid, title, excerpt, body_html)
  VALUES (new.id, new.title, new.excerpt, new.body_html);
END;

CREATE TRIGGER IF NOT EXISTS posts_ad AFTER DELETE ON posts BEGIN
  INSERT INTO posts_fts(posts_fts, rowid, title, excerpt, body_html)
  VALUES ('delete', old.id, old.title, old.excerpt, old.body_html);
END;

CREATE TRIGGER IF NOT EXISTS posts_au AFTER UPDATE ON posts BEGIN
  INSERT INTO posts_fts(posts_fts, rowid, title, excerpt, body_html)
  VALUES ('delete', old.id, old.title, old.excerpt, old.body_html);
  INSERT INTO posts_fts(rowid, title, excerpt, body_html)
  VALUES (new.id, new.title, new.excerpt, new.body_html);
END;

-- Seed data: your existing corrected post, so the blog isn't empty on launch.
INSERT INTO posts (slug, title, category, excerpt, body_html, published, created_at, updated_at)
VALUES (
  '3-bolt-vs-single-bolt-exhaust-flange',
  '3-Bolt vs. Single-Bolt Exhaust Flange: What Actually Matters',
  'Exhaust',
  'Both hold a pipe on. They don''t hold up the same way, and they don''t fit the same builds. Here''s how to pick the right one before you''re stuck grinding off a bad weld.',
  '<p>Every flange holds a pipe to a port. That part''s not up for debate. What''s actually different between a 3-bolt and a single-bolt flange is how long it stays sealed once the engine''s hot, moving, and you''re forty miles from the garage.</p>
<p>If you''ve never had a pipe rattle loose at 60 on the highway, count yourself lucky and read this anyway.</p>
<h2>The single-bolt flange</h2>
<p>Single-bolt flanges are simple, cheap, and were the standard on a lot of stock setups for a reason: they work fine when everything else around them is stock too. One bolt, one compression point, done.</p>
<p>The catch is exactly where you''d think. One bolt means one clamping point, which means the flange can rock slightly around that single point under vibration — and vibration is the one thing a running V-twin never runs out of. Over time that rocking motion works the gasket, and a seal that was fine on day one starts leaking exhaust by day two hundred. It''s rarely catastrophic. It''s just a slow tick that turns into a slow leak that turns into a Saturday you didn''t plan on spending under the bike.</p>
<h2>The 3-bolt flange</h2>
<p>The 3-bolt pattern exists because of STD — a company that built cylinder heads specifically to fix the single-bolt problem. Instead of one clamping point that can rock under vibration, STD heads use a 3-bolt exhaust port pattern: three points of contact holding the gasket flat and even, with no single pivot point to work loose.</p>
<p>Here''s the part that trips people up: <strong>a 3-bolt flange isn''t a universal upgrade you can weld onto any head.</strong> It only bolts up to the STD 3-bolt pattern — either genuine STD heads, or heads that have been machined to accept that same pattern. If your heads are stock with the standard single-bolt exhaust port and haven''t been modified, a 3-bolt flange simply won''t line up.</p>
<div class="shop-note"><span class="label">From the bench</span>Our own <a href="https://www.primochops.com/product/3-bolt-std-style-weld-on-exhaust-flanges">3-Bolt STD Style flange</a> is cut to that exact STD pattern, so it drops straight onto STD heads or heads already modified to accept it. If you''re running a Shovelhead specifically, the <a href="https://www.primochops.com/product/heavy-metal-shovelhead-exhaust-flanges">"Heavy Metal" Shovelhead flange</a> is built to that head pattern directly.</div>
<h2>So which one do you actually run?</h2>
<p>This one comes down to what your heads actually are, not personal preference. Check your port pattern before you buy anything:</p>
<ul>
<li><strong>Stock heads, standard single-bolt exhaust port:</strong> run a single-bolt flange. A 3-bolt flange has nothing to bolt to on a head that was never machined for it.</li>
<li><strong>Genuine STD heads, or heads modified to accept the STD 3-bolt pattern:</strong> run the 3-bolt flange. That''s what the pattern was built for, and it solves the exact vibration problem single-bolt flanges are known for.</li>
</ul>
<p>If you''re not sure which pattern your heads have, look at the exhaust port before you order — a stock single-bolt head has one threaded hole below the port; an STD or STD-pattern head has three arranged around it. Don''t guess from the flange side; confirm it on the head.</p>
<h2>Welding it in</h2>
<p>A few things that save headaches regardless of which flange you''re running:</p>
<ul>
<li><strong>Tack all bolt holes before final welding.</strong> A flange that''s slightly twisted before you commit to a full weld stays slightly twisted forever.</li>
<li><strong>Match your flange material to your pipe.</strong> Mild steel to mild steel welds clean. Mixing stainless and mild steel is doable but wants the right rod and a steadier hand.</li>
<li><strong>Don''t skip the gasket, even on a "temporary" test fit.</strong> Temporary has a way of becoming permanent on a bike that''s finally running.</li>
</ul>',
  1,
  '2026-07-02 12:00:00',
  '2026-07-02 12:00:00'
);
