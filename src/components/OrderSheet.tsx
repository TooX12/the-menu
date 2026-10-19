import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { UI } from '@/i18n/strings';
import { describeOptions, lineTotal, resolveItem } from '@/lib/order';
import { useOrder } from '@/state/OrderContext';
import type { OrderLine } from '@/types';
import { Modal } from './Modal';

interface OrderSheetProps {
  open: boolean;
  onClose: () => void;
  onEditLine: (line: OrderLine) => void;
  onHandOver: () => void;
}

export function OrderSheet({ open, onClose, onEditLine, onHandOver }: OrderSheetProps) {
  const { t, money, language } = useLanguage();
  const { order, total, count, setQuantity, removeLine, clear } = useOrder();
  const [confirmingClear, setConfirmingClear] = useState(false);

  if (!open) return null;

  return (
    <Modal
      open
      onClose={onClose}
      title={t(UI.yourOrder)}
      eyebrow={`${t(UI.table)} ${order.table}`}
      footer={
        count > 0 ? (
          <div className="sheetfoot sheetfoot--stack">
            {confirmingClear ? (
              <div className="confirmstrip">
                <p>{t(UI.clearOrderConfirm)}</p>
                <div className="confirmstrip__actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setConfirmingClear(false)}
                  >
                    {t(UI.cancel)}
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger"
                    onClick={() => {
                      clear();
                      setConfirmingClear(false);
                      onClose();
                    }}
                  >
                    {t(UI.clearOrder)}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="totals">
                  <span>{t(UI.total)}</span>
                  <strong>{money(total)}</strong>
                </div>
                <button type="button" className="btn btn--primary btn--wide" onClick={onHandOver}>
                  {t(UI.handToWaiter)}
                </button>
                <div className="sheetfoot__links">
                  <button type="button" className="linkbtn" onClick={onClose}>
                    {t(UI.keepChoosing)}
                  </button>
                  <button
                    type="button"
                    className="linkbtn linkbtn--quiet"
                    onClick={() => setConfirmingClear(true)}
                  >
                    {t(UI.clearOrder)}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null
      }
    >
      {count === 0 ? (
        <p className="empty">{t(UI.orderEmpty)}</p>
      ) : (
        <ul className="lines">
          {order.lines.map((line) => {
            const item = resolveItem(line.itemId);
            if (!item) return null;
            const details = describeOptions(item, line.options, language);
            return (
              <li key={line.lineId} className="lines__item">
                <div className="lines__main">
                  <button type="button" className="lines__name" onClick={() => onEditLine(line)}>
                    {t(item.name)}
                  </button>
                  {details.length > 0 ? <p className="lines__opts">{details.join(' · ')}</p> : null}
                  {line.note ? <p className="lines__note">“{line.note}”</p> : null}
                </div>
                <div className="lines__side">
                  <div className="stepper stepper--small">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                      aria-label="−"
                    >
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                      aria-label="+"
                    >
                      +
                    </button>
                  </div>
                  <span className="lines__price">{money(lineTotal(line))}</span>
                  <button
                    type="button"
                    className="linkbtn linkbtn--quiet"
                    onClick={() => removeLine(line.lineId)}
                  >
                    {t(UI.remove)}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
