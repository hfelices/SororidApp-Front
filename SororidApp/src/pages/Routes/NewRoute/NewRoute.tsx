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
} from "@ionic/react";
import mapboxgl from "mapbox-gl";
import { Geolocation } from "@capacitor/geolocation";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import defaultAvatar from "../../../assets/default-avatar.jpg";
import { URL } from "../../../constants";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGZlbGljZXMiLCJhIjoiY2x3ejZmZGxpMDQwbzJzc2Z6YzV3OWM4MiJ9.Zf9F1BMdCxy465v2ZdHuPQ";

export function NewRoute() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const user = JSON.parse(localStorage.getItem("user") || "");
  const profile = JSON.parse(localStorage.getItem("profile") || "");
  const userImage = URL + profile.profile_img_path;
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
        console.error("Error getting location:", error);
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
    });

    directions.current.on("route", (e) => {
      const route = e.route[0];
      setDistance((route.distance / 1000).toFixed(2) + " km");
      setDuration((route.duration / 60).toFixed(2) + " min");
      setRoute({
        origin: route.legs[0].steps[0].maneuver.location,
        destination: route.legs[0].steps[route.legs[0].steps.length - 1].maneuver.location,
        distance: route.distance,
        duration: route.duration
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

  const saveCurrentRoute = () => {
    if (route) {
      const routeData = {
        distance,
        duration,
        coordinates: { lng, lat },
        markerCoordinates: markerRef.current.getLngLat(),
        clickMarkerCoordinates: clickMarkerRef.current ? clickMarkerRef.current.getLngLat() : null,
        route
      };
      localStorage.setItem('currentRoute', JSON.stringify(routeData));
    }
  };

  return (
    <>
      <IonItem>
        <IonHeader className="h5 text-center fw-bold">
          <IonButton onClick={saveCurrentRoute}>Test</IonButton>
          <a href="/current-route">
            <IonButton onClick={saveCurrentRoute}>Current Route</IonButton>
          </a>
        </IonHeader>
      </IonItem>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel color={"sororidark"}>Hora de llegada</IonLabel>
          <IonDatetimeButton datetime={"time"} />
          <IonModal keepContentsMounted={true}>
            <IonDatetime
              showDefaultButtons={true}
              doneText="Seleccionar"
              cancelText="Cancelar"
              presentation="time"
              formatOptions={{
                time: { hour: "2-digit", minute: "2-digit" },
              }}
              id="time"
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
          >
            <IonSelectOption value="female">Máxima Confianza</IonSelectOption>
            <IonSelectOption value="male">Confianza</IonSelectOption>
            <IonSelectOption value="nonbinary">Confianza Extendida</IonSelectOption>
          </IonSelect>
        </IonItem>
        <div ref={mapContainer} style={{ width: "100%", height: "60vh" }} />
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
            <p className="cuadro-map-text mb-0">Duración aproximada: {duration}</p>
          </div>
        )}
      </IonContent>
    </>
  );
}
