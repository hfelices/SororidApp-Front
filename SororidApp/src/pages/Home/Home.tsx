import  { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonAlert } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGZlbGljZXMiLCJhIjoiY2x3ejZmZGxpMDQwbzJzc2Z6YzV3OWM4MiJ9.Zf9F1BMdCxy465v2ZdHuPQ';

export function Home() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(1.714000881976927);
  const [lat, setLat] = useState(41.22444581830675);
  const [zoom] = useState(9);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        let permissionStatus = await Geolocation.checkPermissions();

        if (permissionStatus.location !== 'granted') {
          permissionStatus = await Geolocation.requestPermissions();
        }

        if (permissionStatus.location === 'granted') {
          const position = await Geolocation.getCurrentPosition();
          setLng(position.coords.longitude);
          setLat(position.coords.latitude);
          console.log(lng);
          console.log(lat);
          
        } else {
          setShowAlert(true);
        }
      } catch (error) {
        console.error('Error getting location:', error);
        setShowAlert(true);
      }
    };

    checkPermissions();
  }, []);

  useEffect(() => {
    if (map.current) {
      map.current.setCenter([lng, lat]);
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.current);
  }, [lng, lat, zoom]);

  return (
    <div>
      <p>{lng}</p>
      <p>{lat}</p>
      
          <div ref={mapContainer} style={{ width: '100%', height: '88vh' }} />
        
     
    </div>
  );
}
