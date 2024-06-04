import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import "./Profile.css";
import {
  IonHeader,
  IonInput,
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
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { cameraOutline } from "ionicons/icons";
import * as Yup from "yup";
import { API_URL, URL } from "../../../constants";
import defaultAvatar from "../../../assets/default-avatar.jpg";
import { Spinner } from "../../../components";

export function Profile() {
  const fileInputRef = useRef(null);
  const router = useIonRouter();
  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const user = JSON.parse(localStorage.getItem("user") || "");
  const profile = JSON.parse(localStorage.getItem("profile") || "");
  const fecha = new Date();
  const [selectedDate, setSelectedDate] = useState(
    profile.birthdate || fecha.toISOString()
  );
  const [loading, setLoading] = useState(false);
  const [towns, setTowns] = useState([]);

  const getTowns = async () => {
    try {
      const response = await fetch(`${API_URL}towns`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const responseData = await response.json();
      if (responseData.success === true) {
        setTowns(responseData.data);
        setLoading(false);
      } else {
        console.log("Error! Mensaje:", responseData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setLoading(false);
    }
  };

  const [present] = useIonToast();
  const [userImage, setUserImage] = useState(URL + profile.profile_img_path);

  const presentToast = (message, myclass) => {
    present({
      message: message,
      duration: 1500,
      position: "middle",
      cssClass: myclass,
    });
  };

  useEffect(() => {
    getTowns();
  }, [user]);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("Nombre es requerido"),
    fechaNacimiento: Yup.string().required("Fecha de Nacimiento es requerida"),
    ciudad: Yup.string().required("Ciudad es requerida"),
    sexo: Yup.string().required("Sexo es requerido"),
    contraseñaEmergencia: Yup.string().required(
      "Contraseña de Emergencia es requerida"
    ),
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
        const response = await fetch(API_URL + "profiles/" + user.id, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            name: values.nombre,
            birthdate: values.fechaNacimiento,
            town: values.ciudad,
            gender: values.sexo,
            alert_password: values.contraseñaEmergencia,
          }),
        });
        const responseData = await response.json();
        if (responseData.success === true) {
          console.log("OK! Mensaje:", responseData);
          localStorage.setItem("profile", JSON.stringify(responseData.profile));
          localStorage.setItem("user", JSON.stringify(responseData.user));
          console.log(responseData.user);

          presentToast("Perfil actualizado con éxito", "green");
        } else {
          console.log("Error! Mensaje:", responseData);
          presentToast(
            "Ha ocurrido un error, porfavor vuélvalo a intentar",
            "red"
          );
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        presentToast(
          "Ha ocurrido un error, porfavor vuélvalo a intentar",
          "red"
        );
      }
    },
  });

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_image", file);

      try {
        const response = await fetch(
          API_URL + "profiles/" + user.id + "/image",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            body: formData,
          }
        );

        const responseData = await response.json();
        if (responseData.success) {
          console.log("Imagen subida con éxito:", responseData);

          localStorage.setItem("profile", JSON.stringify(responseData.data));

          setUserImage(URL + responseData.data.profile_img_path);
          presentToast("Foto de perfil actualizada con éxito", "green");
        } else {
          console.error("Error al subir imagen:", responseData.message);
          presentToast(
            "Ha ocurrido un error, porfavor vuélvalo a intentar",
            "red"
          );
        }
      } catch (error) {
        console.error("Error en la petición:", error);
        presentToast(
          "Ha ocurrido un error, porfavor vuélvalo a intentar",
          "red"
        );
      }
    }
  };

  const handleIconClick = () => {
    // Desencadenar el clic en el input de tipo file
    fileInputRef.current.click();
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <IonPage>
          <IonHeader className="profile_header">
            <div className="d-flex justify-content-center align-items-center">
              <img
                className="large-avatar"
                src={profile.profile_img_path ? userImage : defaultAvatar}
                alt="avatar"
              />
              <IonIcon
                icon={cameraOutline}
                color="tertiary"
                onClick={handleIconClick}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                ref={fileInputRef}
              />
            </div>
            <IonItem>
              <IonText className="mt-2">{user.email}</IonText>
            </IonItem>
            {user.made_profile ? (
              <></>
            ) : (
              <IonItem>
                <IonText
                  className="mt-2 text-center fw-bold"
                  color={"sororidark"}
                >
                  Debes rellenar todos los campos de tu perfil antes de abandonar
                  esta página
                </IonText>
              </IonItem>
            )}
          </IonHeader>
          <IonContent className="ion-padding">
            <form onSubmit={formik.handleSubmit}>
              <IonItem className="profile_info_row">
                <span>Nombre: </span>
                <IonInput
                  className="profile_text"
                  name="nombre"
                  value={formik.values.nombre}
                  onIonInput={(e) =>
                    formik.setFieldValue("nombre", e.target.value)
                  }
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
                      let birthday = new Date(e.detail.value!);
                      setSelectedDate(birthday);
                      formik.setFieldValue("fechaNacimiento", e.detail.value);
                    }}
                  >
                    <span slot="title">Fecha de Nacimiento</span>
                  </IonDatetime>
                </IonModal>
              </IonItem>
              <IonItem className="profile_info_row">
                <span>Ciudad: </span>
                <IonSelect
                  className="profile_selector_text"
                  name="ciudad"
                  value={formik.values.ciudad}
                  onIonChange={(e) =>
                    formik.setFieldValue("ciudad", e.detail.value)
                  }
                  interface="popover"
                >
                  {towns.map((town) => (
                    <IonSelectOption key={town.id} value={town.id}>
                      {town.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem className="profile_info_row">
                <span>Género: </span>
                <IonSelect
                  className="profile_selector_text"
                  name="sexo"
                  value={formik.values.sexo}
                  onIonChange={(e) =>
                    formik.setFieldValue("sexo", e.detail.value)
                  }
                  interface="popover"
                >
                  <IonSelectOption value="female">Mujer</IonSelectOption>
                  <IonSelectOption value="male">Hombre</IonSelectOption>
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
                  onIonInput={(e) =>
                    formik.setFieldValue(
                      "contraseñaEmergencia",
                      e.target.value
                    )
                  }
                />
              </IonItem>
              {Object.keys(formik.errors).length > 0 && (
                <div className="ion-text-center mt-3">
                  {Object.keys(formik.errors).map((key) => (
                    <IonText color="danger" key={key}>
                      {formik.errors[key]}
                    </IonText>
                  ))}
                </div>
              )}
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
        </IonPage>
      )}
    </>
  );
}
