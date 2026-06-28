import type { MetadataRoute } from 'next';

const SITE_URL = 'https://minibox.ar';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Páginas de la app (requieren sesión) — no aportan a SEO.
      disallow: ['/*/onboarding', '/*/conversations', '/*/knowledge-base', '/*/billing'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
