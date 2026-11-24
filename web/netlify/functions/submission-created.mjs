// Netlify runs a function with this exact name after every verified (non-spam)
// Netlify Forms submission. We use it to email the request through Resend.
//
// Netlify env vars:
//   RESEND_API_KEY      required
//   NOTIFY_EMAIL        optional, overrides the inbox (default: Site settings email in Sanity)
//   FROM_EMAIL          optional, default "Accession Builders <inspections@accessionbuilders.com>"
//   SEND_CONFIRMATION   optional, "false" turns off the homeowner's confirmation email

const FALLBACK = { phone: '(336) 745-8600', email: 'kerney@accessionbuilders.com' };
const FROM = process.env.FROM_EMAIL || 'Accession Builders <inspections@accessionbuilders.com>';

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const clean = (s = '') => String(s).replace(/[\r\n]+/g, ' ').trim();
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || '');

// Phone + inbox from Sanity Site settings, so edits in the Studio carry over.
async function siteSettings() {
  const id = process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
  if (!id) return FALLBACK;
  try {
    const q = encodeURIComponent('*[_id=="siteSettings"][0]{phone, email}');
    const res = await fetch(`https://${id}.apicdn.sanity.io/v2025-02-19/data/query/${dataset}?query=${q}`, {
      signal: AbortSignal.timeout(4000),
    });
    const { result } = await res.json();
    return { phone: result?.phone || FALLBACK.phone, email: result?.email || FALLBACK.email };
  } catch {
    return FALLBACK;
  }
}

async function send(body) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

const row = (label, value) =>
  value
    ? `<tr><td style="padding:6px 16px 6px 0;color:#6b6257;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#1e1b17">${value}</td></tr>`
    : '';

const wrap = (inner) => `<!doctype html><html><body style="margin:0;background:#f4efe6;padding:24px;font-family:Georgia,'Times New Roman',serif">
<div style="max-width:560px;margin:0 auto;background:#fffdf8;border:1px solid #e4dccd;padding:28px 32px;font-size:16px;line-height:1.5;color:#1e1b17">${inner}
<p style="margin:28px 0 0;font-size:13px;color:#8a7f70;font-family:Arial,sans-serif">Accession Builders · accessionbuilders.com</p></div></body></html>`;

export const handler = async (event) => {
  const { payload } = JSON.parse(event.body || '{}');
  if (payload?.form_name !== 'inspection') return { statusCode: 200, body: 'ignored' };
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set; skipping email.');
    return { statusCode: 200, body: 'no api key' };
  }

  const d = payload.data || {};
  const name = clean(d.name) || 'Someone';
  const email = isEmail(clean(d.email)) ? clean(d.email) : '';
  const settings = await siteSettings();
  const to = process.env.NOTIFY_EMAIL || settings.email;
  const tel = (p) => `<a href="tel:${esc(String(p).replace(/[^\d+]/g, ''))}" style="color:#8a6a3b">${esc(p)}</a>`;

  // 1. Request to Kerney. Hitting reply goes to the homeowner when they gave an email.
  const fields = [
    ['Request', clean(d.type)],
    ['Name', name],
    ['Phone', clean(d.phone)],
    ['Email', email],
    ['Town', clean(d.town)],
    ['Reach by', clean(d.contact_by)],
  ].filter(([, v]) => v);
  const htmlValue = (k, v) =>
    k === 'Phone' ? tel(v) : k === 'Email' ? `<a href="mailto:${esc(v)}" style="color:#8a6a3b">${esc(v)}</a>` : esc(v);
  await send({
    from: FROM,
    to: [to],
    ...(email && { reply_to: email }),
    subject: `New inspection request: ${name}${d.town ? ` (${clean(d.town)})` : ''}`,
    html: wrap(`<h1 style="font-weight:400;font-size:26px;margin:0 0 16px">New inspection request</h1>
<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px">${fields
      .map(([k, v]) => row(k, htmlValue(k, v)))
      .join('')}</table>
<p style="margin:20px 0 6px;font-family:Arial,sans-serif;font-size:13px;color:#6b6257;text-transform:uppercase;letter-spacing:.08em">What they wrote</p>
<p style="margin:0;white-space:pre-wrap">${esc(d.message || '')}</p>`),
    text: [...fields.map(([k, v]) => `${k}: ${v}`), '', d.message || ''].join('\n'),
  });

  // 2. Confirmation to the homeowner (only if they left an email).
  if (email && process.env.SEND_CONFIRMATION !== 'false') {
    const first = esc(name.split(' ')[0]);
    try {
      await send({
        from: FROM,
        to: [email],
        reply_to: to,
        subject: 'We got your request — Accession Builders',
        html: wrap(`<h1 style="font-weight:400;font-size:26px;margin:0 0 16px">Thanks, ${first}.</h1>
<p>We got your request for a free inspection. Kerney will reach out to set up a time to come take a look.</p>
<p>If anything changes or it's urgent, call or text ${tel(settings.phone)}, or just reply to this email.</p>
<p style="margin-top:24px">— Accession Builders</p>`),
        text: `Thanks, ${clean(name.split(' ')[0])}.\n\nWe got your request for a free inspection. Kerney will reach out to set up a time to come take a look.\n\nIf anything changes or it's urgent, call or text ${settings.phone}, or just reply to this email.\n\n— Accession Builders`,
      });
    } catch (err) {
      console.error('Confirmation email failed:', err.message); // Kerney's copy already went out.
    }
  }
  return { statusCode: 200, body: 'sent' };
};
