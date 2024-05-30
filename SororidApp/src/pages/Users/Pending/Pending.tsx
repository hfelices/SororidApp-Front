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
  useIonToast,
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
  const [change, setChange] = useState(false);
  const [present] = useIonToast();

  const presentToast = (message, myclass) => {
    present({
      message: message,
      duration: 1500,
      position: "middle",
      cssClass: myclass
    });
  };


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
        setRelations(responseData.data);
        setLoading(false);
      } else {
        console.log("Error! Mensaje:", responseData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      return [];
    }
  };
  const relationHandler = async (action, id, type) => {
    try {
      if (action == "accept") {
        const response = await fetch(`${API_URL}relations/${id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            status: "active",
            type: type,
          }),
        });
        const responseData = await response.json();
        if (responseData.success === true) {
            getPendingRelations();
            presentToast('Solicitud aceptada con éxito', 'green');
        } else {
          console.log("Error! Mensaje:", responseData);
          presentToast('Ha ocurrido un error, porfavor vuélvalo a intentar', 'red');
          return {};
        }
      } else if (action == "reject") {
        const response = await fetch(`${API_URL}relations/${id}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const responseData = await response.json();
        if (responseData.success === true) {
          getPendingRelations();
          presentToast('Solicitud rechazada con éxito', 'green');
        } else {
          console.log("Error! Mensaje:", responseData);
          presentToast('Ha ocurrido un error, porfavor vuélvalo a intentar', 'red');
          return {};
        }
      } else {
        console.log("invalid type" + type);
        presentToast('Ha ocurrido un error, porfavor vuélvalo a intentar', 'red');
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      presentToast('Ha ocurrido un error, porfavor vuélvalo a intentar', 'red');
      return {};
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
              <IonItem className="text-center" id={`open-action-sheet-${idx}`}>
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
                  trigger={`open-action-sheet-${idx}`}
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
                        relationHandler(
                          "accept",
                          relation.relation.id,
                          relation.relation.type
                        );
                      },
                    },
                    {
                      text: "Rechazar",
                      role: "destructive",
                      data: {
                        action: "delete",
                      },
                      handler: () => {
                        relationHandler(
                          "reject",
                          relation.relation.id,
                          relation.relation.type
                        );
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
