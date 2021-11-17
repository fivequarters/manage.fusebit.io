import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import CookieConsent from 'react-cookie-consent';
import { ReactQueryDevtools } from 'react-query/devtools';
import DashboardRoutes from '@components/DashboardRoutes';
import { ContextProvider } from '@hooks/useAuthContext';
import { lightTheme } from './theme/appTheme';

const App = () => (
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

export default App;
