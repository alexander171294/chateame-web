import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BillingView } from './BillingView';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function BillingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BillingView />;
}
