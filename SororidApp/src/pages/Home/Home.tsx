import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonAlert,
  IonItem,
  IonButton,
  IonContent,
} from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";
import defaultAvatar from "../../assets/default-avatar.jpg";
import { URL } from "../../constants";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGZlbGljZXMiLCJhIjoiY2x3ejZmZGxpMDQwbzJzc2Z6YzV3OWM4MiJ9.Zf9F1BMdCxy465v2ZdHuPQ";

export function Home() {
  return (
    <>
      <IonCardHeader></IonCardHeader>
      <IonContent className="ion-padding">
        <a href="/new-route" className="text-decoration-none">
          <IonButton
            expand="block"
            className="mt-3 my-large-button"
            shape="round"
            fill="outline"
          >
            Iniciar recorrido
          </IonButton>
        </a>
      </IonContent>
    </>
  );
}
