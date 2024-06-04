import {
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
import { Map } from "../../../components";

export function NewRoute() {
  return (
    <>
      <IonItem>
        <IonHeader class="h5 text-center fw-bold">
          <IonText color="sororidark">Opciones del Recorrido</IonText>
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
            // value={formik.values.sexo}
            // onIonChange={(e) =>
            //   formik.setFieldValue("sexo", e.detail.value)
            // }
            interface="popover"
          >
            <IonSelectOption value="female">Máxima Confianza</IonSelectOption>
            <IonSelectOption value="male">Confianza</IonSelectOption>
            <IonSelectOption value="nonbinary">Confianza Extendida</IonSelectOption>
          </IonSelect>
        </IonItem>
      <Map customHeight={"60vh"}/>
      </IonContent>
    </>
  );
}
