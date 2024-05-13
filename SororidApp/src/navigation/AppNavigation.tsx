import { IonReactRouter } from "@ionic/react-router";
import React from "react";
import { Layout, Menu } from "../components";
import { Redirect, Route } from "react-router";
import Page from "../pages/Page";
import { Login, Profile, Register } from "../pages";


const user = JSON.parse(localStorage.getItem("user") || "");
const isAuthenticated = !!user.authToken;

export function AppNavigation() {
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
