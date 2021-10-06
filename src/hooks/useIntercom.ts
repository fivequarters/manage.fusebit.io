import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

declare global {
  interface Window {
    Intercom?: any;
  }
}

export const useIntercom = () => {
  const location = useLocation();

  useEffect(() => {
    window.Intercom('boot', {
      app_id: process.env.REACT_APP_INTERCOM_APP_ID,
    });
  }, []);

  useEffect(() => {
    window.Intercom('update');
  }, [location]);
};
