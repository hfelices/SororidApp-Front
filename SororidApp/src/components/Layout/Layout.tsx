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
interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Menu />
      <div id="main">
        <IonContent>{children}</IonContent>
      </div>
     <FooterComponent/>
    </>
  );
}
