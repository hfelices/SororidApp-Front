import { IonReactRouter } from "@ionic/react-router";
import React from "react";
import { Layout, Menu } from "../components";
import { Redirect, Route } from "react-router";
import Page from "../pages/Page";
import { Login, Profile, Register } from "../pages";

export function AppNavigation() {
  return (
    <IonReactRouter>
      <Route path="/profile" exact={true}>
        <Profile />
      </Route>

      <Route path="/login" exact={true}>
        <Login />
      </Route>
      <Route path="/register" exact={true}>
        <Register />
      </Route>

      <Route path="/" exact={true}>
        <Menu />
        <Redirect to="/folder/Inbox" />
      </Route>
      <Route path="/folder/:name" exact={true}>
        <Layout>
          <Page />
        </Layout>
      </Route>
    </IonReactRouter>
  );
}
