import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import { URL } from "../../../constants";
import defaultAvatar from "../../../assets/default-avatar.jpg";
import { IonButton, IonIcon } from "@ionic/react";
import { call } from "ionicons/icons";
import "./CurrentRoute.css"
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGZlbGljZXMiLCJhIjoiY2x3ejZmZGxpMDQwbzJzc2Z6YzV3OWM4MiJ9.Zf9F1BMdCxy465v2ZdHuPQ";

export function CurrentRoute() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const profile = JSON.parse(localStorage.getItem("profile") || "");
  const userImage = URL + profile.profile_img_path;
  const markerRef = useRef(null);
  const clickMarkerRef = useRef(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const storedRoute = JSON.parse(localStorage.getItem("currentRoute"));
    if (!storedRoute) {
      console.error("No route found in localStorage");
      return;
    }

    const {
      distance,
      duration,
      coordinates,
      markerCoordinates,
      clickMarkerCoordinates,
      route,
    } = storedRoute;

    setDistance(distance);
    setDuration(duration);

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

    // Fetch the route and add it to the map
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
          "line-color": "#3887be",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });
    }

    map.current.on("load", fetchRoute);

    // Watch the user's position and update the marker
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

    // Cleanup on unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

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
          <p className="cuadro-map-text mb-0">Distancia: {distance}</p>
          <p className="cuadro-map-text mb-0">
            Duración aproximada: {duration}
          </p>
        </div>
      )}
      <a href="" className="text-decoration-none">
        <IonButton expand="full" className="emergency-call-button" color={"danger"}>
          <span className="mx-1 fw-bold">LAMAR 112</span> <IonIcon icon={call}></IonIcon>
        </IonButton>
      </a>
    </>
  );
}
