import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const SITE_URL = 'https://minibox.ar';
const LAST_MODIFIED = '2026-06-27';

// Sólo páginas públicas (las autenticadas no se indexan).
const PUBLIC_PATHS = ['', '/connect', '/privacy', '/terms', '/data-deletion'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PUBLIC_PATHS) {
    const languages = Object.fromEntries(
      routing.locales.map((loc) => [loc, `${SITE_URL}/${loc}${path}`]),
    );

    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
