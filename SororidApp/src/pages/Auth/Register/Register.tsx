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
      nombre: "",
      email: "",
      contrasena: "",
      confirmarContrasena: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      email: Yup.string()
        .email("Correo electrónico inválido")
        .required("El correo electrónico es obligatorio"),
      contrasena: Yup.string()
        .required("La contraseña es obligatoria")
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
      confirmarContrasena: Yup.string()
        .oneOf([Yup.ref("contrasena"), null], "Las contraseñas deben coincidir")
        .required("Confirma tu contraseña"),
    }),
    onSubmit: (values) => {
      // Aquí puedes agregar la lógica para enviar los datos del formulario a tu backend
      setTimeout(() => {
        console.log("Formulario enviado:", values);
      }, 500);
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
            <IonItem className="">
              <IonLabel position="stacked" className="patata">
                Nombre
              </IonLabel>
              <IonInput
                type="text"
                value={formik.values.nombre}
                onIonChange={(e) =>
                  formik.setFieldValue("nombre", e.detail.value!)
                }
                onBlur={formik.handleBlur("nombre")}
                required
              ></IonInput>
            </IonItem>

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
                value={formik.values.contrasena}
                onIonChange={(e) =>
                  formik.setFieldValue("contrasena", e.detail.value!)
                }
                onBlur={formik.handleBlur("contrasena")}
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
              {formik.touched.nombre && formik.errors.nombre && (
                <div>{formik.errors.nombre}</div>
              )}
              {formik.touched.email && formik.errors.email && (
                <div>{formik.errors.email}</div>
              )}
              {formik.touched.contrasena && formik.errors.contrasena && (
                <div>{formik.errors.contrasena}</div>
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
              onClick={() => formik.handleSubmit()}
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
