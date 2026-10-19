/** Languages the printed menu is offered in. */
export type Language = 'es' | 'en' | 'fr';

export const LANGUAGES: readonly Language[] = ['es', 'en', 'fr'] as const;

/** A string that exists in every supported language. */
export type Localized = Record<Language, string>;

/** Dietary / kitchen markers printed next to a dish. */
export type DishTag = 'vegetarian' | 'vegan' | 'spicy' | 'glutenFree' | 'signature';

/** One selectable choice inside an option group (e.g. "medium rare"). */
export interface OptionChoice {
  id: string;
  label: Localized;
  /** Added to the line price, in minor-unit-free pesos. 0 when free. */
  priceDelta?: number;
}

/**
 * A question the kitchen needs answered before cooking the dish.
 * `single` renders as radio buttons, `multi` as checkboxes.
 */
export interface OptionGroup {
  id: string;
  label: Localized;
  type: 'single' | 'multi';
  /** A required single-choice group is pre-filled with its first choice. */
  required?: boolean;
  /** Upper bound for `multi` groups. Ignored for `single`. */
  max?: number;
  choices: OptionChoice[];
}

export interface MenuItem {
  id: string;
  name: Localized;
  description: Localized;
  price: number;
  tags?: DishTag[];
  options?: OptionGroup[];
}

export interface MenuSection {
  id: string;
  title: Localized;
  /** Printed under the section rule, in italics. */
  note?: Localized;
  items: MenuItem[];
}

export interface Restaurant {
  name: string;
  tagline: Localized;
  address: Localized;
  currency: string;
  locale: Record<Language, string>;
  sections: MenuSection[];
}

/* ------------------------------------------------------------------ */
/* Packages                                                            */
/* ------------------------------------------------------------------ */

/** The three commercial packages, in ascending order. */
export type PackageId = 'carta' | 'orden' | 'servicio';

export interface PackageCapabilities {
  /** Guests can read the menu and switch language. Always true. */
  menu: true;
  /** Guests can build an order and hand it to the waiter. */
  ordering: boolean;
  /** Guests can call the waiter from their phone. */
  callWaiter: boolean;
}

export interface PackageDefinition {
  id: PackageId;
  /** Roman numeral shown on the package card. */
  numeral: string;
  name: Localized;
  blurb: Localized;
  /** Monthly price per venue, for the sales page. */
  pricePerMonth: number;
  features: Localized[];
  capabilities: PackageCapabilities;
}

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

/** A resolved choice on an order line, kept flat so it serialises small. */
export interface SelectedOption {
  groupId: string;
  choiceIds: string[];
}

export interface OrderLine {
  /** Unique per line — the same dish can appear twice with different options. */
  lineId: string;
  itemId: string;
  quantity: number;
  options: SelectedOption[];
  /** Free text the guest types for the kitchen. */
  note?: string;
  /** Price of one unit including option surcharges. */
  unitPrice: number;
}

export type OrderStatus = 'building' | 'ready' | 'handed-over';

export interface Order {
  /** Short human-readable code, also embedded in the QR. */
  code: string;
  table: string;
  lines: OrderLine[];
  status: OrderStatus;
  /** Epoch ms of the moment the guest marked the order ready. */
  readyAt?: number;
}

/* ------------------------------------------------------------------ */
/* Service calls                                                       */
/* ------------------------------------------------------------------ */

export type ServiceRequestKind = 'waiter' | 'water' | 'bill';

export interface ServiceRequest {
  id: string;
  kind: ServiceRequestKind;
  table: string;
  createdAt: number;
  acknowledgedAt?: number;
}
