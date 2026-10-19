import { useMemo } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { UI } from '@/i18n/strings';
import { describeOptions, resolveItem } from '@/lib/order';
import { encodeTicket } from '@/lib/ticket';
import { useOrder } from '@/state/OrderContext';
import { Modal } from './Modal';
import { QrCode } from './QrCode';

interface OrderTicketProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}

/**
 * Package II in one screen: the order the guest built, as a code the
 * waiter scans. Nothing is dictated, and the kitchen gets the
 * modifications exactly as they were chosen.
 */
export function OrderTicket({ open, onClose, onEdit }: OrderTicketProps) {
  const { t, money, language } = useLanguage();
  const { order, total } = useOrder();

  const payload = useMemo(() => encodeTicket(order, language), [order, language]);

  if (!open) return null;

  return (
    <Modal open onClose={onClose} title={t(UI.ticketTitle)} eyebrow={`${t(UI.table)} ${order.table}`}>
      <div className="ticket">
        <p className="ticket__help">{t(UI.ticketHelp)}</p>

        <div className="ticket__code">
          <QrCode value={payload} size={236} title={`${t(UI.ticketCode)} ${order.code}`} />
          <p className="ticket__folio">
            <span>{t(UI.ticketCode)}</span>
            <strong>{order.code}</strong>
          </p>
          <p className="ticket__fallback">{t(UI.ticketNoScanner)}</p>
        </div>

        <ul className="ticket__lines">
          {order.lines.map((line) => {
            const item = resolveItem(line.itemId);
            if (!item) return null;
            const details = describeOptions(item, line.options, language);
            return (
              <li key={line.lineId}>
                <span className="ticket__qty">{line.quantity}</span>
                <span className="ticket__dish">
                  {t(item.name)}
                  {details.length > 0 ? <em>{details.join(' · ')}</em> : null}
                  {line.note ? <em className="ticket__note">“{line.note}”</em> : null}
                </span>
                <span className="ticket__price">{money(line.unitPrice * line.quantity)}</span>
              </li>
            );
          })}
        </ul>

        <div className="totals totals--ticket">
          <span>{t(UI.total)}</span>
          <strong>{money(total)}</strong>
        </div>

        <button type="button" className="linkbtn" onClick={onEdit}>
          {t(UI.editOrder)}
        </button>
      </div>
    </Modal>
  );
}
