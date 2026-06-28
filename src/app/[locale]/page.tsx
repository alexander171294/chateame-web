import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { LandingPage } from '@/components/landing/LandingPage';
import type { Metadata } from 'next';

const SITE_URL = 'https://minibox.ar';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Landing' });

  const localeAlternates = Object.fromEntries(
    routing.locales.map((loc) => [loc, `${SITE_URL}/${loc}`])
  );

  const title = t('metaTitle');
  const description = t('metaDescription');

  return {
    title,
    description,
    keywords: t('metaKeywords'),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: localeAlternates,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      siteName: 'Minibox',
      locale: locale.replace('-', '_'),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Landing' });
  const faqKeys = ['faq1', 'faq2', 'faq3', 'faq4', 'faq5', 'faq6'] as const;

  // Structured data (JSON-LD) para rich results: la app + FAQ + organización.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Minibox',
        url: SITE_URL,
        email: 'alexander171294@gmail.com',
        founder: { '@type': 'Person', name: 'Alexander Eberle' },
        areaServed: 'AR',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Minibox',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: `${SITE_URL}/${locale}`,
        description: t('metaDescription'),
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: t('heroNote'),
        },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqKeys.map((k) => ({
          '@type': 'Question',
          name: t(`${k}Q`),
          acceptedAnswer: { '@type': 'Answer', text: t(`${k}A`) },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
