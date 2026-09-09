import crypto from 'node:crypto';

const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const DOMAIN = '@s5tech.co';

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function equal(a, b) {
  const x = Buffer.from(String(a), 'utf8');
  const y = Buffer.from(String(b), 'utf8');
  // timingSafeEqual throws on length mismatch, so compare lengths first —
  // length is not the secret here, the value is.
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const secret = process.env.AUTH_SECRET;
  const expected = process.env.AUTH_PASSWORD;
  if (!secret || !expected) {
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const email = String(body?.email ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '');

  // endsWith, not includes: "someone@s5tech.co.example.com" must not pass.
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.endsWith(DOMAIN);
  const passOk = equal(password, expected);

  // Blunt the rate of an online guessing attack. Not a substitute for real
  // rate limiting, which needs shared state this project does not have.
  await new Promise((r) => setTimeout(r, 400));

  if (!emailOk || !passOk) {
    return res.status(401).json({ error: 'That email or password is not right.' });
  }

  const payload = b64url(JSON.stringify({ e: email, exp: Date.now() + TTL_MS }));
  const sig = b64url(crypto.createHmac('sha256', secret).update(payload).digest());

  res.setHeader(
    'Set-Cookie',
    `dxsess=${payload}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${TTL_MS / 1000}`
  );
  return res.status(200).json({ ok: true });
}
