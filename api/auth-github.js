// api/auth-github.js
export default function handler(req, res) {
  const { SUPABASE_URL } = process.env;
  // 从 ?redirect=xxx 拿到前端要跳回的地址
  const redirectTo = req.query.redirect || 'https://oliverfr.com/admin-mefan-articles.html';
  // 构造 Supabase OAuth 授权链接
  const authorizeUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=github&redirect_to=${encodeURIComponent(redirectTo)}`;
  res.writeHead(302, { Location: authorizeUrl });
  res.end();
}
