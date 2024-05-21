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
  useIonRouter,
} from "@ionic/react";
import image from "../../assets/neandermark.jpeg";
import "./Menu.css";
import {
  compassOutline,
  compassSharp,
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  personOutline,
  personSharp,
} from "ionicons/icons";

interface MenuProps {
  doLogout: () => void; // Definimos la prop doLogout como una función que no recibe argumentos y no devuelve nada
}
export const Menu: React.FC<MenuProps> = ({ doLogout }) => {
  const router = useIonRouter();
  const user = JSON.parse(localStorage.getItem("user") || "");
  const profile = JSON.parse(localStorage.getItem("profile") || "");
  const appPages= [
    {
      title: "Mi perfil",
      url: "/profile",
      iosIcon: personOutline,
      mdIcon: personSharp,
    },
    {
      title: "Explorar",
      url: "/explore",
      iosIcon: compassOutline,
      mdIcon: compassSharp,
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
  const logout = async () => {
    try {
      const authToken = JSON.parse(localStorage.getItem("authToken") || "");
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },

      });
      const responseData = await response.json();
      if (responseData.success === true) {
        console.log('OK! Mensaje:', responseData);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("profile");
        localStorage.removeItem("town");
        doLogout();
        router.push('/login');
        
    } else {
      console.log('Error! Mensaje:', responseData);
    }

    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
  }    
} 
  


  return (
    <>
      <IonMenu contentId="main" type="overlay">
        <IonContent>
          <IonList id="inbox-list">
            <IonListHeader><IonAvatar></IonAvatar>{profile.name}</IonListHeader>
            <IonNote>{user.email}</IonNote>
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
            <IonMenuToggle onClick={logout} autoHide={false}>
              <IonItem>
                <IonIcon
                  aria-hidden="true"
                  slot="start"
                  ios={heartOutline}
                  md={heartSharp}
                />
                <IonLabel>Logout</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonButtons slot="start" className="ion-padding layout_menu_buttons">
        <IonMenuButton className="layout_menu_button">
          <IonAvatar className="layout_menu_button">
            <img src={image} alt="" />
          </IonAvatar>
        </IonMenuButton>
      </IonButtons>
    </>
  );
}
