import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { MenuItem, Order, OrderLine, SelectedOption } from '@/types';
import { makeTicketCode, orderItemCount, orderTotal, sameConfiguration, unitPriceFor } from '@/lib/order';

interface DraftLine {
  itemId: string;
  quantity: number;
  options: SelectedOption[];
  note?: string;
  unitPrice: number;
}

type Action =
  | { type: 'add'; line: DraftLine }
  | { type: 'update'; lineId: string; line: DraftLine }
  | { type: 'setQuantity'; lineId: string; quantity: number }
  | { type: 'remove'; lineId: string }
  | { type: 'clear' }
  | { type: 'markReady' }
  | { type: 'reopen' };

function reducer(state: Order, action: Action): Order {
  switch (action.type) {
    case 'add': {
      const existing = state.lines.find((line) => sameConfiguration(line, action.line));
      const lines = existing
        ? state.lines.map((line) =>
            line.lineId === existing.lineId
              ? { ...line, quantity: line.quantity + action.line.quantity }
              : line,
          )
        : [...state.lines, { ...action.line, lineId: crypto.randomUUID() }];
      return { ...state, lines, status: 'building' };
    }
    case 'update':
      return {
        ...state,
        status: 'building',
        lines: state.lines.map((line) =>
          line.lineId === action.lineId ? { ...action.line, lineId: action.lineId } : line,
        ),
      };
    case 'setQuantity': {
      if (action.quantity <= 0) {
        return { ...state, lines: state.lines.filter((line) => line.lineId !== action.lineId) };
      }
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.lineId === action.lineId ? { ...line, quantity: action.quantity } : line,
        ),
      };
    }
    case 'remove':
      return { ...state, lines: state.lines.filter((line) => line.lineId !== action.lineId) };
    case 'clear':
      return { ...state, lines: [], status: 'building' };
    case 'markReady':
      return { ...state, status: 'ready', readyAt: Date.now() };
    case 'reopen':
      return { ...state, status: 'building' };
    default:
      return state;
  }
}

interface OrderValue {
  order: Order;
  total: number;
  count: number;
  addItem: (item: MenuItem, options: SelectedOption[], quantity: number, note?: string) => void;
  updateLine: (
    lineId: string,
    item: MenuItem,
    options: SelectedOption[],
    quantity: number,
    note?: string,
  ) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
  markReady: () => void;
  reopen: () => void;
}

const OrderContext = createContext<OrderValue | null>(null);

export function OrderProvider({ table, children }: { table: string; children: ReactNode }) {
  const [order, dispatch] = useReducer(reducer, null, (): Order => ({
    code: makeTicketCode(),
    table,
    lines: [],
    status: 'building',
  }));

  const draft = useCallback(
    (item: MenuItem, options: SelectedOption[], quantity: number, note?: string): DraftLine => ({
      itemId: item.id,
      quantity,
      options,
      unitPrice: unitPriceFor(item, options),
      ...(note?.trim() ? { note: note.trim() } : {}),
    }),
    [],
  );

  const value = useMemo<OrderValue>(
    () => ({
      order: { ...order, table },
      total: orderTotal(order.lines),
      count: orderItemCount(order.lines),
      addItem: (item, options, quantity, note) =>
        dispatch({ type: 'add', line: draft(item, options, quantity, note) }),
      updateLine: (lineId, item, options, quantity, note) =>
        dispatch({ type: 'update', lineId, line: draft(item, options, quantity, note) }),
      setQuantity: (lineId, quantity) => dispatch({ type: 'setQuantity', lineId, quantity }),
      removeLine: (lineId) => dispatch({ type: 'remove', lineId }),
      clear: () => dispatch({ type: 'clear' }),
      markReady: () => dispatch({ type: 'markReady' }),
      reopen: () => dispatch({ type: 'reopen' }),
    }),
    [order, table, draft],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder(): OrderValue {
  const value = useContext(OrderContext);
  if (!value) throw new Error('useOrder must be used inside <OrderProvider>');
  return value;
}

export type { OrderLine };
