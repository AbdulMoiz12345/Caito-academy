import { Resend } from "resend";

export const runtime = "nodejs"; // needs Node runtime for file buffers

const TO = process.env.TO_EMAIL || "Abdul.Moiz@caito360.ai";
// For quick testing you can use Resend's shared sender below.
// For production, verify caito360.ai in Resend and set FROM_EMAIL to e.g. "AI Academy <academy@caito360.ai>".
const FROM = process.env.FROM_EMAIL || "Caito360 AI Academy <onboarding@resend.dev>";

const MAX_FILE = 8 * 1024 * 1024; // 8 MB

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
      return Response.json({ ok: false, error: "Resume is too large (max 8 MB)." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      // Clear, honest error so you know exactly what to configure.
      return Response.json(
        { ok: false, error: "Email is not configured yet. Add RESEND_API_KEY to .env.local (see README)." },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;color:#0C1730">
        <h2 style="margin:0 0 12px">New AI Academy Application</h2>
        <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
          <tr><td><b>Name</b></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><b>Email</b></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><b>Phone</b></td><td>${escapeHtml(phone) || "—"}</td></tr>
          <tr><td><b>Location</b></td><td>${escapeHtml(location) || "—"}</td></tr>
          <tr><td valign="top"><b>Why AI?</b></td><td>${escapeHtml(motivation) || "—"}</td></tr>
        </table>
        <p style="color:#64748b;font-size:12px;margin-top:16px">Resume attached: ${escapeHtml(file.name)}</p>
      </div>`;

    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `New Caito360 AI Academy Application — ${name}`,
      html,
      attachments: [{ filename: file.name || "resume", content: buffer }],
    });

    if (error) {
      return Response.json({ ok: false, error: error.message || "Email provider error." }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: "Server error. Please try again." }, { status: 500 });
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
