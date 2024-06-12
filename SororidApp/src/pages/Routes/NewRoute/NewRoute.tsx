import React, { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import mapboxgl from "mapbox-gl";
import { Geolocation } from "@capacitor/geolocation";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import defaultAvatar from "../../../assets/default-avatar.jpg";
import { API_URL, URL } from "../../../constants";
import "./NewRoute.css"

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGZlbGljZXMiLCJhIjoiY2x3ejZmZGxpMDQwbzJzc2Z6YzV3OWM4MiJ9.Zf9F1BMdCxy465v2ZdHuPQ";

export function NewRoute() {
  const router = useIonRouter();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const user = JSON.parse(localStorage.getItem("user") || "");
  const profile = JSON.parse(localStorage.getItem("profile") || "");
  const userImage = URL + profile.profile_img_path;
  const [disabledDateTime, setdisabledDateTime] = useState(true);
  const [estimatedEndTime, setEstimatedEndTime] = useState(null);
  const [selectedCircle, setSelectedCircle] = useState("second");
  const [timeUserEnd, setTimeUserEnd] = useState(null);
  const [lng, setLng] = useState(1.714000881976927);
  const [lat, setLat] = useState(41.22444581830675);
  const [zoom, setZoom] = useState(13);
  const [showAlert, setShowAlert] = useState(false);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const markerRef = useRef(null);
  const clickMarkerRef = useRef(null);
  const directions = useRef(null);
  const [route, setRoute] = useState(null);

  const [present] = useIonToast();

  const presentToast = (message, myclass) => {
    present({
      message: message,
      duration: 1500,
      position: "middle",
      cssClass: myclass,
    });
  };

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        let permissionStatus = await Geolocation.checkPermissions();

        if (permissionStatus.location !== "granted") {
          permissionStatus = await Geolocation.requestPermissions();
        }

        if (permissionStatus.location === "granted") {
          const position = await Geolocation.getCurrentPosition();
          setLng(position.coords.longitude);
          setLat(position.coords.latitude);
        } else {
          setShowAlert(true);
        }
      } catch (error) {
        //console.error("Error getting location:", error);
        setShowAlert(true);
      }
    };

    checkPermissions();
  }, []);

  useEffect(() => {
    if (map.current) {
      map.current.setCenter([lng, lat]);
      markerRef.current.setLngLat([lng, lat]);
      directions.current.setOrigin([lng, lat]);
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    const el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = `url(${
      profile.profile_img_path ? userImage : defaultAvatar
    })`;
    el.style.width = "50px";
    el.style.height = "50px";
    el.style.backgroundSize = "cover";
    el.style.borderRadius = "50%";

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
    }).setHTML(
      `<style>
        .mapboxgl-popup-content{
        height: 5vh;
        display:flex;
        align-items: center;
        background-color:#85267c ;
        color: white;
      }
        </style>
        <h6>Estás aquí</h6>`
    );

    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map.current);

    // Mostrar el popup automáticamente
    popup.addTo(map.current);

    directions.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/walking",
      alternatives: false,
      controls: {
        inputs: false,
        instructions: false,
      },
    });

    map.current.addControl(directions.current, "top-left");

    map.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      if (clickMarkerRef.current) {
        clickMarkerRef.current.remove();
      }
      clickMarkerRef.current = new mapboxgl.Marker({
        color: "#85267c",
      })
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Add the destination to the directions
      directions.current.setDestination([lng, lat]);
      setdisabledDateTime(false);
    });

    directions.current.on("route", (e) => {
      const route = e.route[0];
      const routeDuration = (route.duration / 60).toFixed(2);
      setDistance((route.distance / 1000).toFixed(2) + " km");
      setDuration(routeDuration + " min");

      const currentTime = new Date();
      const estimatedTime = new Date(
        currentTime.getTime() + route.duration * 1000
      );

      // Hora GMT
      setEstimatedEndTime(estimatedTime.toISOString());

      // Horas GMT+0200
      const estimatedTimePlus2Hours = new Date(
        estimatedTime.getTime() + 2 * 60 * 60 * 1000
      );
      setTimeUserEnd(estimatedTimePlus2Hours.toISOString());

      setRoute({
        origin: route.legs[0].steps[0].maneuver.location,
        destination:
          route.legs[0].steps[route.legs[0].steps.length - 1].maneuver.location,
        distance: route.distance,
        duration: route.duration,
      });

      // Change the main route color
      const routeLayer = map.current.getLayer("directions-route-line");
      if (routeLayer) {
        map.current.setPaintProperty(
          "directions-route-line",
          "line-color",
          "#9984b8"
        );
      }
      // Change the casing (outline) route color
      const routeLayerCasing = map.current.getLayer(
        "directions-route-line-casing"
      );
      if (routeLayerCasing) {
        map.current.setPaintProperty(
          "directions-route-line-casing",
          "line-color",
          "#85267c"
        );
      }
    });
  }, [lng, lat, zoom]);

  const handleTimeChange = (event) => {
    // Horas GMT+0200
    const selectedTime = new Date(event.detail.value);
    const estimatedTime = new Date(estimatedEndTime);

    // Obtener las horas y minutos de cada tiempo
    const selectedHours = selectedTime.getHours();
    const selectedMinutes = selectedTime.getMinutes();
    const estimatedHours = estimatedTime.getHours();
    const estimatedMinutes = estimatedTime.getMinutes();

    // Calcular la diferencia en minutos
    const selectedTotalMinutes = selectedHours * 60 + selectedMinutes;
    const estimatedTotalMinutes = estimatedHours * 60 + estimatedMinutes;

    // Calcular la diferencia en minutos y ajustar para que esté en el rango correcto
    const differenceInMinutes = selectedTotalMinutes - estimatedTotalMinutes;

    // Convertir la diferencia a horas
    const differenceInHours = differenceInMinutes / 60;

    // Verificar si la diferencia es mayor a 1 hora o menor que 0 minutos
    if (differenceInMinutes < 0 || differenceInMinutes > 60) {
      presentToast(
        "La hora seleccionada difiere en más de 60 minutos de la hora estimada.",
        "sororidad"
      );
      //console.log("");
    } else {
      // Ajustar la hora local
      const localTime = new Date(selectedTime.getTime());
      localTime.setHours(localTime.getHours() + 2);
      setTimeUserEnd(localTime.toISOString());
    }
  };

  const saveCurrentRoute = async () => {
    try {
      const formattedEstimatedEndTime = formatDateTime(estimatedEndTime);
      let formattedTimeUserEnd = new Date(timeUserEnd);
      formattedTimeUserEnd.setHours(formattedTimeUserEnd.getHours() - 2);
      formattedTimeUserEnd = formatDateTime(formattedTimeUserEnd);
  
      const numericDuration = parseFloat(duration); // Convertir la duración a un número
      const numericDistance = parseFloat(distance); // Convertir la distancia a un número
  
      const response = await fetch(API_URL + "routes", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          coordinates_lat_start: markerRef.current.getLngLat().lat,
          coordinates_lon_start: markerRef.current.getLngLat().lng,
          coordinates_lat_end: clickMarkerRef.current.getLngLat().lat,
          coordinates_lon_end: clickMarkerRef.current.getLngLat().lng,
          distance: numericDistance, // Enviar como número
          duration: numericDuration, // Enviar como número
          time_estimated: formattedEstimatedEndTime,
          time_user_end: formattedTimeUserEnd,
          time_end: null,
          user: user.id,
          share: selectedCircle,
          status: "active",
        }),
      });
      const responseData = await response.json();
      if (responseData.success === true) {
        //console.log("OK! Mensaje:", responseData);
        const routeData = {
          route_id: responseData.route.id,
          distance,
          duration,
          coordinates: { lng, lat },
          time_estimated: estimatedEndTime,
          markerCoordinates: markerRef.current.getLngLat(),
          clickMarkerCoordinates: clickMarkerRef.current
            ? clickMarkerRef.current.getLngLat()
            : null,
          route,
        };
        localStorage.setItem("currentRoute", JSON.stringify(routeData));
        router.push("/current-route");
      } else {
        //console.log("Error! Mensaje:", responseData);
      }
    } catch (error) {
      //console.error("Error al realizar la solicitud:", error);
    }
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };
  return (
    <>
      <IonHeader className="h5 text-center fw-bold map-header">
        {estimatedEndTime ? (
          <IonButton color={"sororidark"} onClick={saveCurrentRoute}>
            Iniciar Ruta
          </IonButton>
        ) : (
          <IonText color={"sororilight"}>

            <small>
              Pincha en el mapa para empezar tu ruta y selecciona con que
              círculo lo quieres compartir.
            </small>
          </IonText>
        )}
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel color={"sororidark"}>Hora de llegada</IonLabel>
          <IonDatetimeButton datetime={"time"} />
          <IonModal keepContentsMounted={true}>
            <IonDatetime
              showDefaultButtons={true}
              doneText="Seleccionar"
              cancelText="Cancelar"
              color={"sororidark"}
              disabled={disabledDateTime}
              value={timeUserEnd}
              presentation="time"
              formatOptions={{
                time: { hour: "2-digit", minute: "2-digit" },
              }}
              id="time"
              onIonChange={(e) => handleTimeChange(e)}
            >
              <span slot="title">Selecciona hora de llegada</span>
            </IonDatetime>
          </IonModal>
        </IonItem>
        <IonItem>
          <IonLabel color={"sororidark"}>Círculo</IonLabel>
          <IonSelect
            name="circle"
            interface="popover"
            value={selectedCircle}
            onIonChange={(e) => setSelectedCircle(e.detail.value)}
          >
            <IonSelectOption value="second">Máxima Confianza</IonSelectOption>
            <IonSelectOption value="first">Confianza</IonSelectOption>
            <IonSelectOption value="extended">
              Confianza Extendida
            </IonSelectOption>
          </IonSelect>
        </IonItem>
        <div ref={mapContainer} style={{ width: "100%", height: "63vh" }} />
        {distance && duration && (
          <div
            style={{
              position: "absolute",
              padding: "3px",
              top: 110,
              left: 20,
              backgroundColor: "#85267c",
              color: "white",
              borderRadius: "5px",
            }}
          >
            <p className="cuadro-map-text mb-0">Distancia: {distance}</p>
            <p className="cuadro-map-text mb-0">
              Duración aproximada: {duration}
            </p>
            <p className="cuadro-map-text mb-0">
              Hora estimada de llegada:{" "}
              {estimatedEndTime && formatTime(new Date(estimatedEndTime))}
            </p>
          </div>
        )}
      </IonContent>
    </>
  );
}
