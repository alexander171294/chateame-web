import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es-AR', 'es', 'en', 'pt-BR'],
  defaultLocale: 'es-AR',
  localePrefix: 'as-needed',
});
