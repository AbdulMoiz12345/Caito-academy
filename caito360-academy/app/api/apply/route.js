export const runtime = "nodejs"; // needs Node runtime for file buffers

const TENANT = process.env.MS_TENANT_ID;
const CLIENT_ID = process.env.MS_CLIENT_ID;
const CLIENT_SECRET = process.env.MS_CLIENT_SECRET;
// Mailbox the message is SENT FROM (must be a real mailbox in your tenant),
// e.g. no-reply@caito360.ai or salman.ansari@caito360.ai
const SENDER = process.env.MS_SENDER || "no-reply@caito360.ai";
// Where applications are delivered
const TO = process.env.TO_EMAIL || "academy@caito360.ai";

// Graph "sendMail" sends the file inline as base64. Keep attachments under ~3 MB;
// larger files need an upload session (see README note).
const MAX_FILE = 3 * 1024 * 1024;

async function getGraphToken() {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });
  const res = await fetch(
    `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.error_description || "Could not get Microsoft token.");
  return json.access_token;
}

export async function POST(request) {
  try {
    const form = await request.formData();

    // honeypot — silently accept bots without sending
    if (form.get("_honey")) return Response.json({ ok: true });

    const name = (form.get("Name") || "").toString().trim();
    const email = (form.get("Email") || "").toString().trim();
    const phone = (form.get("Phone") || "").toString().trim();
    const location = (form.get("Location") || "").toString().trim();
    const motivation = (form.get("Motivation") || "").toString().trim();
    const file = form.get("attachment");

    if (!name || !email) {
      return Response.json({ ok: false, error: "Name and email are required." }, { status: 400 });
    }
    if (!file || typeof file === "string") {
      return Response.json({ ok: false, error: "Please attach your resume." }, { status: 400 });
    }
    if (file.size > MAX_FILE) {
      return Response.json({ ok: false, error: "Resume is too large (max 3 MB)." }, { status: 400 });
    }

    if (!TENANT || !CLIENT_ID || !CLIENT_SECRET) {
      return Response.json(
        { ok: false, error: "Email is not configured yet. Add MS_TENANT_ID, MS_CLIENT_ID and MS_CLIENT_SECRET to .env.local (see README)." },
        { status: 500 }
      );
    }

    const contentBytes = Buffer.from(await file.arrayBuffer()).toString("base64");

    const html = `
      <div style="font-family:Arial,sans-serif;color:#0C1730">
        <h2 style="margin:0 0 12px">New AI Academy Application</h2>
        <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
          <tr><td><b>Name</b></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><b>Email</b></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><b>Phone</b></td><td>${escapeHtml(phone) || "&mdash;"}</td></tr>
          <tr><td><b>Location</b></td><td>${escapeHtml(location) || "&mdash;"}</td></tr>
          <tr><td valign="top"><b>Why AI?</b></td><td>${escapeHtml(motivation) || "&mdash;"}</td></tr>
        </table>
        <p style="color:#64748b;font-size:12px;margin-top:16px">Resume attached: ${escapeHtml(file.name)}</p>
      </div>`;

    const message = {
      message: {
        subject: `New Caito360 AI Academy Application — ${name}`,
        body: { contentType: "HTML", content: html },
        toRecipients: [{ emailAddress: { address: TO } }],
        replyTo: [{ emailAddress: { address: email } }],
        attachments: [
          {
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: file.name || "resume",
            contentType: file.type || "application/octet-stream",
            contentBytes,
          },
        ],
      },
      saveToSentItems: false,
    };

    const token = await getGraphToken();
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(SENDER)}/sendMail`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(message),
      }
    );

    // Graph returns 202 Accepted with an empty body on success
    if (res.status !== 202) {
      const detail = await res.json().catch(() => ({}));
      return Response.json(
        { ok: false, error: detail?.error?.message || `Microsoft Graph error (${res.status}).` },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: err.message || "Server error. Please try again." }, { status: 500 });
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
