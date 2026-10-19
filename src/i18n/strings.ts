import type { Language, Localized } from '@/types';

/** Every piece of chrome text in the app, in the three menu languages. */
export const UI = {
  languageName: {
    es: { es: 'Español', en: 'Spanish', fr: 'Espagnol' },
    en: { es: 'Inglés', en: 'English', fr: 'Anglais' },
    fr: { es: 'Francés', en: 'French', fr: 'Français' },
  },

  table: { es: 'Mesa', en: 'Table', fr: 'Table' },
  language: { es: 'Idioma', en: 'Language', fr: 'Langue' },
  close: { es: 'Cerrar', en: 'Close', fr: 'Fermer' },
  cancel: { es: 'Cancelar', en: 'Cancel', fr: 'Annuler' },
  back: { es: 'Volver', en: 'Back', fr: 'Retour' },
  done: { es: 'Listo', en: 'Done', fr: 'Terminé' },
  total: { es: 'Total', en: 'Total', fr: 'Total' },
  each: { es: 'c/u', en: 'each', fr: 'pièce' },
  remove: { es: 'Quitar', en: 'Remove', fr: 'Retirer' },
  quantity: { es: 'Cantidad', en: 'Quantity', fr: 'Quantité' },

  tags: {
    vegetarian: { es: 'Vegetariano', en: 'Vegetarian', fr: 'Végétarien' },
    vegan: { es: 'Vegano', en: 'Vegan', fr: 'Végan' },
    spicy: { es: 'Picante', en: 'Spicy', fr: 'Épicé' },
    glutenFree: { es: 'Sin gluten', en: 'Gluten free', fr: 'Sans gluten' },
    signature: { es: 'De la casa', en: 'House speciality', fr: 'Spécialité' },
  },

  /* Menu page ------------------------------------------------------- */
  menuFooter: {
    es: 'Los precios incluyen IVA. El servicio no está incluido.',
    en: 'Prices include tax. Service is not included.',
    fr: 'Prix TTC. Le service n’est pas inclus.',
  },
  addToOrder: { es: 'Agregar a la orden', en: 'Add to order', fr: 'Ajouter à la commande' },
  updateLine: { es: 'Actualizar', en: 'Update', fr: 'Mettre à jour' },
  notesLabel: {
    es: 'Nota para la cocina',
    en: 'Note for the kitchen',
    fr: 'Note pour la cuisine',
  },
  notesPlaceholder: {
    es: 'Sin cebolla, por favor…',
    en: 'No onion, please…',
    fr: 'Sans oignon, s’il vous plaît…',
  },
  optional: { es: 'opcional', en: 'optional', fr: 'facultatif' },
  chooseOne: { es: 'Elija una opción', en: 'Choose one', fr: 'Choisissez une option' },
  chooseUpTo: { es: 'Hasta {n}', en: 'Up to {n}', fr: 'Jusqu’à {n}' },

  /* Order ----------------------------------------------------------- */
  yourOrder: { es: 'Su orden', en: 'Your order', fr: 'Votre commande' },
  orderEmpty: {
    es: 'Todavía no ha elegido nada. Toque un platillo para agregarlo.',
    en: 'Nothing chosen yet. Tap a dish to add it.',
    fr: 'Rien de choisi pour l’instant. Touchez un plat pour l’ajouter.',
  },
  itemCount: { es: '{n} artículo(s)', en: '{n} item(s)', fr: '{n} article(s)' },
  reviewOrder: { es: 'Ver la orden', en: 'Review order', fr: 'Voir la commande' },
  handToWaiter: { es: 'Mostrar al mesero', en: 'Show to the waiter', fr: 'Montrer au serveur' },
  keepChoosing: { es: 'Seguir eligiendo', en: 'Keep choosing', fr: 'Continuer' },
  clearOrder: { es: 'Vaciar la orden', en: 'Clear the order', fr: 'Vider la commande' },
  clearOrderConfirm: {
    es: '¿Vaciar la orden y empezar de nuevo?',
    en: 'Clear the order and start again?',
    fr: 'Vider la commande et recommencer ?',
  },

  /* Ticket ---------------------------------------------------------- */
  ticketTitle: { es: 'Orden lista', en: 'Order ready', fr: 'Commande prête' },
  ticketHelp: {
    es: 'Muestre esta pantalla al mesero. Al escanearla, la orden entra tal como la eligió.',
    en: 'Show this screen to your waiter. One scan and the order goes in exactly as you chose it.',
    fr: 'Montrez cet écran au serveur. Un scan et la commande part telle que vous l’avez choisie.',
  },
  ticketCode: { es: 'Folio', en: 'Ticket', fr: 'Référence' },
  ticketNoScanner: {
    es: 'Si el mesero no trae lector, dicte el folio de arriba.',
    en: 'If the waiter has no scanner, read out the ticket number above.',
    fr: 'Si le serveur n’a pas de lecteur, dictez la référence ci-dessus.',
  },
  editOrder: { es: 'Modificar la orden', en: 'Edit the order', fr: 'Modifier la commande' },

  /* Service calls --------------------------------------------------- */
  callWaiter: { es: 'Llamar al mesero', en: 'Call the waiter', fr: 'Appeler le serveur' },
  serviceWhat: { es: '¿En qué podemos ayudarle?', en: 'How can we help?', fr: 'Comment pouvons-nous aider ?' },
  serviceKind: {
    waiter: { es: 'Llamar al mesero', en: 'Call the waiter', fr: 'Appeler le serveur' },
    water: { es: 'Más agua, por favor', en: 'More water, please', fr: 'De l’eau, s’il vous plaît' },
    bill: { es: 'La cuenta, por favor', en: 'The bill, please', fr: 'L’addition, s’il vous plaît' },
  },
  serviceConfirmTitle: { es: '¿Llamamos al mesero?', en: 'Call the waiter?', fr: 'Appeler le serveur ?' },
  serviceConfirmBody: {
    es: 'Avisaremos a la barra que la {table} necesita atención.',
    en: 'We’ll let the pass know that {table} needs attention.',
    fr: 'Nous préviendrons le passe que la {table} a besoin d’aide.',
  },
  serviceConfirmAction: { es: 'Sí, llamar', en: 'Yes, call', fr: 'Oui, appeler' },
  serviceSent: {
    es: 'El mesero viene en camino.',
    en: 'Your waiter is on the way.',
    fr: 'Le serveur arrive.',
  },
  serviceCooldown: {
    es: 'Puede volver a llamar en {s} s',
    en: 'You can call again in {s} s',
    fr: 'Vous pourrez rappeler dans {s} s',
  },

  /* Package banner -------------------------------------------------- */
  demoBanner: {
    es: 'Demostración · paquete {name}',
    en: 'Demo · package {name}',
    fr: 'Démonstration · forfait {name}',
  },
  backToPackages: { es: 'Ver los paquetes', en: 'See the packages', fr: 'Voir les forfaits' },
} as const satisfies Record<string, unknown>;

/** Replace {token} placeholders. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Narrow helper so components read `t(UI.total)` instead of `UI.total[lang]`. */
export function translate(entry: Localized, language: Language): string {
  return entry[language];
}
