import type { PackageDefinition, PackageId } from '@/types';

/**
 * The three packages sold to venues. Each one is a superset of the previous,
 * so the app renders a single menu and switches features on from here —
 * there is no second codebase per tier.
 */
export const PACKAGES: Record<PackageId, PackageDefinition> = {
  carta: {
    id: 'carta',
    numeral: 'I',
    name: { es: 'Carta', en: 'Carta', fr: 'Carta' },
    blurb: {
      es: 'La carta de siempre, en el teléfono del comensal. Un código QR en la mesa y nada más que mantener.',
      en: 'The same menu you print, on your guest’s phone. One QR on the table and nothing else to maintain.',
      fr: 'La carte habituelle, sur le téléphone du client. Un QR sur la table, rien d’autre à gérer.',
    },
    pricePerMonth: 390,
    features: [
      {
        es: 'Carta completa por secciones, con el diseño del papel',
        en: 'Full menu by section, with the look of the printed card',
        fr: 'Carte complète par sections, avec l’allure du papier',
      },
      {
        es: 'Tres idiomas: español, inglés y francés',
        en: 'Three languages: Spanish, English and French',
        fr: 'Trois langues : espagnol, anglais et français',
      },
      {
        es: 'Código QR listo para imprimir, por mesa',
        en: 'Print-ready QR code, one per table',
        fr: 'QR prêt à imprimer, un par table',
      },
      {
        es: 'Cambios de precio el mismo día, sin reimprimir',
        en: 'Same-day price changes, no reprinting',
        fr: 'Changements de prix le jour même, sans réimpression',
      },
    ],
    capabilities: { menu: true, ordering: false, callWaiter: false },
  },

  orden: {
    id: 'orden',
    numeral: 'II',
    name: { es: 'Carta y Orden', en: 'Carta & Order', fr: 'Carta & Commande' },
    blurb: {
      es: 'El comensal arma su orden con sus términos y modificaciones. El mesero la levanta escaneando un código: ya no hay que dictarla.',
      en: 'Guests build the order themselves, cooking preferences and all. The waiter picks it up by scanning one code — nothing is dictated twice.',
      fr: 'Le client compose sa commande, cuissons et modifications comprises. Le serveur la récupère en scannant un code.',
    },
    pricePerMonth: 890,
    features: [
      {
        es: 'Todo lo del paquete I',
        en: 'Everything in package I',
        fr: 'Tout le paquet I',
      },
      {
        es: 'Selección de platillos con términos, extras y notas',
        en: 'Dish selection with doneness, extras and notes',
        fr: 'Sélection des plats avec cuisson, suppléments et notes',
      },
      {
        es: 'La orden viaja en un código QR que el mesero escanea',
        en: 'The order travels in a QR code the waiter scans',
        fr: 'La commande voyage dans un QR que le serveur scanne',
      },
      {
        es: 'Total estimado a la vista antes de ordenar',
        en: 'Running total visible before ordering',
        fr: 'Total estimé visible avant de commander',
      },
    ],
    capabilities: { menu: true, ordering: true, callWaiter: false },
  },

  servicio: {
    id: 'servicio',
    numeral: 'III',
    name: { es: 'Carta, Orden y Servicio', en: 'Carta, Order & Service', fr: 'Carta, Commande & Service' },
    blurb: {
      es: 'Además de ordenar, el comensal puede llamar al mesero desde su mesa. Un botón, una confirmación y el aviso llega a la barra.',
      en: 'On top of ordering, guests can call the waiter from the table. One button, one confirmation, and the pass hears about it.',
      fr: 'En plus de commander, le client peut appeler le serveur depuis la table. Un bouton, une confirmation, et le passe est prévenu.',
    },
    pricePerMonth: 1290,
    features: [
      {
        es: 'Todo lo del paquete II',
        en: 'Everything in package II',
        fr: 'Tout le paquet II',
      },
      {
        es: 'Botón para llamar al mesero, con confirmación',
        en: 'Call-the-waiter button, with a confirmation step',
        fr: 'Bouton pour appeler le serveur, avec confirmation',
      },
      {
        es: 'También: pedir la cuenta o más agua',
        en: 'Also: ask for the bill or more water',
        fr: 'Aussi : demander l’addition ou de l’eau',
      },
      {
        es: 'Aviso de recibido y espera entre llamadas',
        en: 'Acknowledgement, plus a cool-down between calls',
        fr: 'Accusé de réception et délai entre deux appels',
      },
    ],
    capabilities: { menu: true, ordering: true, callWaiter: true },
  },
};

export const PACKAGE_ORDER: readonly PackageId[] = ['carta', 'orden', 'servicio'] as const;

export function isPackageId(value: string): value is PackageId {
  return value === 'carta' || value === 'orden' || value === 'servicio';
}
