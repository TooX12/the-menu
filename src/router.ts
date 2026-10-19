import { useCallback, useEffect, useState } from 'react';

/**
 * A hash router in forty lines. The app has four routes and is hosted as
 * static files, so hash routing means no rewrite rules on the host and no
 * routing dependency. Swap in react-router here if the app ever grows.
 */
export interface Route {
  /** Path segments after the hash, e.g. ['menu', 'servicio']. */
  segments: string[];
  query: URLSearchParams;
}

function readRoute(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [path, search = ''] = raw.split('?');
  return {
    segments: (path ?? '').split('/').filter(Boolean).map(decodeURIComponent),
    query: new URLSearchParams(search),
  };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export function navigate(path: string): void {
  const next = path.startsWith('#') ? path : `#${path.startsWith('/') ? path : `/${path}`}`;
  if (window.location.hash === next) return;
  window.location.hash = next;
}

/** Props for anchors, so links stay real `<a href>` elements. */
export function href(path: string): string {
  return path.startsWith('#') ? path : `#${path.startsWith('/') ? path : `/${path}`}`;
}

export function useNavigate(): (path: string) => void {
  return useCallback((path: string) => navigate(path), []);
}
