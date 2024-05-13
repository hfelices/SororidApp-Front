import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonPage,
  IonSpinner,
  IonAvatar,
} from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import image from "../../../assets/SororidApp.png";
import { useState } from "react";

import "../Auth.css";


export function Register() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmarContrasena: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Correo electrónico inválido")
        .required("El correo electrónico es obligatorio"),
        password: Yup.string()
        .required("La contraseña es obligatoria")
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
      confirmarContrasena: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
        .required("Confirma tu contraseña"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:8000/api/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: values.email, password: values.password}),
        });
        const responseData = await response.json();
        if (responseData.success === true) {
          console.log('OK! Mensaje:', responseData);

      } else {
        console.log('Error! Mensaje:', responseData);
      }

      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    },
  });

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

            <IonItem>
              <IonLabel position="stacked">Confirmar contraseña</IonLabel>
              <IonInput
                type="password"
                value={formik.values.confirmarContrasena}
                onIonChange={(e) =>
                  formik.setFieldValue("confirmarContrasena", e.detail.value!)
                }
                onBlur={formik.handleBlur("confirmarContrasena")}
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
              {formik.touched.confirmarContrasena &&
                formik.errors.confirmarContrasena && (
                  <div>{formik.errors.confirmarContrasena}</div>
                )}
            </div>

            <IonButton
              expand="block"
              type="submit"
              shape="round"
              fill="outline"
            >
              {" "}
              {formik.isSubmitting ? <IonSpinner name="crescent" /> : "Crear"}
            </IonButton>
          </form>
        </IonContent>
      </IonPage>
    </>
  );
}
