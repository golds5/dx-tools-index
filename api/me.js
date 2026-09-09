import crypto from 'node:crypto';

// Who is signed in. Used only to decide which optional controls the page shows —
// it grants nothing. Anything that actually needs protecting is gated on its own
// server side, not by hiding a button here.

const COOKIE = 'dxsess';

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const secret = process.env.AUTH_SECRET;
  if (!secret) return res.status(200).json({ email: null });

  const cookie = req.headers.cookie || '';
  const hit = new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)').exec(cookie);
  if (!hit) return res.status(200).json({ email: null });

  const token = decodeURIComponent(hit[1]);
  const dot = token.lastIndexOf('.');
  if (dot < 1) return res.status(200).json({ email: null });

  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const want = b64url(crypto.createHmac('sha256', secret).update(payload).digest());

  // Compare as fixed-length base64url strings, so timingSafeEqual cannot throw.
  if (sig.length !== want.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want))) {
    return res.status(200).json({ email: null });
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof data.exp !== 'number' || data.exp <= Date.now()) {
      return res.status(200).json({ email: null });
    }
    return res.status(200).json({ email: String(data.e || '') || null });
  } catch {
    return res.status(200).json({ email: null });
  }
}
