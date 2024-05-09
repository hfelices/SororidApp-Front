import React from "react";
import "./Footer.css";
import { IonFooter, IonTitle, IonToolbar } from "@ionic/react";
export function FooterComponent() {
  return (
    <IonFooter translucent={true}>
      <IonToolbar>
        <IonTitle className="text-center">Footer</IonTitle>
      </IonToolbar>
    </IonFooter>
  );
}
