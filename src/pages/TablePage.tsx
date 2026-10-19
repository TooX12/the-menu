import { useState } from 'react';
import { PACKAGES } from '@/config/packages';
import { restaurant } from '@/data/menu';
import { useLanguage } from '@/i18n/LanguageContext';
import { href } from '@/router';
import { menuUrl } from '@/lib/ticket';
import { QrCode } from '@/components/QrCode';
import type { PackageId } from '@/types';

const COPY = {
  title: { es: 'Código de mesa', en: 'Table card', fr: 'Carton de table' },
  instruction: {
    es: 'Escanee para ver la carta',
    en: 'Scan to see the menu',
    fr: 'Scannez pour voir la carte',
  },
  tableNumber: { es: 'Número de mesa', en: 'Table number', fr: 'Numéro de table' },
  printHint: {
    es: 'Imprima esta página (⌘P / Ctrl+P) y dóblela por la mitad: un carton por mesa.',
    en: 'Print this page (⌘P / Ctrl+P) and fold it in half: one card per table.',
    fr: 'Imprimez cette page (⌘P / Ctrl+P) et pliez-la en deux : un carton par table.',
  },
  linkLabel: { es: 'La carta abre en', en: 'The menu opens at', fr: 'La carte s’ouvre sur' },
  back: { es: '← Volver a los paquetes', en: '← Back to the packages', fr: '← Retour aux forfaits' },
} as const;

/** What the restaurant prints and stands on the table. */
export function TablePage({ packageId }: { packageId: PackageId }) {
  const { t } = useLanguage();
  const [table, setTable] = useState('12');
  const pack = PACKAGES[packageId];
  const url = menuUrl(packageId, table || '1');

  return (
    <div className="tablepage">
      <div className="demobar">
        <a className="demobar__back" href={href('/')}>
          {t(COPY.back)}
        </a>
        <span className="demobar__tag">
          {pack.numeral} · {t(pack.name)}
        </span>
      </div>

      <div className="tent">
        <p className="tent__est">Est. 1974</p>
        <h1 className="tent__name">{restaurant.name}</h1>
        <div className="tent__rule" aria-hidden="true">
          <span />❧<span />
        </div>
        <QrCode value={url} size={248} title={t(COPY.instruction)} />
        <p className="tent__instruction">{t(COPY.instruction)}</p>
        <p className="tent__table">{table || '1'}</p>
      </div>

      <div className="tablepage__controls">
        <label className="field">
          <span>{t(COPY.tableNumber)}</span>
          <input
            id="table-number"
            value={table}
            inputMode="numeric"
            maxLength={4}
            onChange={(event) => setTable(event.target.value.replace(/[^\w-]/g, ''))}
          />
        </label>
        <p className="tablepage__url">
          <span>{t(COPY.linkLabel)}</span>
          <code>{url}</code>
        </p>
        <p className="tablepage__hint">{t(COPY.printHint)}</p>
      </div>
    </div>
  );
}
