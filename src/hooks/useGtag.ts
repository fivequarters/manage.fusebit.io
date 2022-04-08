import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useGtag = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/' && document.title) {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_path: location.pathname,
      });
    }
  }, [location]);
};

export default useGtag;
