import { useFormik } from "formik";
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
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { cameraOutline } from "ionicons/icons";
import { FooterComponent } from "../../components";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import useUser from "../../hooks/useUser";
import { format } from "date-fns";
import * as Yup from "yup";

export function Profile() {
  const modal = useRef<HTMLIonModalElement>(null);
  const user = JSON.parse(localStorage.getItem("user") || "");
  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const profile = JSON.parse(localStorage.getItem("profile") || "");
  const town = JSON.parse(localStorage.getItem("town") || "");

  var nuevaFecha = new Date();
  const fecha = profile.birthdate;
  if (fecha) {
    nuevaFecha = fecha
  }
  const fechaFormateada = format(nuevaFecha, "dd-MM-yyyy")
  const [selectedDate, setSelectedDate] = useState(profile.birthdate || new Date());
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
  }, [user]);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("Nombre es requerido"),
    fechaNacimiento: Yup.string().required("Fecha de Nacimiento es requerida"),
    ciudad: Yup.string().required("Ciudad es requerida"),
    sexo: Yup.string().required("Sexo es requerido"),
    contraseñaEmergencia: Yup.string().required("Contraseña de Emergencia es requerida"),
  });

  const formik = useFormik({
    initialValues: {
      nombre: profile.name,
      fechaNacimiento: selectedDate,
      ciudad: profile.town,
      sexo: profile.gender,
      contraseñaEmergencia: profile.alert_password,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:8000/api/profiles/' + user.id, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ name: values.nombre, birthdate: values.fechaNacimiento, town: values.ciudad, gender: values.sexo, alert_password: values.contraseñaEmergencia }),
        });
        const responseData = await response.json();
        if (responseData.success === true) {
          console.log('OK! Mensaje:', responseData);
          // localStorage.removeItem("profile");
          localStorage.setItem("profile", JSON.stringify(responseData.data));
        } else {
          console.log('Error! Mensaje:', responseData);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    },
  });

  const openCamera = async () => {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    if (image.webPath) {
      try {
        const response = await fetch('http://localhost:8000/api/profiles/' + user.id + '/image', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ profile_image: image.webPath}),
        });
        console.log(image.webPath)
        const responseData = await response.json();
        if (responseData.success === true) {
          console.log('OK! Mensaje:', responseData);
          localStorage.setItem("profile", JSON.stringify(responseData.data));
        } else {
          console.log('Error! Mensaje:', responseData);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    }
  };

  const handleSubmit = (values: any) => {
    console.log("Datos actualizados:", values);
  };

  async function canDismiss(data?: any, role?: string) {
    return role !== "gesture";
  }

  return (
    <>
      <IonPage>
        <IonHeader className="profile_header ion-padding">
          <div className="d-flex justify-content-center align-items-center">
            <IonAvatar>
              <img src={image} alt="" />
            </IonAvatar>
            <IonButton fill="clear" onClick={openCamera}>
              <IonIcon className="profile_icon" slot="icon-only" icon={cameraOutline} />
            </IonButton>
          </div>
          <IonItem>
            <IonText className="mt-2">{user.email}</IonText>
          </IonItem>
        </IonHeader>
        <IonContent className="ion-padding">
          <form onSubmit={formik.handleSubmit}>
            <IonItem className="profile_info_row">
              <span>Nombre: </span>
              <IonInput
                className="profile_text"
                name="nombre"
                value={formik.values.nombre}
                onIonChange={formik.handleChange}
              />
            </IonItem>
            <IonItem className="profile_info_row">
              <span>Fecha de Nacimiento: </span>
              <IonDatetimeButton datetime={"time"} className="mx-4" />
              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  name="fechaNacimiento"
                  showDefaultButtons={true}
                  doneText="Seleccionar"
                  cancelText="Cancelar"
                  value={selectedDate}
                  presentation="date"
                  id="time"
                  onIonChange={(e) => {
                    let birthday = new Date(e.detail.value!)
                    setSelectedDate(birthday)
                    formik.handleChange(e)
                  }
                  }

                >
                  <span slot="title">Fecha de Nacimiento</span>
                </IonDatetime>
              </IonModal>
            </IonItem>
            <IonItem className="profile_info_row">
              <span>Ciudad: </span>
              <IonInput
                className="profile_text"
                name="ciudad"
                value={formik.values.ciudad}
                onIonChange={formik.handleChange}
              />
            </IonItem>
            <IonItem className="profile_info_row">
              <span>Género: </span>
              <IonSelect
                className="profile_text"
                name="sexo"
                value={formik.values.sexo}
                onIonChange={(e) => formik.setFieldValue("sexo", e.detail.value)}
                interface="popover"
              >
                <IonSelectOption value="male">Hombre</IonSelectOption>
                <IonSelectOption value="female">Mujer</IonSelectOption>
                <IonSelectOption value="nonbinary">No binario</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem className="profile_info_row">
              <span>Contraseña de Emergencia: </span>
              <IonInput
                type="password"
                className="profile_text"
                name="contraseñaEmergencia"
                value={formik.values.contraseñaEmergencia}
                onIonChange={formik.handleChange}
              />
            </IonItem>
            <IonButton
              expand="block"
              className="mt-3 my-large-button"
              type="submit"
              shape="round"
              fill="outline"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Enviando..." : "Actualizar"}
            </IonButton>
          </form>
        </IonContent>
        <FooterComponent />
      </IonPage>
    </>
  );
}
