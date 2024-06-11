import { useParams } from "react-router";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import { API_URL, URL } from "../../../constants";
import defaultAvatar from "../../../assets/default-avatar.jpg";
import { IonButton, IonIcon, useIonRouter } from "@ionic/react";
import "./ViewRoute.css";
import { refreshOutline } from "ionicons/icons";
import { Spinner } from "../../../components";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGZlbGljZXMiLCJhIjoiY2x3ejZmZGxpMDQwbzJzc2Z6YzV3OWM4MiJ9.Zf9F1BMdCxy465v2ZdHuPQ";

export function ViewRoute() {
  const { id } = useParams();
  const router = useIonRouter();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const clickMarkerRef = useRef(null);

  const [currentRoute, setCurrentRoute] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [routeId, setRouteId] = useState("");
  const [estimatedEndTime, setEstimatedEndTime] = useState(null);
  const [canRefresh, setCanRefresh] = useState(true); // Nuevo estado para controlar el temporizador

  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const profile = JSON.parse(localStorage.getItem("profile") || "");

  const getRoute = async () => {
    try {
      const response = await fetch(`${API_URL}routes/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const responseData = await response.json();
      if (responseData.success) {
        setCurrentRoute(responseData);
      } else {
        console.error("Error! Mensaje:", responseData);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const refreshPosition = async () => {
    if (!canRefresh) return; // Si no se puede refrescar, no hacer nada

    setCanRefresh(false); // Deshabilitar el botón

    try {
      const response = await fetch(`${API_URL}routes/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const responseData = await response.json();
      if (responseData.success) {
        setCurrentRoute(responseData);
        const {
          coordinates_lat_now,
          coordinates_lon_now,
        } = responseData.route;
        markerRef.current.setLngLat([coordinates_lon_now, coordinates_lat_now]);
        map.current.setCenter([coordinates_lon_now, coordinates_lat_now]);
      } else {
        console.error("Error! Mensaje:", responseData);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }

    // Rehabilitar el botón después de 30 segundos
    setTimeout(() => {
      setCanRefresh(true);
    }, 30000);
  };

  useEffect(() => {
    getRoute();
  }, [id]);

  useEffect(() => {
    if (!currentRoute) return;

    const {
      distance,
      duration,
      coordinates_lat_now,
      coordinates_lon_now,
      coordinates_lon_end,
      coordinates_lat_end,
      coordinates_lat_start,
      coordinates_lon_start,
      route_id,
    } = currentRoute.route;

    const { profile_img_path } = currentRoute.profile;
    setDistance(parseFloat(distance).toFixed(2));
    setDuration(parseFloat(duration).toFixed(2));
    setRouteId(route_id);

    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [coordinates_lon_now, coordinates_lat_now],
      zoom: 13,
    });

    const el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = `url(${
      profile_img_path ? URL + profile_img_path : defaultAvatar
    })`;
    el.style.width = "50px";
    el.style.height = "50px";
    el.style.backgroundSize = "cover";
    el.style.borderRadius = "50%";

    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat([coordinates_lon_now, coordinates_lat_now])
      .addTo(map.current);

    clickMarkerRef.current = new mapboxgl.Marker({
      color: "#85267c",
    })
      .setLngLat([coordinates_lon_end, coordinates_lat_end])
      .addTo(map.current);

    const fetchRoute = async () => {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${[
          coordinates_lon_start,
          coordinates_lat_start,
        ].join(",")};${[coordinates_lon_end, coordinates_lat_end].join(
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

      // Calculate estimated end time
      const currentTime = new Date();
      const estimatedTime = new Date(currentTime.getTime() + duration * 1000);
      setEstimatedEndTime(estimatedTime);
    };

    map.current.on("load", fetchRoute);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        markerRef.current.setLngLat([longitude, latitude]);
      },
      (error) => {
        console.error("Error watching position: ", error);
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
  }, [currentRoute]);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <>
      <div ref={mapContainer} style={{ width: "100%", height: "80vh" }} />

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
          <p className="cuadro-map-text mb-0">Distancia: {distance} km</p>
          <p className="cuadro-map-text mb-0">
            Duración aproximada: {duration} min
          </p>
          <p className="cuadro-map-text mb-0">
            Hora estimada de llegada:{" "}
            {estimatedEndTime && formatTime(new Date(estimatedEndTime))}
          </p>
        </div>
      )}
      <IonButton
        onClick={refreshPosition}
        color={"sororidark"}
        expand="full"
        className="route-refresh-button"
        disabled={!canRefresh} // Deshabilitar el botón si canRefresh es false
      >
        <span className="mx-1">{canRefresh ? "Refrescar Posición": "Espera 30 segundos para volver a refrescar"}</span>{" "}
        <IonIcon color="light" icon={refreshOutline} />
      </IonButton>
    </>
  );
}
