import { IonReactRouter } from "@ionic/react-router";
import React from "react";
import { Layout, Menu } from "../components";
import { Redirect, Route } from "react-router";
import Page from "../pages/Page";
import { Login, Profile, Register } from "../pages";
import { useState } from "react";

const authTokenString = localStorage.getItem("authToken");
const authToken = authTokenString ? JSON.parse(authTokenString) : {};

export function AppNavigation() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(!!authToken);

  const doLogin = () => {
    setIsAuthenticated(true);
  };

  const doLogout = () => {
    setIsAuthenticated(false);
  };
  
  return (
    <IonReactRouter>
    <Route path="/login" exact={true}>
      {isAuthenticated ? <Redirect to="/folder/:name" /> : <Login doLogin={doLogin}/>}
    </Route>

    <Route path="/register" exact={true}>
      {isAuthenticated ? <Redirect to="/profile" /> : <Register />}
    </Route>

    <Route path="/" exact={true}>
      {isAuthenticated ? (
        <>
          <Menu doLogout={doLogout}/>
          <Redirect to="/folder/Inbox" />
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

    <Route path="/profile" exact={true}>
      {isAuthenticated ? <Profile /> : <Redirect to="/login" />}
    </Route>

    </IonReactRouter>
  );
}
