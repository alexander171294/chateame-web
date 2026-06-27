// Manual mock for next-intl — returns keys as-is so tests don't depend on locale strings.
// IMPORTANTE: el translator se cachea por namespace para devolver SIEMPRE la misma
// referencia de función. El next-intl real es estable; si devolviéramos una función
// nueva en cada render, componentes con useEffect(..., [t]) entrarían en loop infinito.
const translatorCache = new Map<string, (key: string) => string>();

export const useTranslations = (namespace?: string) => {
  const key = namespace ?? '__root__';
  if (!translatorCache.has(key)) {
    translatorCache.set(key, (k: string) => k);
  }
  return translatorCache.get(key)!;
};

export const useLocale = () => 'en';
export const useFormatter = () => ({});
export const useNow = () => new Date();
export const useTimeZone = () => 'UTC';
