import { createMuiTheme, responsiveFontSizes, ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import CookieConsent from 'react-cookie-consent';
import { ReactQueryDevtools } from 'react-query/devtools';
import DashboardRoutes from '@components/DashboardRoutes';
import { ContextProvider } from '@hooks/useAuthContext';
import useFeeds from '@hooks/useFeeds';
import useGtag from '@hooks/useGtag';
import SnackProvider from './components/common/SnackProvider';
import { lightTheme } from './theme/appTheme';

const App = () => {
  useFeeds();
  useGtag();

  return (
    <ContextProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      <ThemeProvider theme={responsiveFontSizes(createMuiTheme(lightTheme))}>
        <StylesProvider injectFirst>
          <SnackProvider>
            <CookieConsent
              location="bottom"
              buttonText="Accept"
              cookieName="CookieConsent"
              style={{ background: '#d7e5ff', justifyContent: 'initial' }}
              contentStyle={{ flex: 'initial' }}
              buttonStyle={{
                borderRadius: '4px',
                border: '1px solid #F83420',
                backgroundColor: 'white',
                color: '#F83420',
                fontSize: '13px',
                zIndex: 999,
              }}
              expires={150}
            >
              <p style={{ color: '#333333', fontWeight: 500 }}>
                This website uses cookies to enhance the user experience.
              </p>
            </CookieConsent>
            <DashboardRoutes />
          </SnackProvider>
        </StylesProvider>
      </ThemeProvider>
    </ContextProvider>
  );
};

export default App;
