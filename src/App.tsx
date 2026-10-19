import { useEffect } from 'react';
import { isPackageId } from '@/config/packages';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import { useRoute } from '@/router';
import { HomePage } from '@/pages/HomePage';
import { MenuPage } from '@/pages/MenuPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { TablePage } from '@/pages/TablePage';

export default function App() {
  return (
    <LanguageProvider>
      <Routes />
    </LanguageProvider>
  );
}

function Routes() {
  const route = useRoute();
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const [first, second] = route.segments;

  if (!first) return <HomePage />;

  if (first === 'menu' && second && isPackageId(second)) {
    const table = route.query.get('table')?.trim() || '12';
    // Remount per table so a scanned code always starts a clean order.
    return <MenuPage key={`${second}:${table}`} packageId={second} table={table} />;
  }

  if (first === 'table' && second && isPackageId(second)) {
    return <TablePage packageId={second} />;
  }

  return <NotFoundPage />;
}
