import type { ReactNode } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { UI } from '@/i18n/strings';
import { useOrder } from '@/state/OrderContext';

interface OrderBarProps {
  onReview: () => void;
  /** Rendered to the left of the review button in package III. */
  slot?: ReactNode;
}

/** The only thing pinned to the bottom of the screen while reading. */
export function OrderBar({ onReview, slot }: OrderBarProps) {
  const { t, money } = useLanguage();
  const { count, total } = useOrder();

  if (count === 0 && !slot) return null;

  return (
    <div className="orderbar">
      <div className="orderbar__inner">
        {slot}
        {count > 0 ? (
          <button type="button" className="btn btn--primary orderbar__cta" onClick={onReview}>
            <span>
              {t(UI.reviewOrder)}
              <em>{t(UI.itemCount, { n: count })}</em>
            </span>
            <span className="btn__price">{money(total)}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
