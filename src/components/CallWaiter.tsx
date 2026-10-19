import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { UI } from '@/i18n/strings';
import { useService } from '@/state/ServiceContext';
import type { ServiceRequestKind } from '@/types';
import { Modal } from './Modal';

const KINDS: ServiceRequestKind[] = ['waiter', 'water', 'bill'];

/**
 * Package III. The button never calls on its own — it opens a
 * confirmation first, because a bumped phone in a pocket should not send
 * a waiter across the room.
 */
export function CallWaiter({ table }: { table: string }) {
  const { t } = useLanguage();
  const { call, cooldown } = useService();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<ServiceRequestKind>('waiter');

  const waiting = cooldown > 0;

  return (
    <>
      <button
        type="button"
        className={`bell${waiting ? ' is-waiting' : ''}`}
        onClick={() => {
          setKind('waiter');
          setOpen(true);
        }}
        disabled={waiting}
      >
        <span className="bell__icon" aria-hidden="true">
          ✦
        </span>
        <span className="bell__label">
          {waiting ? t(UI.serviceCooldown, { s: cooldown }) : t(UI.callWaiter)}
        </span>
      </button>

      <Modal
        open={open}
        variant="dialog"
        onClose={() => setOpen(false)}
        title={t(UI.serviceConfirmTitle)}
        footer={
          <div className="sheetfoot">
            <button type="button" className="btn btn--ghost" onClick={() => setOpen(false)}>
              {t(UI.cancel)}
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                call(kind);
                setOpen(false);
              }}
            >
              {t(UI.serviceConfirmAction)}
            </button>
          </div>
        }
      >
        <p className="confirm__body">
          {t(UI.serviceConfirmBody, { table: `${t(UI.table).toLowerCase()} ${table}` })}
        </p>

        <fieldset className="optgroup">
          <legend className="optgroup__legend">{t(UI.serviceWhat)}</legend>
          <div className="optgroup__choices">
            {KINDS.map((candidate) => (
              <label key={candidate} className={`choice${kind === candidate ? ' is-on' : ''}`}>
                <input
                  type="radio"
                  name="service-kind"
                  checked={kind === candidate}
                  onChange={() => setKind(candidate)}
                />
                <span className="choice__label">{t(UI.serviceKind[candidate])}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </Modal>
    </>
  );
}

/** The acknowledgement that appears after a call, above the order bar. */
export function ServiceToast() {
  const { t } = useLanguage();
  const { latest, cooldown } = useService();

  if (!latest || cooldown === 0) return null;

  return (
    <div className="toast" role="status">
      <span className="toast__mark" aria-hidden="true">
        {latest.acknowledgedAt ? '✓' : '…'}
      </span>
      <span>
        {t(UI.serviceKind[latest.kind])} · {t(UI.serviceSent)}
      </span>
    </div>
  );
}
