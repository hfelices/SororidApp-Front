import { useEffect, useState } from "react";
import { API_URL, URL } from "../../../constants";
import "./UserDetails.css";
import { useParams } from "react-router-dom";
import {
  IonActionSheet,
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonText,
  IonToolbar,
} from "@ionic/react";
import defaultAvatar from "../../../assets/default-avatar.jpg";
export function UserDetails() {
  const { id } = useParams();
  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState({});
  const [relation, setRelation] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}users/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const responseData = await response.json();
      if (responseData.success === true) {
        setUser(responseData);
        setLoading(false);
      } else {
        console.log("Error! Mensaje:", responseData);
        return {};
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      return {};
    }
  };
  const getRelation = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}relations/${currentUser.id}/all`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const responseData = await response.json();
      if (responseData.success === true) {
        setRelation(responseData.data.find((elemento) => elemento.id == id));
      } else {
        console.log("Error! Mensaje:", responseData);
        return {};
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      return {};
    }
  };
  const aloha = () => {
    console.log("aloha");
  };
  
  useEffect(() => {
    getRelation(id);
    getUser(id);
    
  }, []);

  return (
    <>
      {loading ? (
        <div className="spinner">
          {" "}
          {/* Aquí debes colocar tu componente de spinner */}
          Loading...
        </div>
      ) : (
        <>
          <div className="all">
            <IonHeader className="profile_header ion-padding ">
              <div className="d-flex align-items-center justify-content-center flex-column">
                <img
                  className="large-avatar"
                  src={
                    user.profile.profile_img_path
                      ? `${URL}${user.profile.profile_img_path}`
                      : defaultAvatar
                  }
                  alt="avatar"
                />

                <div className="user-details text-center">
                  <IonText className="mt-2 fw-bold fs-3">
                    {user.profile.name}
                  </IonText>
                  <IonText className="mt-2">{user.town.name}</IonText>
                  <IonText className="mt-2">{user.profile.gender}</IonText>
                  <IonText className="mt-2">{user.profile.birthdate}</IonText>
                </div>
              </div>
            </IonHeader>
            <div className="ion-padding detail-buttons">
              {relation ? (
                relation.relation_type === "blocked" ? (
                  <>
                    <IonButton
                      id="open-action-sheet-unblock"
                      expand="block"
                      shape="round"
                      fill="outline"
                    >
                      Desbloquear
                    </IonButton>
                    <IonActionSheet
                      trigger="open-action-sheet-unblock"
                      className="custom-action-sheet"
                      header={
                        "¿Quieres desbloquear a " + user.profile.name + " ?"
                      }
                      buttons={[
                        {
                          text: "Desbloquear",
                          role: "destructive",
                          data: {
                            action: "unblock",
                          },
                          handler: () => {
                            aloha();
                           
                          },
                        },
                        {
                          text: "Cancelar",
                          role: "cancel",
                          data: {
                            action: "cancel",
                          },
                        },
                      ]}
                    />
                  </>
                ) : (
                  <>
                    <IonButton
                      id="open-action-sheet-mod"
                      expand="block"
                      shape="round"
                      fill="outline"
                    >
                      Cambiar Círculo
                    </IonButton>
                    <IonButton
                      id="open-action-sheet-del"
                      expand="block"
                      shape="round"
                      fill="outline"
                      className="mt-3"
                    >
                      Eliminar Contacto
                    </IonButton>
                    <IonButton
                      id="open-action-sheet-block"
                      expand="block"
                      shape="round"
                      fill="outline"
                      className="mt-3"
                    >
                      Bloquear
                    </IonButton>
                    <IonActionSheet
                      trigger="open-action-sheet-del"
                      className="custom-action-sheet"
                      header={
                        "¿Quieres Eliminar a " +
                        user.profile.name +
                        " de tu Círculo?"
                      }
                      buttons={[
                        {
                          text: "Eliminar",
                          role: "destructive",
                          data: {
                            action: "delete",
                          },
                          handler: () => {
                            aloha();
                           
                          },
                        },
                        {
                          text: "Cancelar",
                          role: "cancel",
                          data: {
                            action: "cancel",
                          },
                        },
                      ]}
                    />
                    <IonActionSheet
                      trigger="open-action-sheet-block"
                      className="custom-action-sheet"
                      header={"¿Quieres bloquear a " + user.profile.name + " ?"}
                      buttons={[
                        {
                          text: "Bloquear",
                          role: "destructive",
                          data: {
                            action: "block",
                          },
                          handler: () => {
                            aloha();
                           
                          },
                        },
                        {
                          text: "Cancelar",
                          role: "cancel",
                          data: {
                            action: "cancel",
                          },
                        },
                      ]}
                    />
                    {relation.relation_type === "first" ? (
                      <IonActionSheet
                        trigger="open-action-sheet-mod"
                        className="custom-action-sheet"
                        header={
                          "¿Quieres añadir a " +
                          user.profile.name +
                          " a tu Círculo de Máxima Confianza?"
                        }
                        buttons={[
                          {
                            text: "Añadir",
                            role: "destructive",
                            data: {
                              action: "add",
                            },
                            handler: () => {
                              aloha();
                             
                            },
                          },
                          {
                            text: "Cancelar",
                            role: "cancel",
                            data: {
                              action: "cancel",
                            },
                          },
                        ]}
                      />
                    ) : (
                      <IonActionSheet
                        trigger="open-action-sheet-mod"
                        className="custom-action-sheet"
                        header={
                          "¿Quieres mover a " +
                          user.profile.name +
                          " a tu Círculo de Confianza?"
                        }
                        buttons={[
                          {
                            text: "Mover",
                            role: "destructive",
                            data: {
                              action: "add",
                            },
                            handler: () => {
                              aloha();
                             
                            },
                          },
                          {
                            text: "Cancelar",
                            role: "cancel",
                            data: {
                              action: "cancel",
                            },
                          },
                        ]}
                      />
                    )}
                  </>
                )
              ) : (
                <>
                  <IonButton
                    id="open-action-sheet-add"
                    expand="block"
                    shape="round"
                    fill="outline"
                  >
                    Añadir Contacto
                  </IonButton>
                  <IonActionSheet
                    trigger="open-action-sheet-add"
                    className="custom-action-sheet"
                    header={
                      "¿Quieres añadir a " +
                      user.profile.name +
                      " a tu círculo?"
                    }
                    buttons={[
                      {
                        text: "Añadir a Círculo de Confianza",
                        role: "destructive",
                        data: {
                          action: "add",
                        },
                        handler: () => {
                          aloha();
                         
                        },
                      },
                      {
                        text: "Añadir a Círculo de Máxima Confianza",
                        role: "destructive",
                        data: {
                          action: "add",
                        },
                        handler: () => {
                          aloha();
                         
                        },
                      },
                      {
                        text: "Cancelar",
                        role: "cancel",
                        data: {
                          action: "cancel",
                        },
                      },
                    ]}
                  />
                  <IonButton
                    id="open-action-sheet-block"
                    expand="block"
                    shape="round"
                    fill="outline"
                    className="mt-3"
                  >
                    Bloquear
                  </IonButton>
                  <IonActionSheet
                    trigger="open-action-sheet-block"
                    className="custom-action-sheet"
                    header={"¿Quieres bloquear a " + user.profile.name + " ?"}
                    buttons={[
                      {
                        text: "Bloquear",
                        role: "destructive",
                        data: {
                          action: "block",
                        },
                        handler: () => {
                          aloha();
                         
                        },
                      },
                      {
                        text: "Cancelar",
                        role: "cancel",
                        data: {
                          action: "cancel",
                        },
                      },
                    ]}
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
