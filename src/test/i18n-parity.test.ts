/**
 * i18n key parity test — asserts that all locale JSON files have the exact same
 * set of keys (no missing or extra translations).
 */
import { describe, it, expect } from 'vitest';
import esAR from '../../messages/es-AR.json';
import es from '../../messages/es.json';
import en from '../../messages/en.json';
import ptBR from '../../messages/pt-BR.json';

// Recursively collect all dot-notation keys from a nested object
function collectKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...collectKeys(v as Record<string, unknown>, full));
    } else {
      keys.push(full);
    }
  }
  return keys.sort();
}

const locales = {
  'es-AR': esAR as Record<string, unknown>,
  es: es as Record<string, unknown>,
  en: en as Record<string, unknown>,
  'pt-BR': ptBR as Record<string, unknown>,
};

describe('i18n key parity', () => {
  const allKeys: Record<string, string[]> = {};
  for (const [locale, messages] of Object.entries(locales)) {
    allKeys[locale] = collectKeys(messages);
  }

  const referenceLocale = 'es-AR';
  const referenceKeys = allKeys[referenceLocale];

  it('all locales have the same number of keys', () => {
    for (const [locale, keys] of Object.entries(allKeys)) {
      expect(keys.length, `${locale} has ${keys.length} keys, expected ${referenceKeys.length}`).toBe(
        referenceKeys.length
      );
    }
  });

  it('es has the same keys as es-AR', () => {
    const missing = referenceKeys.filter((k) => !allKeys['es'].includes(k));
    const extra = allKeys['es'].filter((k) => !referenceKeys.includes(k));
    expect(missing, `Keys missing in es: ${missing.join(', ')}`).toHaveLength(0);
    expect(extra, `Extra keys in es: ${extra.join(', ')}`).toHaveLength(0);
  });

  it('en has the same keys as es-AR', () => {
    const missing = referenceKeys.filter((k) => !allKeys['en'].includes(k));
    const extra = allKeys['en'].filter((k) => !referenceKeys.includes(k));
    expect(missing, `Keys missing in en: ${missing.join(', ')}`).toHaveLength(0);
    expect(extra, `Extra keys in en: ${extra.join(', ')}`).toHaveLength(0);
  });

  it('pt-BR has the same keys as es-AR', () => {
    const missing = referenceKeys.filter((k) => !allKeys['pt-BR'].includes(k));
    const extra = allKeys['pt-BR'].filter((k) => !referenceKeys.includes(k));
    expect(missing, `Keys missing in pt-BR: ${missing.join(', ')}`).toHaveLength(0);
    expect(extra, `Extra keys in pt-BR: ${extra.join(', ')}`).toHaveLength(0);
  });

  it('no locale has empty string values (catches accidentally blanked translations)', () => {
    for (const [locale, messages] of Object.entries(locales)) {
      const keys = collectKeys(messages);
      // Check each leaf value is a non-empty string
      for (const key of keys) {
        const parts = key.split('.');
        let val: unknown = messages;
        for (const p of parts) {
          val = (val as Record<string, unknown>)[p];
        }
        expect(
          typeof val === 'string' && val.trim().length > 0,
          `${locale}.${key} is empty or not a string`
        ).toBe(true);
      }
    }
  });
});
