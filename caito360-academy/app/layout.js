import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://caito-academy.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Caito360 AI Academy — Learn. Earn. Now.",
  description:
    "Free 2-month AI Automation training. Go from beginner to working AI Automation Practitioner, then earn with Caito360's global consulting workforce under a profit-share model.",
  alternates: { canonical: "/" },
  keywords: [
    "AI Academy", "free AI training", "AI automation practitioner",
    "learn AI", "AI career", "Caito360",
  ],
  openGraph: {
    title: "Caito360 AI Academy — Learn. Earn. Now.",
    description: "Free 2-month AI Automation training. Beginner to practitioner.",
    url: "/",
    siteName: "Caito360 AI Academy",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#070E1F",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
