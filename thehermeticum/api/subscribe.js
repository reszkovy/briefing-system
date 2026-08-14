// Zapis do audiencji Resend. Wymaga env: RESEND_API_KEY, RESEND_AUDIENCE_ID.
// Bez nich zwraca 503 — formularz pokaże uczciwy komunikat zamiast udawać sukces.
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(JSON.stringify({ ok: false, error: 'method' })); }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const email = String((body && body.email) || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    res.statusCode = 400; return res.end(JSON.stringify({ ok: false, error: 'invalid_email' }));
  }
  const key = process.env.RESEND_API_KEY, aud = process.env.RESEND_AUDIENCE_ID;
  if (!key || !aud) { res.statusCode = 503; return res.end(JSON.stringify({ ok: false, error: 'not_configured' })); }
  const r = await fetch(`https://api.resend.com/audiences/${aud}/contacts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, unsubscribed: false }),
  });
  if (r.ok || r.status === 409) { res.statusCode = 200; return res.end(JSON.stringify({ ok: true })); }
  res.statusCode = 502; return res.end(JSON.stringify({ ok: false, error: 'esp_error' }));
};
