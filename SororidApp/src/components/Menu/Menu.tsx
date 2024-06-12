import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
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
  exitOutline,
  exitSharp,
  homeOutline,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  peopleOutline,
  peopleSharp,
  personOutline,
  personSharp,
  refreshOutline,
} from "ionicons/icons";
import { API_URL, URL } from "../../constants";
import defaultAvatar from "../../assets/default-avatar.jpg";
import { useEffect, useState } from "react";
interface MenuProps {
  doLogout: () => void; // Definimos la prop doLogout como una función que no recibe argumentos y no devuelve nada
}
export const Menu: React.FC<MenuProps> = ({ doLogout }) => {
  const router = useIonRouter();
  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const user = JSON.parse(localStorage.getItem("user") || "");
  const profile = JSON.parse(localStorage.getItem("profile") || "");
  const [pending, setPending] = useState([]);
  const userImage = URL + profile.profile_img_path;
  const appPages = [
    {
      title: "Inicio",
      url: "/home",
      iosIcon: homeOutline,
      mdIcon: homeOutline,
    },
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
    {
      title: "Solicitudes",
      url: "/pending",
      iosIcon: peopleOutline,
      mdIcon: peopleSharp,
    },
  ];
  const getPendingRelations = async () => {
    try {
      const response = await fetch(`${API_URL}relations/${user.id}/pending`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const responseData = await response.json();
      if (responseData.success === true) {
        setPending(responseData.data);
      } else {
        //console.log("Error! Mensaje:", responseData);
        return [];
      }
    } catch (error) {
      //console.error("Error al realizar la solicitud:", error);
      return [];
    }
  };
  const logout = async () => {
    try {
      const authToken = JSON.parse(localStorage.getItem("authToken") || "");
      const response = await fetch(API_URL + "logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const responseData = await response.json();
      if (responseData.success === true) {
        //console.log("OK! Mensaje:", responseData);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("profile");
        localStorage.removeItem("town");
        doLogout();
        router.push("/login");
      } else {
        //console.log("Error! Mensaje:", responseData);
      }
    } catch (error) {
      //console.error("Error al realizar la solicitud:", error);
    }
  };

  // const deleteStorage = () => {
  //   localStorage.removeItem("authToken");
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("profile");
  // };
  useEffect(() => {
    getPendingRelations();
  }, []);

  return (
    <>
      <IonMenu contentId="main" type="overlay">
        <IonContent>
          <IonList id="inbox-list">
            <IonListHeader>
              <IonAvatar>
                {" "}
                <img
                  src={profile.profile_img_path ? userImage : defaultAvatar}
                  alt=""
                />{" "}
              </IonAvatar>

              <IonText
                color="sororidark"
                className="mx-1"
                style={{ fontSize: "18px" }}
              >
                {profile.name}
              </IonText>
            </IonListHeader>
            <IonText
              color="sororidark"
              className="ion-padding mx-2"
              style={{ fontSize: "12px" }}
            >
              {user.email}
            </IonText>
            {appPages.map((appPage, index) => {
              return (
                <IonItem key={index}>
                  <a href={appPage.url} className="my-menu-link">
                    <IonIcon
                      aria-hidden="true"
                      slot="start"
                      color="sororidark"
                      ios={appPage.iosIcon}
                      md={appPage.mdIcon}
                    />

                    <IonLabel color={"sororidark"} className="mx-3">
                      {appPage.title}
                    </IonLabel>
                  </a>
                  {index === 4 ? (
                    <>
                      <IonChip className="pending-chip" slot="end">
                        {pending.length}
                      </IonChip>
                      <IonButton
                        slot="end"
                        color={"sororidark"}
                        onClick={getPendingRelations}
                      >
                        <IonIcon
                          className="py-1"
                          color="light"
                          icon={refreshOutline}
                        />
                      </IonButton>
                    </>
                  ) : (
                    <></>
                  )}
                </IonItem>
              );
            })}
            {/* <IonMenuToggle onClick={deleteStorage} autoHide={false}>
              <IonItem>
                <IonIcon
                  aria-hidden="true"
                  slot="start"
                  ios={exitOutline}
                  md={exitSharp}
                  color="danger"
                />
                <IonLabel className="text-danger">Eliminar Storage</IonLabel>
              </IonItem>
            </IonMenuToggle> */}
            <IonMenuToggle key={"logout"} onClick={logout} autoHide={false}>
              <IonItem>
                <IonIcon
                  aria-hidden="true"
                  slot="start"
                  ios={exitOutline}
                  md={exitSharp}
                  color="danger"
                />
                <IonLabel className="text-danger">Logout</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonButtons slot="start" className="ion-padding layout_menu_buttons">
        <IonMenuButton className="layout_menu_button">
          <IonAvatar className="layout_menu_button">
            <img
              src={profile.profile_img_path ? userImage : defaultAvatar}
              alt=""
            />
          </IonAvatar>
        </IonMenuButton>
      </IonButtons>
    </>
  );
};
