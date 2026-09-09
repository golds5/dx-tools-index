// Edge Middleware — gates every route except the sign-in page and its endpoints.
// Runs before any static file is served, so index.html is never sent to an
// unauthenticated client.

const PUBLIC = new Set([
  '/login',
  '/login.html',
  '/api/login',
  '/api/logout',
  '/robots.txt',
  '/favicon.ico',
]);

const COOKIE = 'dxsess';
const enc = new TextEncoder();

function b64urlToBytes(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64url(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function valid(token, secret) {
  const dot = token.lastIndexOf('.');
  if (dot < 1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(payload)));
  if (bytesToB64url(mac) !== sig) return false;

  try {
    const data = JSON.parse(new TextDecoder().decode(b64urlToBytes(payload)));
    return typeof data.exp === 'number' && data.exp > Date.now();
  } catch {
    return false;
  }
}

export default async function middleware(request) {
  const { pathname } = new URL(request.url);
  if (PUBLIC.has(pathname)) return; // continue to the destination

  const secret = process.env.AUTH_SECRET;
  const cookie = request.headers.get('cookie') || '';
  const hit = new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)').exec(cookie);

  if (secret && hit) {
    try {
      if (await valid(decodeURIComponent(hit[1]), secret)) return;
    } catch { /* fall through to the redirect */ }
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/login',
      'Cache-Control': 'no-store',
      'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}
