import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import CookieConsent from 'react-cookie-consent';
import { ReactQueryDevtools } from 'react-query/devtools';
import DashboardRoutes from '@components/DashboardRoutes';
import { ContextProvider } from '@hooks/useAuthContext';
import useFeeds from '@hooks/useFeeds';
import { lightTheme } from './theme/appTheme';

const App = () => {
  useFeeds();
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen((location) => {
      if (location.pathname !== '/' && document.title) {
        gtag('event', 'page_view', {
          page_title: document.title,
          page_location: document.title.split(' | ')?.[0],
          page_path: location.pathname,
        });
      }
    });

    return () => unlisten();
  }, [history]);

  return (
    <ContextProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      <ThemeProvider theme={responsiveFontSizes(createMuiTheme(lightTheme))}>
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          cookieName="CookieConsent"
          style={{ background: 'rgba(215, 229, 255, 0.4)', justifyContent: 'initial' }}
          contentStyle={{ flex: 'initial' }}
          buttonStyle={{
            borderRadius: '4px',
            border: '1px solid #F83420',
            backgroundColor: 'white',
            color: '#F83420',
            fontSize: '13px',
          }}
          expires={150}
        >
          <p style={{ color: '#333333', fontWeight: 500 }}>This website uses cookies to enhance the user experience.</p>
        </CookieConsent>
        <DashboardRoutes />
      </ThemeProvider>
    </ContextProvider>
  );
};

export default App;
