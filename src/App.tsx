import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Layout from "./components/Layout";
import { lightTheme } from "./theme/appTheme";
import { routes } from "./config";
import { APP_TITLE } from "./utils/constants";
import { RouteItem } from "./interfaces/router";
import { ContextProvider } from "./hooks/useContext";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{APP_TITLE}</title>
        </Helmet>
        <ContextProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={responsiveFontSizes(createMuiTheme(lightTheme))}>
              <Router>
                <Switch>
                  <Layout>
                    {routes.map((route: RouteItem) => <Route
                      key={`${route.key}`}
                      path={`${route.path}`}
                      component={route.component}
                      exact
                    />)}
                  </Layout>
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
