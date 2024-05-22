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
  IonText,
  useIonRouter,
} from "@ionic/react";
import image from "../../assets/neandermark.jpeg";
import "./Menu.css";
import {
  compassOutline,
  compassSharp,
  ellipseOutline,
  ellipseSharp,
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  personOutline,
  personSharp,
} from "ionicons/icons";
import { URL } from "../../constants";
import defaultAvatar from "../../assets/default-avatar.jpg";
interface MenuProps {
  doLogout: () => void; // Definimos la prop doLogout como una función que no recibe argumentos y no devuelve nada
}
export const Menu: React.FC<MenuProps> = ({ doLogout }) => {
  const router = useIonRouter();
  const user = JSON.parse(localStorage.getItem("user") || "");
  const profile = JSON.parse(localStorage.getItem("profile") || "");
  const userImage = URL + profile.profile_img_path
  const appPages= [
    {
      title: "Mi Perfil",
      url: "/profile",
      iosIcon: personOutline,
      mdIcon: personOutline,
    },
    {
      title: "Mi Círculo",
      url: "/circle",
      iosIcon: ellipseOutline,
      mdIcon: ellipseOutline,
    },
    {
      title: "Explorar",
      url: "/explore",
      iosIcon: compassOutline,
      mdIcon: compassSharp,
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
            <IonText color="sororidark" className="ion-padding">{user.email}</IonText>
            {appPages.map((appPage, index) => {
              return (
                <a href={appPage.url}>
                  <IonMenuToggle key={index} autoHide={false}>
                    <IonItem>
                      <IonIcon
                        aria-hidden="true"
                        slot="start"
                        color="sororidark"
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
            <img src={profile.profile_img_path ? userImage : defaultAvatar} alt="" />
          </IonAvatar>
        </IonMenuButton>
      </IonButtons>
    </>
  );
}
