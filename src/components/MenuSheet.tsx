import { useEffect, useRef, useState } from 'react';
import { restaurant } from '@/data/menu';
import { useLanguage } from '@/i18n/LanguageContext';
import { UI } from '@/i18n/strings';
import type { MenuItem } from '@/types';
import { MenuItemRow } from './MenuItemRow';
import { LanguageMenu } from './LanguageMenu';

interface MenuSheetProps {
  table: string;
  selectable: boolean;
  /** Quantity on the order, per dish id. */
  chosen: Map<string, number>;
  onSelect: (item: MenuItem) => void;
}

/** The menu itself: the part every package shares. */
export function MenuSheet({ table, selectable, chosen, onSelect }: MenuSheetProps) {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState(restaurant.sections[0]!.id);
  const sectionRefs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    for (const node of sectionRefs.current.values()) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const goTo = (id: string) => {
    sectionRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <article className="sheet">
      <header className="sheet__head">
        <p className="sheet__est">Est. 1974</p>
        <h1 className="sheet__name">{restaurant.name}</h1>
        <p className="sheet__tagline">{t(restaurant.tagline)}</p>
        <div className="sheet__rule" aria-hidden="true">
          <span />❧<span />
        </div>
        <p className="sheet__table">
          {t(UI.table)} {table}
        </p>
        <LanguageMenu />
      </header>

      <nav className="sections" aria-label={restaurant.name}>
        {restaurant.sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`sections__item${section.id === activeSection ? ' is-active' : ''}`}
            onClick={() => goTo(section.id)}
          >
            {t(section.title)}
          </button>
        ))}
      </nav>

      {restaurant.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="course"
          ref={(node) => {
            if (node) sectionRefs.current.set(section.id, node);
            else sectionRefs.current.delete(section.id);
          }}
        >
          <h2 className="course__title">{t(section.title)}</h2>
          {section.note ? <p className="course__note">{t(section.note)}</p> : null}
          <ul className="course__list">
            {section.items.map((item) => (
              <MenuItemRow
                key={item.id}
                item={item}
                selectable={selectable}
                inOrder={chosen.get(item.id) ?? 0}
                onSelect={onSelect}
              />
            ))}
          </ul>
        </section>
      ))}

      <footer className="sheet__foot">
        <div className="sheet__rule" aria-hidden="true">
          <span />❧<span />
        </div>
        <p>{t(UI.menuFooter)}</p>
        <p className="sheet__address">{t(restaurant.address)}</p>
      </footer>
    </article>
  );
}
