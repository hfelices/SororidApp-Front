import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import { API_URL, URL } from "../../../constants";
import defaultAvatar from "../../../assets/default-avatar.jpg";
import { IonButton, IonIcon, useIonRouter, useIonToast } from "@ionic/react";
import { call } from "ionicons/icons";
import "./CurrentRoute.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGZlbGljZXMiLCJhIjoiY2x3ejZmZGxpMDQwbzJzc2Z6YzV3OWM4MiJ9.Zf9F1BMdCxy465v2ZdHuPQ";

export function CurrentRoute() {
  const router = useIonRouter();
  const [present] = useIonToast();
  const mapContainer = useRef(null);
  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const map = useRef(null);
  const profile = JSON.parse(localStorage.getItem("profile") || "");
  const userImage = URL + profile.profile_img_path;
  const markerRef = useRef(null);
  const clickMarkerRef = useRef(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [routeId, setRouteId] = useState("");
  const [estimatedEndTime, setEstimatedEndTime] = useState(null);
  const intervalId = useRef(null); // Use useRef to hold the interval ID

  const presentToast = (message, myclass) => {
    present({
      message: message,
      duration: 1500,
      position: "middle",
      cssClass: myclass,
    });
  };

  useEffect(() => {
    const storedRoute = JSON.parse(localStorage.getItem("currentRoute"));
    if (!storedRoute) {
      router.push("/");
      return;
    }

    const {
      distance,
      duration,
      coordinates,
      markerCoordinates,
      clickMarkerCoordinates,
      route,
      time_estimated,
      route_id,
    } = storedRoute;

    setDistance(distance);
    setDuration(duration);
    setRouteId(route_id);
    setEstimatedEndTime(time_estimated);

    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [coordinates.lng, coordinates.lat],
      zoom: 13,
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

    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat([markerCoordinates.lng, markerCoordinates.lat])
      .addTo(map.current);

    clickMarkerRef.current = new mapboxgl.Marker({
      color: "#85267c",
    })
      .setLngLat([clickMarkerCoordinates.lng, clickMarkerCoordinates.lat])
      .addTo(map.current);

    async function fetchRoute() {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${route.origin.join(
          ","
        )};${route.destination.join(
          ","
        )}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const routeData = data.routes[0].geometry;

      map.current.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: routeData,
          },
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#85267c",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });
    }

    map.current.on("load", fetchRoute);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        markerRef.current.setLngLat([longitude, latitude]);
      },
      (error) => {
        //console.error("Error watching position: ", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [router, profile.profile_img_path, userImage]);

  useEffect(() => {
    if (routeId != "") {
      intervalId.current = setInterval(() => {
        updatePosition();
      }, 20000);
    }
  }, [routeId]);

  const endRoute = async () => {
    const now = formatDateTime(new Date());
    try {
      const response = await fetch(API_URL + "routes/" + routeId, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          status: "ended",
          time_end: now,
        }),
      });
      const responseData = await response.json();
      if (responseData.success === true) {
        //console.log("OK! Mensaje:", responseData);
        clearInterval(intervalId.current);
        presentToast("Ruta finalizada correctamente", "sororidad");
        localStorage.removeItem("currentRoute");
        router.push("/");
      } else {
        //console.log("Error! Mensaje:", responseData);
      }
    } catch (error) {
      //console.error("Error al realizar la solicitud:", error);
    }
  };

  const updatePosition = async () => {
    try {
      const response = await fetch(API_URL + "routes/" + routeId, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          coordinates_lon_now: markerRef.current.getLngLat().lng,
          coordinates_lat_now: markerRef.current.getLngLat().lat,
        }),
      });
      const responseData = await response.json();
      if (responseData.success === true) {
        const now = new Date();
        const formattedDate =
          now.getFullYear() +
          "-" +
          ("0" + (now.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + now.getDate()).slice(-2) +
          " " +
          ("0" + now.getHours()).slice(-2) +
          ":" +
          ("0" + now.getMinutes()).slice(-2) +
          ":" +
          ("0" + now.getSeconds()).slice(-2);

        if (
          responseData.data.status == "active" &&
          formattedDate > responseData.data.time_user_end
        ) {
          createWarning();
        }
        //console.log("OK! Mensaje:", responseData);
      } else {
        //console.log("Error! Mensaje:", responseData);
      }
    } catch (error) {
      //console.error("Error al realizar la solicitud:", error);
    }
  };

  const createWarning = async () => {
    try {
      const response = await fetch(API_URL + "routes/" + routeId, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          status: "alarm",
        }),
      });
      const responseData = await response.json();
      if (responseData.success === true) {
        //console.log("OK! Mensaje:", responseData);
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
      <div ref={mapContainer} style={{ width: "100%", height: "95vh" }} />
      {distance && duration && (
        <div
          style={{
            position: "absolute",
            padding: "3px",
            top: 15,
            left: 15,
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
      <div className="d-flex">
        <IonButton
          expand="full"
          color={"sororidark"}
          className="route-button"
          onClick={endRoute}
        >
          <span className="mx-1 fw-bold">Finalizar Ruta</span>
        </IonButton>
        <a href="" className="text-decoration-none">
          <IonButton expand="full" color={"danger"} className="route-button">
            <span className="mx-1 fw-bold">LLAMAR 112</span>{" "}
            <IonIcon icon={call}></IonIcon>
          </IonButton>
        </a>
      </div>
    </>
  );
}
