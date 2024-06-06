import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import mapboxgl from "mapbox-gl";
import { Geolocation } from "@capacitor/geolocation";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import defaultAvatar from "../../assets/default-avatar.jpg";
import { URL } from "../../constants";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGZlbGljZXMiLCJhIjoiY2x3ejZmZGxpMDQwbzJzc2Z6YzV3OWM4MiJ9.Zf9F1BMdCxy465v2ZdHuPQ";

export const Map = forwardRef(({ customHeight, cuadroHeight, editableMap, initialCoordinates, markerCoordinates, clickMarkerCoordinates, distance: initialDistance, duration: initialDuration, route: initialRoute }, ref) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const user = JSON.parse(localStorage.getItem("user") || "");
  const profile = JSON.parse(localStorage.getItem("profile") || "");
  const userImage = URL + profile.profile_img_path;
  const [lng, setLng] = useState(initialCoordinates ? initialCoordinates.lng : 1.714000881976927);
  const [lat, setLat] = useState(initialCoordinates ? initialCoordinates.lat : 41.22444581830675);
  const [zoom, setZoom] = useState(13);
  const [showAlert, setShowAlert] = useState(false);
  const [distance, setDistance] = useState(initialDistance || "");
  const [duration, setDuration] = useState(initialDuration || "");
  const markerRef = useRef(null);
  const clickMarkerRef = useRef(null);
  const directions = useRef(null);

  useImperativeHandle(ref, () => ({
    getDistance: () => distance,
    getDuration: () => duration,
    getCoordinates: () => ({ lng, lat }),
    getMarkerCoordinates: () => markerRef.current.getLngLat(),
    getClickMarkerCoordinates: () => clickMarkerRef.current ? clickMarkerRef.current.getLngLat() : null,
    getRoute: () => directions.current.getRoute(),
  }));

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
      controls: {
        inputs: editableMap,
        instructions: false,
      },
    });

    map.current.addControl(directions.current, "top-left");

    // Hide the origin and destination markers
    const hideMarkers = () => {
      const originMarker = document.querySelector(".mapbox-directions-origin");
      const destinationMarker = document.querySelector(
        ".mapbox-directions-destination"
      );
      if (originMarker) originMarker.style.display = "none";
      if (destinationMarker) destinationMarker.style.display = "none";
    };

    directions.current.on("origin", hideMarkers);
    directions.current.on("destination", hideMarkers);

    // Set initial marker positions if provided
    if (markerCoordinates) {
      markerRef.current.setLngLat(markerCoordinates).addTo(map.current);
    }

    if (clickMarkerCoordinates) {
      clickMarkerRef.current = new mapboxgl.Marker({
        color: "#85267c",
      })
        .setLngLat(clickMarkerCoordinates)
        .addTo(map.current);
    }

    // Set initial route if provided
    if (initialRoute) {
      directions.current.setOrigin(initialRoute.origin);
      directions.current.setDestination(initialRoute.destination);
    }
  }, [lng, lat, zoom, markerCoordinates, clickMarkerCoordinates, initialRoute, editableMap]);

  useEffect(() => {
    const watchId = Geolocation.watchPosition({}, (position, err) => {
      if (position) {
        const newLng = position.coords.longitude;
        const newLat = position.coords.latitude;
        setLng(newLng);
        setLat(newLat);
        if (markerRef.current) {
          markerRef.current.setLngLat([newLng, newLat]);
        }
        if (directions.current) {
          directions.current.setOrigin([newLng, newLat]);
        }
        if (map.current) {
          map.current.setCenter([newLng, newLat]);
        }
      }
      if (err) {
        console.error("Error watching position:", err);
      }
    });

    return () => {
      Geolocation.clearWatch({ id: watchId });
    };
  }, []);

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: customHeight }} />
      {distance && duration && (
        <div
          style={{
            position: "absolute",
            padding: "3px",
            top: cuadroHeight,
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
    </div>
  );
});
