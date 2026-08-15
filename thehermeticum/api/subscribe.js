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
  const lang = String((body && body.lang) || 'en').toLowerCase().slice(0, 2);
  const key = process.env.RESEND_API_KEY;
  const aud = (lang === 'pl' && process.env.RESEND_AUDIENCE_ID_PL) || process.env.RESEND_AUDIENCE_ID;
  if (!key || !aud) { res.statusCode = 503; return res.end(JSON.stringify({ ok: false, error: 'not_configured' })); }
  // znacznik zainteresowania (np. lista oczekujących na pełne wydanie) — bez osobnej listy
  const tag = String((body && body.list) || '').toLowerCase().slice(0, 24).replace(/[^a-z0-9-]/g, '');
  const payload = { email, unsubscribed: false };
  if (tag) payload.last_name = tag;
  const r = await fetch(`https://api.resend.com/audiences/${aud}/contacts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (r.ok || r.status === 409) { res.statusCode = 200; return res.end(JSON.stringify({ ok: true })); }
  res.statusCode = 502; return res.end(JSON.stringify({ ok: false, error: 'esp_error' }));
};
