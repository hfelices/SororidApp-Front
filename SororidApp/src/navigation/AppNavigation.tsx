import { IonReactRouter } from "@ionic/react-router";
import React, { useEffect, useState } from "react";
import { Layout } from "../components";
import { Redirect, Route } from "react-router";
import Page from "../pages/Page";
import { Login, Register, Profile, Circle } from "../pages";
import { Explore } from "../pages/Users/Explore";
import { UserDetails } from "../pages/Users/UserDetails";

const authTokenString = localStorage.getItem("authToken");
const authToken = authTokenString ? JSON.parse(authTokenString) : {};

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
      <Route path="/login" exact={true}>
        {isAuthenticated ? (
          <Redirect to="/folder/:name" />
        ) : (
          <Login doLogin={doLogin} />
        )}
      </Route>

      <Route path="/register" exact={true}>
        {isAuthenticated ? <Redirect to="/profile" /> : <Register />}
      </Route>

      <Route path="/" exact={true}>
        {isAuthenticated ? (
          <>
            <Redirect to="/folder/Inbox" />
          </>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      <Route path="/explore" exact={true}>
        {isAuthenticated ? (
          <>
            <Layout doLogout={doLogout}>
              <Explore />
            </Layout>
          </>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route path="/folder/:name" exact={true}>
        {isAuthenticated ? (
          <Layout doLogout={doLogout}>
            <Page />
          </Layout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route path="/user-details/:id" exact={true}>
        {isAuthenticated ? (
          <Layout doLogout={doLogout}>
            <UserDetails />
          </Layout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route path="/profile" exact={true}>
        {isAuthenticated ? (
          <>
            <Profile />
          </>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      <Route path="/circle" exact={true}>
        {isAuthenticated ? (
          <>
            <Layout doLogout={doLogout}>
              <Circle />
            </Layout>
          </>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
    </IonReactRouter>
  );
}
