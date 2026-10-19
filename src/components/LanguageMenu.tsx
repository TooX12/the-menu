import { LANGUAGES } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { UI } from '@/i18n/strings';

/**
 * Language is part of package I, so it lives in the menu header rather than
 * behind a settings screen: a guest switches it in one tap and the whole
 * card is reprinted in that language.
 */
export function LanguageMenu() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="langs" role="group" aria-label={t(UI.language)}>
      {LANGUAGES.map((candidate) => (
        <button
          key={candidate}
          type="button"
          className={`langs__item${candidate === language ? ' is-current' : ''}`}
          aria-pressed={candidate === language}
          onClick={() => setLanguage(candidate)}
        >
          <span className="langs__code">{candidate.toUpperCase()}</span>
          <span className="langs__name">{t(UI.languageName[candidate])}</span>
        </button>
      ))}
    </div>
  );
}
