import React from "react";
import "../Layout.css";
import { IonFooter, IonTitle, IonToolbar } from "@ionic/react";
export function FooterComponent() {
  return (
    <IonFooter className="my_footer ion-padding">
      <IonToolbar>
        <IonTitle className="my_footer_text">Footer</IonTitle>
      </IonToolbar>
    </IonFooter>
  );
}
