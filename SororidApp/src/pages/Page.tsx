import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams } from "react-router";

import "./Page.css";

const Page: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  return (
    <>
      
        <IonTitle size="small">{name}</IonTitle>
        <IonTitle size="small">{name}</IonTitle>
        <IonTitle size="small">{name}</IonTitle>
        <IonTitle size="small">{name}</IonTitle>
      
    </>
  );
};

export default Page;
