import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { UI } from '@/i18n/strings';
import { defaultOptionsFor, unitPriceFor } from '@/lib/order';
import type { MenuItem, OrderLine, SelectedOption } from '@/types';
import { Modal } from './Modal';

interface ItemSheetProps {
  item: MenuItem | null;
  /** Present when the guest tapped an existing line to change it. */
  editing: OrderLine | null;
  onClose: () => void;
  onSubmit: (options: SelectedOption[], quantity: number, note: string) => void;
}

export function ItemSheet({ item, editing, onClose, onSubmit }: ItemSheetProps) {
  const { t, money } = useLanguage();
  const [options, setOptions] = useState<SelectedOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!item) return;
    setOptions(editing ? editing.options : defaultOptionsFor(item));
    setQuantity(editing ? editing.quantity : 1);
    setNote(editing?.note ?? '');
  }, [item, editing]);

  const unitPrice = useMemo(() => (item ? unitPriceFor(item, options) : 0), [item, options]);

  if (!item) return null;

  const choose = (groupId: string, choiceId: string, type: 'single' | 'multi', max?: number) => {
    setOptions((current) => {
      const existing = current.find((entry) => entry.groupId === groupId);
      if (type === 'single') {
        const next = current.filter((entry) => entry.groupId !== groupId);
        return [...next, { groupId, choiceIds: [choiceId] }];
      }
      const selected = existing?.choiceIds ?? [];
      const isOn = selected.includes(choiceId);
      let choiceIds = isOn ? selected.filter((id) => id !== choiceId) : [...selected, choiceId];
      if (max && choiceIds.length > max) choiceIds = choiceIds.slice(choiceIds.length - max);
      const rest = current.filter((entry) => entry.groupId !== groupId);
      return choiceIds.length > 0 ? [...rest, { groupId, choiceIds }] : rest;
    });
  };

  const isSelected = (groupId: string, choiceId: string) =>
    options.find((entry) => entry.groupId === groupId)?.choiceIds.includes(choiceId) ?? false;

  return (
    <Modal
      open
      onClose={onClose}
      title={t(item.name)}
      eyebrow={money(item.price)}
      footer={
        <div className="sheetfoot">
          <div className="stepper" role="group" aria-label={t(UI.quantity)}>
            <button type="button" onClick={() => setQuantity((n) => Math.max(1, n - 1))} aria-label="−">
              −
            </button>
            <span aria-live="polite">{quantity}</span>
            <button type="button" onClick={() => setQuantity((n) => Math.min(20, n + 1))} aria-label="+">
              +
            </button>
          </div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => onSubmit(options, quantity, note)}
          >
            {t(editing ? UI.updateLine : UI.addToOrder)}
            <span className="btn__price">{money(unitPrice * quantity)}</span>
          </button>
        </div>
      }
    >
      <p className="dishsheet__description">{t(item.description)}</p>

      {(item.options ?? []).map((group) => (
        <fieldset key={group.id} className="optgroup">
          <legend className="optgroup__legend">
            {t(group.label)}
            <span className="optgroup__hint">
              {group.type === 'single'
                ? t(UI.chooseOne)
                : group.max
                  ? t(UI.chooseUpTo, { n: group.max })
                  : t(UI.optional)}
            </span>
          </legend>
          <div className="optgroup__choices">
            {group.choices.map((choice) => {
              const selected = isSelected(group.id, choice.id);
              return (
                <label key={choice.id} className={`choice${selected ? ' is-on' : ''}`}>
                  <input
                    type={group.type === 'single' ? 'radio' : 'checkbox'}
                    name={`${item.id}-${group.id}`}
                    checked={selected}
                    onChange={() => choose(group.id, choice.id, group.type, group.max)}
                  />
                  <span className="choice__label">{t(choice.label)}</span>
                  {choice.priceDelta ? (
                    <span className="choice__delta">+{money(choice.priceDelta)}</span>
                  ) : null}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <label className="notes">
        <span className="notes__label">
          {t(UI.notesLabel)} <em>({t(UI.optional)})</em>
        </span>
        <textarea
          id={`note-${item.id}`}
          value={note}
          maxLength={120}
          rows={2}
          placeholder={t(UI.notesPlaceholder)}
          onChange={(event) => setNote(event.target.value)}
        />
      </label>
    </Modal>
  );
}
