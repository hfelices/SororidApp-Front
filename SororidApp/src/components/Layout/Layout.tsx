import React, { ReactNode } from "react";
import "./Layout.css";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Menu } from "../Menu";
import image from "../../assets/neandermark.jpeg";
import { FooterComponent } from "./Footer";
export const Layout = ({ children, doLogout }) =>  {
  
  return (
    <>
      <Menu doLogout={doLogout}/>
      <div id="main">
        <IonContent>{children}</IonContent>
      </div>
     <FooterComponent/>
    </>
  );
}
