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

export  function Login() {
    const formik = useFormik({
        initialValues: { 
          email: "",
          contrasena: "",
        },
        validationSchema: Yup.object({
          email: Yup.string()
            .email("Correo electrónico inválido")
            .required("El correo electrónico es obligatorio"),
          contrasena: Yup.string()
            .required("La contraseña es obligatoria")
            .min(6, "La contraseña debe tener al menos 6 caracteres"),
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
    
                
                <div className="errors">
                  
                  {formik.touched.email && formik.errors.email && (
                    <div>{formik.errors.email}</div>
                  )}
                  {formik.touched.contrasena && formik.errors.contrasena && (
                    <div>{formik.errors.contrasena}</div>
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
                  {formik.isSubmitting ? <IonSpinner name="crescent" /> : "Entrar"}
                </IonButton>
              </form>
            </IonContent>
          </IonPage>
        </>
      );
}
