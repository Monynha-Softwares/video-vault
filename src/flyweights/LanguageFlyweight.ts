export type LanguageFlyweight = Readonly<{
  code: string;
  label: string;
}>;

const languageRegistry = Object.freeze({
  pt: Object.freeze({ code: 'pt', label: 'PT' }),
  en: Object.freeze({ code: 'en', label: 'EN' }),
  es: Object.freeze({ code: 'es', label: 'ES' }),
  fr: Object.freeze({ code: 'fr', label: 'FR' }),
  other: Object.freeze({ code: 'other', label: 'OTHER' }),
});

export type LanguageCode = keyof typeof languageRegistry;

const languageCache = new Map<string, LanguageFlyweight>();

export const DEFAULT_LANGUAGE: LanguageCode = 'pt';

const supportedLanguageCodes: LanguageCode[] = ['pt', 'en', 'es', 'fr'];

export function getLanguage(code: string): LanguageFlyweight {
  const cached = languageCache.get(code);
  if (cached) {
    return cached;
  }
  const resolved = languageRegistry[code as LanguageCode] ?? languageRegistry[DEFAULT_LANGUAGE];
  languageCache.set(code, resolved);
  return resolved;
}

export function getSupportedLanguages(): LanguageFlyweight[] {
  return supportedLanguageCodes.map((code) => getLanguage(code));
}

export function resetLanguageFlyweights() {
  languageCache.clear();
}
