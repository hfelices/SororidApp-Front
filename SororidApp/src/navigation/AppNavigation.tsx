import { IonReactRouter } from "@ionic/react-router";
import React, { useEffect, useState } from "react";
import { Layout } from "../components";
import { Redirect, Route, Switch } from "react-router";
import Page from "../pages/Page";
import { Login, Register, Profile, Circle, Pending } from "../pages";
import { Explore } from "../pages/Users/Explore";
import { UserDetails } from "../pages/Users/UserDetails";
import { Home } from "../pages/Home";
import { NewRoute } from "../pages/Routes";
import NotFound from "../pages/NotFound/NotFound";

export function AppNavigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );
  const user = JSON.parse(localStorage.getItem("user") || null);
  const [isProfiled, setIsProfiled] = useState(
    user ? user.made_profile : false
  );

  useEffect(() => {
    const authTokenString = localStorage.getItem("authToken");
    setIsAuthenticated(!!authTokenString);

    if (user) {
      setIsProfiled(user.made_profile);
    }
  }, [user, isAuthenticated]);

  const doLogin = () => {
    setIsAuthenticated(true);
  };

  const doLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <IonReactRouter>
    <Switch>
      <Route path="/login" exact={true}>
        {isAuthenticated ? (
          <Redirect to="/profile" />
        ) : (
          <Login doLogin={doLogin} />
        )}
      </Route>

      <Route path="/register" exact={true}>
        {isAuthenticated ? <Redirect to="/profile" /> : <Register />}
      </Route>

      <Route path="/" exact={true}>
        {isAuthenticated ? (
          isProfiled ? (
            <Redirect to="/home" />
          ) : (
            <Redirect to="/profile" />
          )
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      <Route path="/home" exact={true}>
        {isAuthenticated ? (
          isProfiled ? (
            <Layout doLogout={doLogout}>
              <Home />
            </Layout>
          ) : (
            <Redirect to="/profile" />
          )
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route path="/new-route" exact={true}>
        {isAuthenticated ? (
          isProfiled ? (
            <Layout doLogout={doLogout}>
              <NewRoute />
            </Layout>
          ) : (
            <Redirect to="/profile" />
          )
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route path="/explore" exact={true}>
        {isAuthenticated ? (
          isProfiled ? (
            <Layout doLogout={doLogout}>
              <Explore />
            </Layout>
          ) : (
            <Redirect to="/profile" />
          )
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route path="/user-details/:id" exact={true}>
        {isAuthenticated ? (
          isProfiled ? (
            <Layout doLogout={doLogout}>
              <UserDetails />
            </Layout>
          ) : (
            <Redirect to="/profile" />
          )
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route path="/profile" exact={true}>
        {isAuthenticated ? (
          <>
            <Layout doLogout={doLogout}>
              <Profile />
            </Layout>
          </>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route path="/pending" exact={true}>
        {isAuthenticated ? (
          isProfiled ? (
            <Layout doLogout={doLogout}>
              <Pending />
            </Layout>
          ) : (
            <Redirect to="/profile" />
          )
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      <Route path="/circle" exact={true}>
        {isAuthenticated ? (
          isProfiled ? (
            <Layout doLogout={doLogout}>
              <Circle />
            </Layout>
          ) : (
            <Redirect to="/profile" />
          )
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      <Route path="*">
          <NotFound />
        </Route>
        
    </Switch>
    </IonReactRouter>
  );
}
