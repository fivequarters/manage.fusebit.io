import { useEffect } from 'react';
import { isSegmentTrackingEvents } from '../utils/utils';

export function useTrackPage(pageName: string, objectLocation: String) {
  useEffect(() => {
    if (!isSegmentTrackingEvents()) return;
    analytics.page(pageName, { objectLocation, domain: 'manage.fusebit.io' });
  }, [pageName, objectLocation]);
}
