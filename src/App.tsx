import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import CookieConsent from 'react-cookie-consent';
import { lightTheme } from './theme/appTheme';
import { routes } from './config';
import { APP_TITLE } from './utils/constants';
import { RouteItem } from './interfaces/router';
import { ContextProvider } from './hooks/useContext';
import { handleTokenExpired, isTokenExpired, readLocalData } from './utils/utils';

function App() {
  const queryClient = new QueryClient();

  useEffect(() => {
    const __userData = readLocalData();
    if (__userData.token) {
      const expired = isTokenExpired(__userData.token);
      handleTokenExpired(expired);
    }
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{APP_TITLE}</title>
        </Helmet>
        <ContextProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={responsiveFontSizes(createMuiTheme(lightTheme))}>
              <CookieConsent
                location="bottom"
                buttonText="Accept"
                cookieName="CookieConsent"
                style={{ background: 'rgba(215, 229, 255, 0.4)' }}
                buttonStyle={{
                  borderRadius: '4px',
                  border: '1px solid #F83420',
                  backgroundColor: 'white',
                  color: '#F83420',
                  fontSize: '13px',
                }}
                expires={150}
              >
                <p style={{ color: '#333333', fontWeight: 500 }}>
                  This website uses cookies to enhance the user experience.
                </p>
              </CookieConsent>
              <Router>
                <Switch>
                  {routes.map((route: RouteItem) => (
                    <Route key={`${route.key}`} path={`${route.path}`} component={route.component} exact />
                  ))}
                </Switch>
              </Router>
            </ThemeProvider>
          </QueryClientProvider>
        </ContextProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
