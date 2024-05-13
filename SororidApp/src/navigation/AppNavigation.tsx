import { IonReactRouter } from "@ionic/react-router";
import React from "react";
import { Layout, Menu } from "../components";
import { Redirect, Route } from "react-router";
import Page from "../pages/Page";
import { Login, Profile, Register } from "../pages";
import { useState } from "react";

const userString = localStorage.getItem("user");
const user = userString ? JSON.parse(userString) : {};

export function AppNavigation() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(!!user.authToken);
  return (
    <IonReactRouter>
    <Route path="/login" exact={true}>
      {isAuthenticated ? <Redirect to="/profile" /> : <Login />}
    </Route>

    <Route path="/register" exact={true}>
      {isAuthenticated ? <Redirect to="/profile" /> : <Register />}
    </Route>

    <Route path="/" exact={true}>
      {isAuthenticated ? (
        <>
          <Menu />
          <Redirect to="/folder/Inbox" />
        </>
      ) : (
        <Redirect to="/login" />
      )}
    </Route>

    <Route path="/folder/:name" exact={true}>
      {isAuthenticated ? (
        <Layout>
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
