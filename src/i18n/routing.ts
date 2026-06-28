import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es-AR', 'es', 'en', 'pt-BR'],
  defaultLocale: 'es-AR',
  // 'always': todos los locales llevan prefijo (incluido el default). Necesario
  // porque el middleware de next-intl no corre en el Worker de OpenNext, así que
  // las rutas sin prefijo no las resuelve nadie → hay que generarlas con prefijo.
  localePrefix: 'always',
});
