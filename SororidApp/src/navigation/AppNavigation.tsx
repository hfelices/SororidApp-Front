import { IonReactRouter } from "@ionic/react-router";
import React, { useEffect, useState } from "react";
import { Layout } from "../components";
import { Redirect, Route } from "react-router";
import Page from "../pages/Page";
import { Login, Profile, Register } from "../pages";

export function AppNavigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );

  useEffect(() => {
    const authTokenString = localStorage.getItem("authToken");
    setIsAuthenticated(!!authTokenString);
  }, []);

  const doLogin = () => {
    setIsAuthenticated(true);
  };

  const doLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <IonReactRouter>
      <Route
        render={({ location }) => {
          if (!isAuthenticated && location.pathname !== "/login" && location.pathname !== "/register") {
            return <Redirect to="/login" />;
          }
          return (
            <>
              <Route path="/login" exact>
                {isAuthenticated ? <Redirect to="/folder/:name" /> : <Login doLogin={doLogin} />}
              </Route>
              <Route path="/register" exact>
                {!isAuthenticated ? <Register /> : < Redirect to="/profile"/>}
              </Route>
              <Route path="/" exact>
                {isAuthenticated ? <Redirect to="/folder/Inbox" /> : <Redirect to="/login" />}
              </Route>
              <Route path="/folder/:name" exact>
                <Layout doLogout={doLogout}>
                  <Page />
                </Layout>
              </Route>
              <Route path="/profile" exact>
                <Profile />
              </Route>
            </>
          );
        }}
      />
    </IonReactRouter>
  );
}
