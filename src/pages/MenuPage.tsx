import { useMemo, useState } from 'react';
import { PACKAGES } from '@/config/packages';
import { useLanguage } from '@/i18n/LanguageContext';
import { UI } from '@/i18n/strings';
import { resolveItem } from '@/lib/order';
import { href } from '@/router';
import { OrderProvider, useOrder } from '@/state/OrderContext';
import { ServiceProvider } from '@/state/ServiceContext';
import type { MenuItem, OrderLine, PackageId } from '@/types';
import { CallWaiter, ServiceToast } from '@/components/CallWaiter';
import { ItemSheet } from '@/components/ItemSheet';
import { MenuSheet } from '@/components/MenuSheet';
import { OrderBar } from '@/components/OrderBar';
import { OrderSheet } from '@/components/OrderSheet';
import { OrderTicket } from '@/components/OrderTicket';

interface MenuPageProps {
  packageId: PackageId;
  table: string;
}

export function MenuPage({ packageId, table }: MenuPageProps) {
  return (
    <OrderProvider table={table}>
      <ServiceProvider table={table}>
        <MenuPageInner packageId={packageId} table={table} />
      </ServiceProvider>
    </OrderProvider>
  );
}

type Screen = 'menu' | 'review' | 'ticket';

function MenuPageInner({ packageId, table }: MenuPageProps) {
  const { t } = useLanguage();
  const definition = PACKAGES[packageId];
  const { ordering, callWaiter } = definition.capabilities;

  const { order, addItem, updateLine, markReady } = useOrder();
  const [screen, setScreen] = useState<Screen>('menu');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingLine, setEditingLine] = useState<OrderLine | null>(null);

  const chosen = useMemo(() => {
    const counts = new Map<string, number>();
    for (const line of order.lines) {
      counts.set(line.itemId, (counts.get(line.itemId) ?? 0) + line.quantity);
    }
    return counts;
  }, [order.lines]);

  const closeItemSheet = () => {
    setEditingItem(null);
    setEditingLine(null);
  };

  return (
    <div className={`menupage menupage--${packageId}`}>
      <div className="demobar">
        <a className="demobar__back" href={href('/')}>
          ← {t(UI.backToPackages)}
        </a>
        <span className="demobar__tag">
          {t(UI.demoBanner, { name: `${definition.numeral} · ${t(definition.name)}` })}
        </span>
      </div>

      <main className="menupage__main">
        <MenuSheet
          table={table}
          selectable={ordering}
          chosen={chosen}
          onSelect={(item) => {
            setEditingLine(null);
            setEditingItem(item);
          }}
        />
      </main>

      <ServiceToast />

      {ordering || callWaiter ? (
        <OrderBar
          onReview={() => setScreen('review')}
          slot={callWaiter ? <CallWaiter table={table} /> : undefined}
        />
      ) : null}

      <ItemSheet
        item={editingItem}
        editing={editingLine}
        onClose={closeItemSheet}
        onSubmit={(options, quantity, note) => {
          if (!editingItem) return;
          if (editingLine) updateLine(editingLine.lineId, editingItem, options, quantity, note);
          else addItem(editingItem, options, quantity, note);
          closeItemSheet();
        }}
      />

      <OrderSheet
        open={screen === 'review'}
        onClose={() => setScreen('menu')}
        onEditLine={(line) => {
          const item = resolveItem(line.itemId);
          if (!item) return;
          setScreen('menu');
          setEditingLine(line);
          setEditingItem(item);
        }}
        onHandOver={() => {
          markReady();
          setScreen('ticket');
        }}
      />

      <OrderTicket
        open={screen === 'ticket'}
        onClose={() => setScreen('menu')}
        onEdit={() => setScreen('review')}
      />
    </div>
  );
}
