import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Geolocation } from "@capacitor/geolocation";
import defaultAvatar from "../../assets/default-avatar.jpg";
import { URL } from "../../constants";
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGZlbGljZXMiLCJhIjoiY2x3ejZmZGxpMDQwbzJzc2Z6YzV3OWM4MiJ9.Zf9F1BMdCxy465v2ZdHuPQ";

export function Map({ customHeight}) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const authToken = JSON.parse(localStorage.getItem("authToken") || "");
    const user = JSON.parse(localStorage.getItem("user") || "");
    const profile = JSON.parse(localStorage.getItem("profile") || "");
    const userImage = URL + profile.profile_img_path;
    const [lng, setLng] = useState(1.714000881976927);
    const [lat, setLat] = useState(41.22444581830675);
    const [zoom] = useState(13);
    const [showAlert, setShowAlert] = useState(false);
  
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
            console.log(lng);
            console.log(lat);
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
        map.current._markers[0].setLngLat([lng, lat]);
  
        return;
      }
  
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: zoom,
      });
  
      new mapboxgl.Marker({
        color: "#85267c",
        draggable: true,
      })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ closeButton: false }).setHTML(
            `<style>
            .mapboxgl-popup-content{
              background-color:transparent;
              border-radius: 50%; 
            }
            </style>
            <img src=${
              profile.profile_img_path ? userImage : defaultAvatar
            } class='medium-avatar'/>`
          )
        )
  
        .addTo(map.current);
    }, [lng, lat, zoom]);
  
    return (
      <div>
        <div ref={mapContainer} style={{ width: "100%", height: customHeight }} />
      </div>
    );
  }
