import {
  IonAvatar,
  IonButtons,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";
import image from "../../assets/neandermark.jpeg";
import "./Menu.css";
import {
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
} from "ionicons/icons";

export function Menu() {
  interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
  }

  const appPages: AppPage[] = [
    {
      title: "Profile",
      url: "/profile",
      iosIcon: mailOutline,
      mdIcon: mailSharp,
    },
    {
      title: "Outbox",
      url: "/folder/Outbox",
      iosIcon: paperPlaneOutline,
      mdIcon: paperPlaneSharp,
    },
    {
      title: "Favorites",
      url: "/folder/Favorites",
      iosIcon: heartOutline,
      mdIcon: heartSharp,
    },
  ];

  return (
    <>
      <IonMenu contentId="main" type="overlay">
        <IonContent>
          <IonList id="inbox-list">
            <IonListHeader>Inbox</IonListHeader>
            <IonNote>hi@ionicframework.com</IonNote>
            {appPages.map((appPage, index) => {
              return (
                <a href={appPage.url}>
                  <IonMenuToggle key={index} autoHide={false}>
                    <IonItem>
                      <IonIcon
                        aria-hidden="true"
                        slot="start"
                        ios={appPage.iosIcon}
                        md={appPage.mdIcon}
                      />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
                </a>
              );
            })}
          </IonList>
        </IonContent>
      </IonMenu>

      <IonButtons slot="start" className="ion-padding">
        <IonMenuButton className="layout_menu_button">
          <IonAvatar className="layout_menu_button">
            <img src={image} alt="" />
          </IonAvatar>
        </IonMenuButton>
      </IonButtons>
    </>
  );
}