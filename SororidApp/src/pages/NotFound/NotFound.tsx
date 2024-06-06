// src/pages/NotFound.js
import React from 'react';
import { IonPage, IonContent, IonButton, IonText, IonImg } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const NotFound = () => {
  const history = useHistory();

  const goToHome = () => {
    history.push('/home');
  };

  return (
    <IonPage className='mt-5'>
      <IonContent className="ion-text-center ion-padding ">
        <IonText color="sororidark">
          <h1>Oops!</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        </IonText>
        <IonButton expand="block" onClick={goToHome}>
          Go to Home
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
