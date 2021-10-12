import { useEffect } from 'react';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import CookieConsent from 'react-cookie-consent';
import { ReactQueryDevtools } from 'react-query/devtools';
import { lightTheme } from './theme/appTheme';
import { routes } from './config';
import { APP_TITLE } from './utils/constants';
import { RouteItem } from './interfaces/router';
import { ContextProvider } from './hooks/useContext';
import { validateToken } from './utils/utils';

function App() {
  useEffect(() => {
    validateToken();
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{APP_TITLE}</title>
        </Helmet>
        <ContextProvider>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
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
        </ContextProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
