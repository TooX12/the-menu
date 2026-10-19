import type { Language, Order, OrderLine } from '@/types';

/**
 * The string a waiter's scanner reads. It is deliberately short and
 * human-inspectable rather than JSON: a QR with a 200-byte payload is
 * still a small, high-contrast grid that scans in poor restaurant light.
 *
 * Shape:  TM1|<code>|<table>|<lang>|<line>;<line>;…
 * Line:   <itemId>*<qty>[:<group>=<choice>,<choice>][#<note>]
 */
export const TICKET_PREFIX = 'TM1';

function encodeLine(line: OrderLine): string {
  const parts = [`${line.itemId}*${line.quantity}`];
  const options = line.options
    .filter((entry) => entry.choiceIds.length > 0)
    .map((entry) => `${entry.groupId}=${entry.choiceIds.join(',')}`)
    .join('+');
  if (options) parts.push(`:${options}`);
  if (line.note) parts.push(`#${line.note.replace(/[;|#]/g, ' ').slice(0, 60)}`);
  return parts.join('');
}

/** Serialise an order into the ticket payload embedded in the QR. */
export function encodeTicket(order: Order, language: Language): string {
  const lines = order.lines.map(encodeLine).join(';');
  return [TICKET_PREFIX, order.code, order.table, language, lines].join('|');
}

/**
 * The counterpart the till would run. It lives here so the format has one
 * definition, and so the demo can show a parsed ticket next to the code.
 */
export interface ParsedTicket {
  code: string;
  table: string;
  language: string;
  lines: Array<{
    itemId: string;
    quantity: number;
    options: Array<{ groupId: string; choiceIds: string[] }>;
    note?: string;
  }>;
}

export function parseTicket(payload: string): ParsedTicket | null {
  const [prefix, code, table, language, body] = payload.split('|');
  if (prefix !== TICKET_PREFIX || !code || !table || !language) return null;

  const lines: ParsedTicket['lines'] = [];
  for (const raw of (body ?? '').split(';').filter(Boolean)) {
    const [beforeNote, note] = raw.split('#');
    const [head, optionPart] = (beforeNote ?? '').split(':');
    const [itemId, quantity] = (head ?? '').split('*');
    if (!itemId) continue;
    const options = (optionPart ?? '')
      .split('+')
      .filter(Boolean)
      .map((group) => {
        const [groupId, choices] = group.split('=');
        return { groupId: groupId ?? '', choiceIds: (choices ?? '').split(',').filter(Boolean) };
      });
    lines.push({
      itemId,
      quantity: Number(quantity ?? '1') || 1,
      options,
      ...(note ? { note } : {}),
    });
  }
  return { code, table, language, lines };
}

/** The URL printed on the table tent for a given package and table. */
export function menuUrl(packageId: string, table: string): string {
  const base =
    typeof window === 'undefined'
      ? 'https://themenu.app/'
      : `${window.location.origin}${window.location.pathname}`;
  return `${base}#/menu/${packageId}?table=${encodeURIComponent(table)}`;
}
