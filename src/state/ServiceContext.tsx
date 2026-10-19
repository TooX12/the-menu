import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ServiceRequest, ServiceRequestKind } from '@/types';

/** Seconds a table must wait before it can call again. */
const COOLDOWN_SECONDS = 45;
/** How long the pass takes to acknowledge, in the demo. */
const ACK_DELAY_MS = 2600;

interface ServiceValue {
  /** The most recent call, if any. */
  latest: ServiceRequest | null;
  /** Seconds left before another call is allowed; 0 when free. */
  cooldown: number;
  history: ServiceRequest[];
  call: (kind: ServiceRequestKind) => void;
}

const ServiceContext = createContext<ServiceValue | null>(null);

export function ServiceProvider({ table, children }: { table: string; children: ReactNode }) {
  const [history, setHistory] = useState<ServiceRequest[]>([]);
  const [cooldown, setCooldown] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const id of pending) window.clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const call = useCallback(
    (kind: ServiceRequestKind) => {
      const request: ServiceRequest = {
        id: crypto.randomUUID(),
        kind,
        table,
        createdAt: Date.now(),
      };
      setHistory((previous) => [request, ...previous]);
      setCooldown(COOLDOWN_SECONDS);

      // In production this is where the call reaches the pass. Here we
      // simulate the acknowledgement that comes back from the floor.
      const id = window.setTimeout(() => {
        setHistory((previous) =>
          previous.map((entry) =>
            entry.id === request.id ? { ...entry, acknowledgedAt: Date.now() } : entry,
          ),
        );
      }, ACK_DELAY_MS);
      timers.current.push(id);
    },
    [table],
  );

  const value = useMemo<ServiceValue>(
    () => ({ latest: history[0] ?? null, cooldown, history, call }),
    [history, cooldown, call],
  );

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
}

export function useService(): ServiceValue {
  const value = useContext(ServiceContext);
  if (!value) throw new Error('useService must be used inside <ServiceProvider>');
  return value;
}
