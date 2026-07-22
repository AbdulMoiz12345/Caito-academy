const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://caito-academy.vercel.app";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
