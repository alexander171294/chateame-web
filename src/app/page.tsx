import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

// La raíz redirige al locale por defecto. No dependemos del middleware de
// next-intl (que no corre en el Worker de OpenNext) para servir `/`.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
