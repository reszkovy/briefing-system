// Odbiór formularza kontaktowego. Wysyłka przez Resend.
// Wymaga zmiennych środowiskowych w projekcie Vercel:
//   RESEND_API_KEY  — klucz z resend.com
//   KONTAKT_DO      — adres, na który mają trafiać zgłoszenia
//   KONTAKT_OD      — adres nadawcy na zweryfikowanej domenie

const LIMIT = 4;                       // zgłoszeń na okno
const OKNO_MS = 10 * 60 * 1000;        // 10 minut
const ostatnie = new Map();            // pamięć instancji — wystarczy na proste odsianie

const escape = (t = '') => String(t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ blad: 'Dozwolona tylko metoda POST.' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'nieznane';
  const teraz = Date.now();
  const historia = (ostatnie.get(ip) || []).filter(t => teraz - t < OKNO_MS);
  if (historia.length >= LIMIT) {
    return res.status(429).json({ blad: 'Zbyt wiele zgłoszeń. Spróbuj za kilka minut.' });
  }
  historia.push(teraz);
  ostatnie.set(ip, historia);

  const dane = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { imie, firma, email, telefon, temat, tresc, zgoda, _pole } = dane;

  // pułapka na roboty — pole ukryte w formularzu, człowiek go nie wypełni
  if (_pole) return res.status(200).json({ ok: true });

  if (!imie?.trim() || !email?.trim() || !tresc?.trim() || !zgoda) {
    return res.status(400).json({ blad: 'Uzupełnij imię, e-mail, treść i zgodę.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
    return res.status(400).json({ blad: 'Podaj poprawny adres e-mail.' });
  }

  const klucz = process.env.RESEND_API_KEY;
  const doKogo = process.env.KONTAKT_DO;
  const odKogo = process.env.KONTAKT_OD;
  if (!klucz || !doKogo || !odKogo) {
    console.error('Brak konfiguracji: RESEND_API_KEY / KONTAKT_DO / KONTAKT_OD');
    return res.status(500).json({ blad: 'Formularz nie jest jeszcze skonfigurowany.' });
  }

  const wiersz = (etykieta, wartosc) => wartosc
    ? `<tr><td style="padding:6px 14px 6px 0;color:#6E6A8A">${etykieta}</td>
         <td style="padding:6px 0"><strong>${escape(wartosc)}</strong></td></tr>` : '';

  const html = `
    <div style="font-family:system-ui,sans-serif;color:#17225C;line-height:1.6">
      <h2 style="margin:0 0 14px">Zgłoszenie z formularza</h2>
      <table style="border-collapse:collapse;font-size:14px">
        ${wiersz('Imię i nazwisko', imie)}
        ${wiersz('Firma', firma)}
        ${wiersz('E-mail', email)}
        ${wiersz('Telefon', telefon)}
        ${wiersz('Temat', temat)}
      </table>
      <p style="margin:18px 0 6px;color:#6E6A8A;font-size:13px">Treść</p>
      <div style="padding:14px 16px;background:#F7F6FC;border-radius:10px;white-space:pre-wrap">${escape(tresc)}</div>
    </div>`;

  try {
    const odp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${klucz}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: odKogo,
        to: [doKogo],
        reply_to: email.trim(),
        subject: `Formularz: ${temat || 'zapytanie'} — ${imie}`,
        html,
      }),
    });
    if (!odp.ok) {
      console.error('Resend odrzucił wysyłkę:', odp.status, await odp.text());
      return res.status(502).json({ blad: 'Nie udało się wysłać wiadomości.' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Błąd wysyłki:', e);
    return res.status(502).json({ blad: 'Nie udało się wysłać wiadomości.' });
  }
}
