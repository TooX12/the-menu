import { itemsById } from '@/data/menu';
import type { Language, MenuItem, OrderLine, SelectedOption } from '@/types';

/** Price of one unit of a dish once its chosen options are added on. */
export function unitPriceFor(item: MenuItem, options: SelectedOption[]): number {
  let price = item.price;
  for (const group of item.options ?? []) {
    const selected = options.find((entry) => entry.groupId === group.id);
    if (!selected) continue;
    for (const choiceId of selected.choiceIds) {
      const choice = group.choices.find((candidate) => candidate.id === choiceId);
      price += choice?.priceDelta ?? 0;
    }
  }
  return price;
}

/** Required single-choice groups start on their first choice, as on paper. */
export function defaultOptionsFor(item: MenuItem): SelectedOption[] {
  const defaults: SelectedOption[] = [];
  for (const group of item.options ?? []) {
    const first = group.choices[0];
    if (group.type === 'single' && group.required && first) {
      defaults.push({ groupId: group.id, choiceIds: [first.id] });
    }
  }
  return defaults;
}

/** Human-readable summary of the chosen options, e.g. "Medium rare · Corn". */
export function describeOptions(
  item: MenuItem,
  options: SelectedOption[],
  language: Language,
): string[] {
  const parts: string[] = [];
  for (const group of item.options ?? []) {
    const selected = options.find((entry) => entry.groupId === group.id);
    if (!selected || selected.choiceIds.length === 0) continue;
    for (const choiceId of selected.choiceIds) {
      const choice = group.choices.find((candidate) => candidate.id === choiceId);
      if (choice) parts.push(choice.label[language]);
    }
  }
  return parts;
}

export function lineTotal(line: OrderLine): number {
  return line.unitPrice * line.quantity;
}

export function orderTotal(lines: readonly OrderLine[]): number {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

export function orderItemCount(lines: readonly OrderLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/**
 * Two lines are the same line when they are the same dish with the same
 * options and the same note — then we bump the quantity instead of adding
 * a second row, which is what a waiter would write down.
 */
export function sameConfiguration(a: OrderLine, b: Omit<OrderLine, 'lineId' | 'quantity'>): boolean {
  if (a.itemId !== b.itemId) return false;
  if ((a.note ?? '') !== (b.note ?? '')) return false;
  const key = (options: SelectedOption[]) =>
    options
      .map((entry) => `${entry.groupId}:${[...entry.choiceIds].sort().join(',')}`)
      .sort()
      .join('|');
  return key(a.options) === key(b.options);
}

export function resolveItem(itemId: string): MenuItem | undefined {
  return itemsById.get(itemId);
}

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Short ticket code — no look-alike characters, so it can be read aloud. */
export function makeTicketCode(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const code = Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join('');
  return `${code.slice(0, 3)}-${code.slice(3)}`;
}
