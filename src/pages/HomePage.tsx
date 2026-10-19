import { PACKAGES, PACKAGE_ORDER } from '@/config/packages';
import { restaurant } from '@/data/menu';
import { useLanguage } from '@/i18n/LanguageContext';
import { UI } from '@/i18n/strings';
import { href } from '@/router';
import { LanguageMenu } from '@/components/LanguageMenu';
import { QrCode } from '@/components/QrCode';
import { menuUrl } from '@/lib/ticket';

const COPY = {
  lede: {
    es: 'Un código en la mesa, la carta de siempre en el teléfono del comensal. Elija hasta dónde quiere llegar.',
    en: 'A code on the table, the menu you already print on your guest’s phone. Choose how far you want to go.',
    fr: 'Un code sur la table, la carte habituelle sur le téléphone du client. Choisissez jusqu’où aller.',
  },
  openDemo: {
    es: 'Abrir la demostración',
    en: 'Open the demo',
    fr: 'Ouvrir la démonstration',
  },
  seeTent: { es: 'Ver el código de mesa', en: 'See the table card', fr: 'Voir le carton de table' },
  perMonth: { es: '/ mes por sucursal', en: '/ month per venue', fr: '/ mois par établissement' },
  demoNote: {
    es: 'Las tres demostraciones usan la misma carta de {name}. Cambie el idioma aquí o dentro de la carta.',
    en: 'All three demos use the same menu from {name}. Switch language here or inside the menu.',
    fr: 'Les trois démonstrations utilisent la carte de {name}. Changez de langue ici ou dans la carte.',
  },
  tableLabel: { es: 'Mesa 12', en: 'Table 12', fr: 'Table 12' },
  scanHint: {
    es: 'Este código abre el paquete III en la mesa 12.',
    en: 'This code opens package III at table 12.',
    fr: 'Ce code ouvre le forfait III à la table 12.',
  },
} as const;

export function HomePage() {
  const { t, money } = useLanguage();

  return (
    <div className="home">
      <header className="home__head">
        <div className="home__brand">
          <span className="home__mark" aria-hidden="true">
            ❧
          </span>
          <h1>The Menu</h1>
        </div>
        <LanguageMenu />
      </header>

      <section className="home__hero">
        <p className="home__lede">{t(COPY.lede)}</p>
        <div className="home__tent">
          <QrCode value={menuUrl('servicio', '12')} size={132} title="QR" />
          <div>
            <p className="home__tentlabel">{t(COPY.tableLabel)}</p>
            <p className="home__tenthint">{t(COPY.scanHint)}</p>
          </div>
        </div>
      </section>

      <ol className="packages">
        {PACKAGE_ORDER.map((id) => {
          const pack = PACKAGES[id];
          return (
            <li key={id} className={`pack pack--${id}`}>
              <header className="pack__head">
                <span className="pack__numeral" aria-hidden="true">
                  {pack.numeral}
                </span>
                <h2 className="pack__name">{t(pack.name)}</h2>
                <p className="pack__price">
                  <strong>{money(pack.pricePerMonth)}</strong>
                  <span>{t(COPY.perMonth)}</span>
                </p>
              </header>

              <p className="pack__blurb">{t(pack.blurb)}</p>

              <ul className="pack__features">
                {pack.features.map((feature) => (
                  <li key={feature.en}>{t(feature)}</li>
                ))}
              </ul>

              <div className="pack__actions">
                <a className="btn btn--primary" href={href(`/menu/${id}?table=12`)}>
                  {t(COPY.openDemo)}
                </a>
                <a className="linkbtn" href={href(`/table/${id}`)}>
                  {t(COPY.seeTent)}
                </a>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="home__foot">
        <p>{t(COPY.demoNote, { name: restaurant.name })}</p>
        <p className="home__fineprint">{t(UI.menuFooter)}</p>
      </footer>
    </div>
  );
}
