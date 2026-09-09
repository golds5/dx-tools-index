export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Set-Cookie', 'dxsess=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax');
  res.statusCode = 302;
  res.setHeader('Location', '/login');
  return res.end();
}
