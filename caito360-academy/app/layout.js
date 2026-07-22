import "./globals.css";

export const metadata = {
  title: "Caito360 AI Academy — Learn. Earn. Now.",
  description:
    "Free 2-month AI Automation training. Beginner to certified practitioner, then join Caito360's global consulting workforce under a profit-share model.",
  openGraph: {
    title: "Caito360 AI Academy — Learn. Earn. Now.",
    description: "Free 2-month AI Automation training. Beginner to practitioner.",
    type: "website",
  },
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
