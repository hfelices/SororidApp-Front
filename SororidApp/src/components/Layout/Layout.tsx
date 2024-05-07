import React, { ReactNode } from "react";
import "./Layout.css";
import { IonAvatar, IonButton, IonButtons, IonHeader, IonMenuButton } from "@ionic/react";
import { Menu } from "../Menu";
import image from "../../assets/neandermark.jpeg";
interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div>

      <IonButtons slot="start" className="ion-padding">
        <IonMenuButton className="layout_menu_button">
          <IonAvatar className="layout_avatar">
            <img src={image} alt="" />
          </IonAvatar>
        </IonMenuButton>
      </IonButtons>
      <Menu />

      <div className="content">{children}</div>

    </div>
  );
}
