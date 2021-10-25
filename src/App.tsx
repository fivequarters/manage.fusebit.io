import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import CookieConsent from 'react-cookie-consent';
import { ReactQueryDevtools } from 'react-query/devtools';
import { lightTheme } from './theme/appTheme';
import { APP_TITLE } from './utils/constants';
import { ContextProvider } from './hooks/useAuthContext';
import DashboardRoutes from './components/DashboardRoutes';
import RootSnackbar from './components/common/RootSnackbar/RootSnackbar';

const App = () => (
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
          <p style={{ color: '#333333', fontWeight: 500 }}>This website uses cookies to enhance the user experience.</p>
        </CookieConsent>
        <RootSnackbar />
        <DashboardRoutes />
      </ThemeProvider>
    </ContextProvider>
  </HelmetProvider>
);

export default App;
