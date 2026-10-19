import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { LANGUAGES, type Language, type Localized } from '@/types';
import { fill } from './strings';
import { restaurant } from '@/data/menu';

interface LanguageValue {
  language: Language;
  setLanguage: (language: Language) => void;
  /** Resolve a localized string in the current language. */
  t: (entry: Localized, values?: Record<string, string | number>) => string;
  /** Format a price in the restaurant's currency, in the current locale. */
  money: (amount: number) => string;
}

const LanguageContext = createContext<LanguageValue | null>(null);

const STORAGE_KEY = 'the-menu:language';

function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

/** Best first guess: a saved choice, then the phone's own language, then Spanish. */
function detectLanguage(): Language {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(saved)) return saved;
  } catch {
    /* Private browsing: fall through to the browser's language. */
  }
  for (const candidate of navigator.languages ?? []) {
    const base = candidate.slice(0, 2).toLowerCase();
    if (isLanguage(base)) return base;
  }
  return 'es';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    document.documentElement.lang = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Nothing to do — the choice simply won't survive a reload. */
    }
  }, []);

  const value = useMemo<LanguageValue>(() => {
    const formatter = new Intl.NumberFormat(restaurant.locale[language], {
      style: 'currency',
      currency: restaurant.currency,
      maximumFractionDigits: 0,
    });
    return {
      language,
      setLanguage,
      t: (entry, values) => (values ? fill(entry[language], values) : entry[language]),
      money: (amount) => formatter.format(amount),
    };
  }, [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return value;
}
