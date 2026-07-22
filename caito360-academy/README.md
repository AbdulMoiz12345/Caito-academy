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

**Yes — it sends through Microsoft Graph (app-only).** No email system can send
without authenticated credentials, so there is one setup step using your Azure
app registration.

1. Copy `.env.local.example` to `.env.local`
2. Fill in the three values from Azure plus the sender/recipient:

```
MS_TENANT_ID=your-tenant-id
MS_CLIENT_ID=your-application-client-id
MS_CLIENT_SECRET=your-client-secret-value
MS_SENDER=salman.ansari@caito360.ai
TO_EMAIL=salman.ansari@caito360.ai
```

3. Restart `npm run dev`. Submit the form → the application + resume land in the inbox.

Until the credentials are set, the form shows a clear message:
*"Email is not configured yet. Add MS_TENANT_ID…"* (so nothing fails silently).

### Azure app registration requirements
The app registration (Microsoft Entra ID → App registrations) must have:
- **API permission:** `Mail.Send` of type **Application** (not Delegated),
  with **admin consent granted**.
- **A client secret** (Certificates & secrets → New client secret). Copy the
  secret **Value** — not the Secret ID.
- **MS_SENDER** must be a real, licensed mailbox in the tenant. With app-only
  `Mail.Send`, the app can send as any mailbox unless your admin scoped it with
  an Application Access Policy — if sends fail with "Access denied", ask your
  admin to include `MS_SENDER` in that policy.

### How it works
`app/api/apply/route.js` does two calls with plain `fetch` (no SDK):
1. `POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token`
   (grant_type `client_credentials`, scope `https://graph.microsoft.com/.default`)
2. `POST https://graph.microsoft.com/v1.0/users/{MS_SENDER}/sendMail`
   with the resume as a base64 `fileAttachment`.

### Attachment size
Graph's direct `sendMail` sends the file inline, so keep resumes under **~3 MB**
(the route enforces this). Larger files require an upload session
(`createUploadSession`) — tell me if you need that added.

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
