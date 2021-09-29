import { useEffect } from 'react';

export function useTrackPage(pageName: string, objectLocation: String) {
  useEffect(() => {
    analytics.page(pageName, { objectLocation, domain: 'manage.fusebit.io' });
  }, [pageName, objectLocation]);
}
