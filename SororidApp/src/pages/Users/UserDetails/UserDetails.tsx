import { useEffect, useState } from "react";
import { API_URL, URL } from "../../../constants";
import "./UserDetails.css";
import { useParams } from "react-router-dom";
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonText,
} from "@ionic/react";
import defaultAvatar from "../../../assets/default-avatar.jpg";
export function UserDetails() {
  const { id } = useParams();
  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const getUser = async (id) => {
    console.log("aloha");
    try {
      const response = await fetch(`${API_URL}users/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const responseData = await response.json();
      if (responseData.success === true) {
        setUser(responseData);
        setLoading(false);
      } else {
        console.log("Error! Mensaje:", responseData);
        return {};
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      return {};
    }
  };

  useEffect(() => {
    getUser(id);
  }, []);

  return (
    <>
      {loading ? (
        <div className="spinner">
          {" "}
          {/* Aquí debes colocar tu componente de spinner */}
          Loading...
        </div>
      ) : (
        <>
          <IonHeader className="profile_header ion-padding mt-5">
            <div className="d-flex align-items-center justify-content-center flex-column">
              
                <img
                  className="large-avatar"
                  src={
                    user.profile.profile_img_path
                      ? `${URL}${user.profile.profile_img_path}`
                      : defaultAvatar
                  }
                  alt="avatar"
                />
             
              <div className="user-details text-center">
                <IonText className="mt-2 fw-bold fs-3">{user.profile.name}</IonText>
                <IonText className="mt-2">{user.town.name}</IonText>
                <IonText className="mt-2">{user.profile.gender}</IonText>
                <IonText className="mt-2">{user.profile.birthdate}</IonText>
              </div>
            </div>
          </IonHeader>
        </>
      )}
    </>
  );
}
