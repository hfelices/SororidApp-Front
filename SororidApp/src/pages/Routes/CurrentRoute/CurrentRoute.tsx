import React, { useEffect, useState } from 'react';
import { Map } from "../../../components";
import { IonButton, IonIcon } from '@ionic/react';
import { call } from 'ionicons/icons';

export function CurrentRoute() {
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('currentRoute');
    if (data) {
      setRouteData(JSON.parse(data));
    }
  }, []);

  if (!routeData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Map
        customHeight="79vh"
        cuadroHeight={15}
        editableMap={false}
        initialCoordinates={routeData.coordinates}
        markerCoordinates={routeData.markerCoordinates}
        clickMarkerCoordinates={routeData.clickMarkerCoordinates}
        distance={routeData.distance}
        duration={routeData.duration}
        route={routeData.route}
        interactive={false}  // Pass an additional prop to disable interaction
      />
      <a href="tel:112" className="text-decoration-none"> 
        <IonButton expand="full" color={"danger"} className="emergency-call-button">
          <span className="mx-1 fw-bold">LLAMAR 112</span><IonIcon className="mx-1" icon={call}></IonIcon>
        </IonButton>
      </a>
    </div>
  );
}
