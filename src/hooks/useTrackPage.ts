import { useEffect } from 'react';
import { getAnalyticsClient } from '@utils/analytics';
import { PRODUCTION_HOST } from '@utils/constants';

export function useTrackPage(pageName: string, objectLocation: String) {
  useEffect(() => {
    getAnalyticsClient().page(pageName, { objectLocation, domain: PRODUCTION_HOST });
  }, [pageName, objectLocation]);
}
