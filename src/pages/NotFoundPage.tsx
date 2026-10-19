import { useLanguage } from '@/i18n/LanguageContext';
import { href } from '@/router';

const COPY = {
  title: { es: 'Esta página no está en la carta', en: 'This page is not on the menu', fr: 'Cette page n’est pas à la carte' },
  body: {
    es: 'El enlace que siguió no corresponde a ningún paquete.',
    en: 'The link you followed doesn’t match any package.',
    fr: 'Le lien suivi ne correspond à aucun forfait.',
  },
  back: { es: 'Ver los paquetes', en: 'See the packages', fr: 'Voir les forfaits' },
} as const;

export function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div className="notfound">
      <h1>{t(COPY.title)}</h1>
      <p>{t(COPY.body)}</p>
      <a className="btn btn--primary" href={href('/')}>
        {t(COPY.back)}
      </a>
    </div>
  );
}
