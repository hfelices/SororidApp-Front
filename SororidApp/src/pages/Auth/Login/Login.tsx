import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonPage,
  IonSpinner,
  IonAvatar,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import image from "../../../assets/SororidApp.png";
import { useState } from "react";
import { API_URL } from "../../../constants";

import "../Auth.css";

interface LoginProps {
  doLogin: () => void;
}
export const Login: React.FC<LoginProps> = ({ doLogin }) => {
  const router = useIonRouter();
  const [present] = useIonToast();

  const presentToast = (message, myclass) => {
    present({
      message: message,
      duration: 1500,
      position: "middle",
      cssClass: myclass
    });
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Correo electrónico inválido")
        .required("El correo electrónico es obligatorio"),
      password: Yup.string()
        .required("La contraseña es obligatoria")
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(API_URL + "login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });
        const responseData = await response.json();
        if (responseData.success === true) {
          //console.log("OK! Mensaje:", responseData);
          localStorage.setItem(
            "authToken",
            JSON.stringify(responseData.authToken)
          );
          localStorage.setItem("user", JSON.stringify(responseData.user));
          localStorage.setItem("profile", JSON.stringify(responseData.profile));
          localStorage.setItem("town", JSON.stringify(responseData.town));
          doLogin();
          presentToast('Autenticado con éxito', 'green');
          router.push("/profile");        
        } else {
          //console.log("Error! Mensaje:", responseData);
          presentToast('Ha ocurrido un error, porfavor vuélvalo a intentar', 'red');
        }
      } catch (error) {
        //console.error("Error al realizar la solicitud:", error);
        presentToast('Ha ocurrido un error, porfavor vuélvalo a intentar', 'red');
      }
    },
  });

  const handleGoToRegister = () => {
    router.push("/register");
  };
  return (
    <>
      <IonPage className="register-content">
        <IonAvatar>
          <img src={image} />
        </IonAvatar>
        <IonContent className="ion-padding">
          <form onSubmit={formik.handleSubmit}>
            <IonItem>
              <IonLabel position="stacked">Correo electrónico</IonLabel>
              <IonInput
                type="email"
                value={formik.values.email}
                onIonChange={(e) =>
                  formik.setFieldValue("email", e.detail.value!)
                }
                onBlur={formik.handleBlur("email")}
                required
              ></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput
                type="password"
                value={formik.values.password}
                onIonChange={(e) =>
                  formik.setFieldValue("password", e.detail.value!)
                }
                onBlur={formik.handleBlur("password")}
                required
              ></IonInput>
            </IonItem>

            <div className="errors">
              {formik.touched.email && formik.errors.email && (
                <div>{formik.errors.email}</div>
              )}
              {formik.touched.password && formik.errors.password && (
                <div>{formik.errors.password}</div>
              )}
            </div>

            <IonButton
              expand="block"
              type="submit"
              shape="round"
              fill="outline"
            >
              {" "}
              {formik.isSubmitting ? (
                <IonSpinner name="circles" color="light" />
              ) : (
                "Entrar"
              )}
            </IonButton>
          </form>
          <IonButton  expand="block"
              
              shape="round"
              fill="outline" onClick={handleGoToRegister}>
            Ir a Registro
          </IonButton>
        </IonContent>
      </IonPage>
    </>
  );
};
