import { useEffect, useRef, useState } from "react";
import "./Profile.css";

import image from "../../assets/neandermark.jpeg";
import {
  IonHeader,
  IonButtons,
  IonInput,
  IonAvatar,
  IonText,
  IonItem,
  IonIcon,
  IonContent,
  IonPage,
  IonModal,
  IonButton,
  IonDatetimeButton,
  IonDatetime,
} from "@ionic/react";
import { cameraOutline, createOutline } from "ionicons/icons";
import { FooterComponent, Menu } from "../../components";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import useUser from "../../hooks/useUser";
import { format } from "date-fns";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export function Profile() {
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);
  // const { user } = useUser();
  const user = JSON.parse(localStorage.getItem("user") || "");
  const genderMap: Record<string, string> = {
    female: "Mujer",
    male: "Hombre",
    nonbinary: "No binario",
  };
  var gender = genderMap[user.profile.gender];

  const fecha = user.profile.birthdate;
  const fechaFormateada = format(fecha, "dd-MM-yyyy");
  const [selectedDate, setSelectedDate] = useState(user.profile.birthdate);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
  }, [user]);

  const validationSchema = Yup.object().shape({
    fechaNacimiento: Yup.string().required("Fecha de Nacimiento es requerida"),
    ciudad: Yup.string().required("Ciudad es requerida"),
    sexo: Yup.string().required("Sexo es requerido"),
    contraseñaEmergencia: Yup.string().required(
      "Contraseña de Emergencia es requerida"
    ),
  });

  // Función para manejar el envío del formulario
  const handleSubmit = (values: any, { setSubmitting }) => {
    // Aquí puedes enviar los datos a tu backend para actualizar la información
    console.log("Datos actualizados:", values);
    // Puedes resetear los estados o mostrar un mensaje de éxito aquí
    setSubmitting(false);
  };

  const openCamera = async () => {
    console.log("aloha");
    console.log(user);
    const response = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    if (response.webPath) {
      console.log(response.webPath);
    }
  };

  async function canDismiss(data?: any, role?: string) {
    return role !== "gesture";
  }
  return (
    <>
      <IonPage>
        <IonHeader className="profile_header ion-padding ">
          <div className="d-flex justify-content-center align-items-center">
            <IonAvatar>
              <img src={image} alt="" />
            </IonAvatar>
            <IonButton fill="clear" onClick={openCamera}>
              <IonIcon
                className="profile_icon"
                slot="icon-only"
                icon={cameraOutline}
              />
            </IonButton>
          </div>

          <IonItem>
            <IonText className="mt-2">{user.data.email}</IonText>
          </IonItem>
        </IonHeader>

        <IonContent className="ion-padding">
          <Formik
            initialValues={{
              nombre: user.profile.name,
              fechaNacimiento: fechaFormateada,
              ciudad: user.profile.town,
              sexo: gender,
              contraseñaEmergencia: user.profile.alert_password,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <IonItem className="profile_info_row">
                  <span>Nombre: </span>
                  <Field as={IonInput} className="profile_text" name="nombre" />
                </IonItem>
                <IonItem className="profile_info_row ">
                  <span>Fecha de Nacimiento: </span>
                  <Field
                    as={IonInput}
                    className="d-none"
                    name="fechaNacimiento"
                  />
                  <IonDatetimeButton datetime={"time"} className="mx-4" />
                  <IonModal keepContentsMounted={true}>
                    <IonDatetime
                      showDefaultButtons={true}
                      doneText="Seleccionar"
                      cancelText="Cancelar"
                      value={selectedDate}
                      presentation="date"
                      id="time"
                      onIonChange={(e) =>
                        setSelectedDate(new Date(e.detail.value!))
                      }
                    >
                      <span slot="title">Fecha de Nacimiento</span>
                    </IonDatetime>
                  </IonModal>
                </IonItem>

                <IonItem className="profile_info_row">
                  <span>Ciudad: </span>
                  <Field as={IonInput} className="profile_text" name="ciudad" />
                </IonItem>

                <IonItem className="profile_info_row">
                  <span>Sexo: </span>
                  <Field as={IonInput} className="profile_text" name="sexo" />
                </IonItem>

                <IonItem className="profile_info_row">
                  <span>Contraseña de Emergencia: </span>
                  <Field
                    as={IonInput}
                    type="password"
                    className="profile_text"
                    name="contraseñaEmergencia"
                  />
                </IonItem>

                <IonButton
                  expand="block"
                  className="mt-3 my-large-button"
                  type="submit"
                  shape="round"
                  fill="outline"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Actualizar"}
                </IonButton>
              </Form>
            )}
          </Formik>
        </IonContent>
        <FooterComponent />
      </IonPage>
    </>
  );
}
