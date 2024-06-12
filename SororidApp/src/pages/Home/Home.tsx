import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonRow,
  IonText,
  IonTitle,
} from "@ionic/react";
import { URL, API_URL } from "../../constants";
import { Spinner } from "../../components";
import defaultAvatar from "../../assets/default-avatar.jpg";
import "./Home.css";
import { Link } from "react-router-dom";
import { refreshOutline, warningOutline } from "ionicons/icons";
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGZlbGljZXMiLCJhIjoiY2x3ejZmZGxpMDQwbzJzc2Z6YzV3OWM4MiJ9.Zf9F1BMdCxy465v2ZdHuPQ";

export function Home() {
  const [routes, setRoutes] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const authToken = JSON.parse(localStorage.getItem("authToken") || "{}");
  const [loading, setLoading] = useState(true);
  const [canRefresh, setCanRefresh] = useState(true);

  const getRoutes = async () => {
    try {
      const response = await fetch(`${API_URL}routes/${user.id}/explore`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const responseData = await response.json();

      if (responseData.success) {
        setRoutes(responseData.data);
        setLoading(false);
      } else if (responseData.message == "No routes available.") {
        setRoutes([]);
        setLoading(false);
      } else {
        //console.error("Error! Mensaje:", responseData);
      }
    } catch (error) {
      //console.error("Error al realizar la solicitud:", error);
    }
  };
  const refreshList = () => {
    setLoading(true);
    if (!canRefresh) return; // Si no se puede refrescar, no hacer nada

    setCanRefresh(false); // Deshabilitar el botón
    getRoutes();
    setTimeout(() => {
      setCanRefresh(true);
    }, 30000);
  };

  useEffect(() => {
    getRoutes();
  }, []);

  return (
    <>
      <IonContent className="ion-padding">
        <a href="/new-route" className="text-decoration-none">
          <IonButton
            expand="block"
            className="mt-3 my-large-button"
            shape="round"
            fill="outline"
          >
            Iniciar Ruta
          </IonButton>
        </a>

        {loading ? (
          <Spinner />
        ) : (
          <div className="d-flex flex-column">
            <IonButton
              onClick={refreshList}
              color={"sororidark"}
              disabled={!canRefresh}
              shape="round"
              className="my-large-button"
            >
              <span className="mx-1">
                {canRefresh
                  ? "Refrescar Lista"
                  : "Espera 30 segundos para volver a refrescar"}
              </span>{" "}
              <IonIcon color="light" icon={refreshOutline} />
            </IonButton>
            {routes.length > 0 ? (
              <>
                <IonText
                  className="text-center mt-5 fw-bold home-routes-title"
                  color={"sororidark"}
                >
                  Rutas en curso.
                </IonText>
                {routes.map((route, index) => (
                  <div key={index}>
                    <Link
                      to={`/view-route/${route.route.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <IonCard
                        className={
                          route.route.status == "active"
                            ? "route-card"
                            : "alarm-card"
                        }
                      >
                        <IonGrid>
                          <IonRow>
                            <IonCol size="4">
                              <img
                                className="route-explore-img"
                                src={
                                  route.profile.profile_img_path
                                    ? URL + route.profile.profile_img_path
                                    : defaultAvatar
                                }
                                alt="Image"
                              />
                            </IonCol>
                            <IonCol>
                              <IonCardTitle
                                color={"sororidark"}
                                className="text-center"
                              >
                                {route.profile.name}
                              </IonCardTitle>

                              {route.route.status == "active" ? (
                                <IonText color={"sororilight"}>
                                  Hora de llegada: {route.route.time_user_end}
                                </IonText>
                              ) : (
                                <div className="d-flex flex-column justify-content-center">
                                  <p className="warning-text text-center text-danger fw-bold h6">
                                    ALARMA EN CURSO
                                  </p>
                                  <IonIcon color="danger" icon={warningOutline} className="warning-icon mt-0" />
                                  <p className="warning-text text-center text-danger fw-bold h6">
                                    VERIFICA SU ESTADO
                                  </p>
                                </div>
                              )}
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonCard>
                    </Link>
                  </div>
                ))}
              </>
            ) : (
              <IonText
                className="text-center mt-5 fw-bold home-routes-title"
                color={"sororidark"}
              >
                No hay rutas en curso.
              </IonText>
            )}
          </div>
        )}
      </IonContent>
    </>
  );
}
