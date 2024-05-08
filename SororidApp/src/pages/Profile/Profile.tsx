import  { useEffect, useRef, useState } from "react";
import "./Profile.css";

import image from "../../assets/neandermark.jpeg";
import {
  IonHeader,
  IonButtons,
  IonAvatar,
  IonText,
  IonItem,
  IonIcon,
  IonContent,
  IonPage,
  IonModal,
  IonButton,
} from "@ionic/react";
import { cameraOutline, createOutline } from "ionicons/icons";
import { FooterComponent, Menu } from "../../components";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export function Profile() {
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);
  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);
  function dismiss() {
    modal.current?.dismiss();
  }

  const openCamera = async () => {
    const response = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    if (response.webPath) {
      console.log(response.webPath);
    }
  };

  async function canDismiss(data?: any, role?: string) {
    return role !== "gesture";
  }
  return (
    <>
      <IonPage>
        <IonHeader className="profile_header ion-padding ">
          <div className="d-flex justify-content-center align-items-center">
            <IonAvatar>
              <img src={image} alt="" />
            </IonAvatar>
            <IonButton fill="clear">
              <IonIcon
                className="profile_icon"
                slot="icon-only"
                icon={cameraOutline}
                onClick={openCamera}
              />
            </IonButton>
          </div>

          <IonItem>
            <IonText className="mt-2">Mark Lopez</IonText>
            <IonButton id="open-modal" fill="clear">
              <IonIcon
                className="profile_icon"
                slot="icon-only"
                icon={createOutline}
              />
            </IonButton>
          </IonItem>
        </IonHeader>

        <IonContent className="ion-padding">
          <IonItem className="profile_info_row">
            <IonText className="profile_text">Fecha de Nacimiento</IonText>
            <IonIcon className="profile_icon" icon={createOutline} />
          </IonItem>
          <IonItem className="profile_info_row">
            <IonText className="profile_text">Ciudad</IonText>
            <IonIcon className="profile_icon" icon={createOutline} />
          </IonItem>
          <IonItem className="profile_info_row">
            <IonText className="profile_text">Sexo</IonText>
            <IonIcon className="profile_icon" icon={createOutline} />
          </IonItem>
          <IonItem className="profile_info_row">
            <IonText className="profile_text">Contraseña de Emergencia</IonText>
            <IonIcon className="profile_icon" icon={createOutline} />
          </IonItem>

          <IonModal
            ref={modal}
            trigger="open-modal"
            canDismiss={canDismiss}
            presentingElement={presentingElement!}
            initialBreakpoint={0.5}
            breakpoints={[
              0.3, 0.31, 0.32, 0.33, 0.34, 0.35, 0.36, 0.37, 0.38, 0.39, 0.4,
              0.41, 0.42, 0.43, 0.44, 0.45, 0.46, 0.47, 0.48, 0.49, 0.5, 0.51,
              0.52, 0.53, 0.54, 0.55, 0.56, 0.57, 0.58, 0.59, 0.6, 0.61, 0.62,
              0.63, 0.64, 0.65, 0.66, 0.67, 0.68, 0.69, 0.7, 0.71, 0.72, 0.73,
              0.74, 0.75, 0.76, 0.77, 0.78, 0.79, 0.8, 0.81, 0.82, 0.83, 0.84,
              0.85, 0.86, 0.87, 0.88, 0.89, 0.9, 0.91, 0.92, 0.93, 0.94, 0.95,
              0.96, 0.97, 0.98, 0.99, 1,
            ]}
          >
            <IonButtons slot="end">
              <IonButton onClick={() => dismiss()}>Close</IonButton>
            </IonButtons>
          </IonModal>
        </IonContent>

        <FooterComponent />
      </IonPage>
    </>
  );
}
