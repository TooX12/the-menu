import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { UI } from '@/i18n/strings';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Rendered under the title, before the body. */
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** `sheet` slides up from the bottom; `dialog` sits centred. */
  variant?: 'sheet' | 'dialog';
}

/**
 * One modal for the whole app: the dish editor, the order review and the
 * waiter confirmation all use it, so focus handling and the escape key are
 * written once.
 */
export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  variant = 'sheet',
}: ModalProps) {
  const { t } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  // Rendered at the document root: the order bar sets a backdrop filter,
  // which would otherwise become the containing block for a fixed child
  // and pin the dialog to the bottom of the screen.
  return createPortal(
    <div className={`modal modal--${variant}`}>
      <button type="button" className="modal__scrim" aria-label={t(UI.close)} onClick={onClose} />
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        tabIndex={-1}
      >
        <header className="modal__head">
          <div>
            {eyebrow ? <p className="modal__eyebrow">{eyebrow}</p> : null}
            <h2 className="modal__title" id={titleId}>
              {title}
            </h2>
          </div>
          <button type="button" className="modal__close" onClick={onClose} aria-label={t(UI.close)}>
            ×
          </button>
        </header>

        <div className="modal__body">{children}</div>

        {footer ? <footer className="modal__foot">{footer}</footer> : null}
      </div>
    </div>,
    document.body,
  );
}
