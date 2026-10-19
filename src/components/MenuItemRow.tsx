import { useLanguage } from '@/i18n/LanguageContext';
import { UI } from '@/i18n/strings';
import type { MenuItem } from '@/types';

interface MenuItemRowProps {
  item: MenuItem;
  /** Package I renders the dish as plain print; II and III make it tappable. */
  selectable: boolean;
  /** How many of this dish are already on the order, if any. */
  inOrder: number;
  onSelect: (item: MenuItem) => void;
}

export function MenuItemRow({ item, selectable, inOrder, onSelect }: MenuItemRowProps) {
  const { t, money } = useLanguage();

  const body = (
    <>
      <div className="dish__line">
        <span className="dish__name">
          {t(item.name)}
          {inOrder > 0 ? <span className="dish__count">×{inOrder}</span> : null}
        </span>
        <span className="dish__leader" aria-hidden="true" />
        {/* Price and marker travel together so the circle centres on the
            price's line instead of floating at a fixed offset. */}
        <span className="dish__tail">
          <span className="dish__price">{money(item.price)}</span>
          {selectable ? <span className="dish__cue" aria-hidden="true" /> : null}
        </span>
      </div>
      <p className="dish__description">{t(item.description)}</p>
      {item.tags?.length ? (
        <ul className="dish__tags">
          {item.tags.map((tag) => (
            <li key={tag} className={`tag tag--${tag}`}>
              {t(UI.tags[tag])}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );

  if (!selectable) {
    return <li className="dish">{body}</li>;
  }

  return (
    <li className={`dish dish--selectable${inOrder > 0 ? ' is-chosen' : ''}`}>
      <button type="button" className="dish__button" onClick={() => onSelect(item)}>
        {body}
      </button>
    </li>
  );
}
