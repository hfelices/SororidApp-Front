import {
  IonActionSheet,
  IonAvatar,
  IonButton,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSpinner,
  IonText,
} from "@ionic/react";
import defaultAvatar from "../../../assets/default-avatar.jpg";
import "./Pending.css";
import { useEffect, useState } from "react";
import { API_URL, URL } from "../../../constants";
import { Spinner } from "../../../components";

export function Pending() {
  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const user = JSON.parse(localStorage.getItem("user") || "");
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.log(responseData);

        setRelations(responseData.data);
        setLoading(false);
      } else {
        console.log("Error! Mensaje:", responseData);
        return [];
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      return [];
    }
  };

  useEffect(() => {
    getPendingRelations();
  }, []);
  return (
    <>
      <IonItem>
        <IonHeader class="h5 text-center fw-bold">
          <IonText color="sororidark">Solicitudes Pendientes</IonText>
        </IonHeader>
      </IonItem>
      {loading ? (
        <Spinner />
      ) : (
        <IonList className="ion-padding">
          {relations.length > 0 ? (
            relations.map((relation, idx) => (
              <IonItem className="text-center" id="open-action-sheet-handle">
                <IonAvatar className="mx-2" slot="start">
                  <img
                    src={
                      relation.profile.profile_img_path
                        ? URL + relation.profile.profile_img_path
                        : defaultAvatar
                    }
                    alt="avatar"
                  />
                </IonAvatar>
                <IonLabel className="text-center fw-bold" color={"sororidark"}>
                  {relation.profile.name}
                </IonLabel>

                <IonActionSheet
                  trigger="open-action-sheet-handle"
                  className="custom-action-sheet"
                  header={
                    "¿Quieres aceptar la solicitud de " +
                    relation.profile.name +
                    "?"
                  }
                  buttons={[
                    {
                      text: "Aceptar",
                      role: "destructive",
                      data: {
                        action: "delete",
                      },
                      handler: () => {
                        console.log("aloha");
                      },
                    },
                    {
                      text: "Rechazar",
                      role: "destructive",
                      data: {
                        action: "delete",
                      },
                      handler: () => {
                        console.log("aloha");
                      },
                    },
                    {
                      text: "Cancelar",
                      role: "cancel",
                      data: {
                        action: "cancel",
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
              </IonItem>
            ))
          ) : (
            <IonItem className="text-center">
              <IonLabel className="text-center fw-bold" color={"sororidark"}>
                {" "}
                No tienes solicitudes pendientes
              </IonLabel>
            </IonItem>
          )}
        </IonList>
      )}
    </>
  );
}
