# Caito360 AI Academy — Landing Page (Next.js)

Marketing landing page + application form for the Caito360 AI Academy.
Built with **Next.js 14 (App Router)**. Applications (with the resume attached) are
emailed to `salman.ansari@caito360.ai` via a server API route.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Does the email actually work?

**Yes — once you add one email API key.** No email system can send without an
authenticated sender, so there is one short setup step:

1. Create a free account at https://resend.com
2. Copy `.env.local.example` to `.env.local`
3. Paste your key:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

4. Restart `npm run dev`. Submit the form → the application + resume land in the inbox.

Until the key is set, the form shows a clear message:
*"Email is not configured yet. Add RESEND_API_KEY…"* (so nothing fails silently).

### Sender address
- **Testing:** leave `FROM_EMAIL` unset — it uses Resend's shared test sender
  (`onboarding@resend.dev`). Emails go to your `TO_EMAIL`.
- **Production:** verify the `caito360.ai` domain in Resend (add the DNS records
  they give you), then set `FROM_EMAIL="Caito360 AI Academy <academy@caito360.ai>"`.

### Prefer SMTP instead of Resend?
Swap the provider in `app/api/apply/route.js` for Nodemailer:

```bash
npm install nodemailer
```

```js
import nodemailer from "nodemailer";
const t = nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});
await t.sendMail({
  from: process.env.FROM_EMAIL, to: process.env.TO_EMAIL,
  replyTo: email, subject: `New AI Academy Application — ${name}`,
  html, attachments: [{ filename: file.name, content: buffer }],
});
```

## Deploy

Easiest is **Vercel**:

1. Push this folder to a Git repo.
2. Import it at https://vercel.com/new
3. Add the env vars (`RESEND_API_KEY`, optionally `TO_EMAIL`, `FROM_EMAIL`) in
   Project → Settings → Environment Variables.
4. Deploy.

## What's interactive

Everything clickable does something:
- **Logo / footer logo** → scroll to top
- **Nav links & mobile menu** → smooth-scroll to each section (hamburger toggles on mobile)
- **All CTA buttons** ("Apply Now", "Learn More", "Start Your Application", "See the Program") → scroll to the right section
- **Resume upload** → shows the chosen filename
- **Submit** → real POST to `/api/apply` with loading spinner, success screen, and inline error messages
- **Photo carousel** → auto-scrolls, pauses on hover
- **Sections** → fade/slide in on scroll (respects reduced-motion)

## Structure

```
app/
  layout.js          fonts + metadata
  globals.css        all styling + design tokens
  page.js            the landing page (client component)
  api/apply/route.js email delivery endpoint
```

## Customizing
- **Colors:** edit the CSS variables at the top of `app/globals.css`
  (`--teal`, `--gold`, `--ink`, …). Swap these for Caito360's exact brand hex if you have them.
- **Copy / sections:** all in `app/page.js`.
- **Photos:** replace the Unsplash URLs in the `PHOTOS` array in `app/page.js`.
