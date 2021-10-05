import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const useIntercom = () => {
  const location = useLocation();

  useEffect(() => {
    window.Intercom('boot', {
      app_id: 'v9ncq3ml',
    });
  }, []);

  useEffect(() => {
    window.Intercom('update');
  }, [location]);
};
