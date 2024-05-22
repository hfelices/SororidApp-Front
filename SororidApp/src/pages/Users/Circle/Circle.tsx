import { useEffect, useState, useRef } from "react";
import React from "react";
import { API_URL, URL } from "../../../constants";
import "./Cricle.css";
import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import { Link } from "react-router-dom";
import defaultAvatar from "../../../assets/default-avatar.jpg";
import {
  chevronDownOutline,
  chevronUpOutline,
  compassOutline,
} from "ionicons/icons";
export function Circle() {
  const [contacts, setContacts] = useState([]);
  const [openSections, setOpenSections] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [heights, setHeights] = useState([0, 0, 0, 0]);
  const sectionRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const authToken = JSON.parse(localStorage.getItem("authToken") || "{}");

  const toggleSection = (index) => {
    const newOpenSections = openSections.map((item, idx) =>
      idx === index ? !item : item
    );
    const newHeights = heights.map((height, idx) => {
      if (idx === index) {
        return height === 0 ? sectionRefs.current[idx].current.scrollHeight : 0;
      }
      return height;
    });
    setOpenSections(newOpenSections);
    setHeights(newHeights);
  };

  const getContacts = async () => {
    try {
      const response = await fetch(`${API_URL}relations/${user.id}/all`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const responseData = await response.json();
      if (responseData.success) {
        setContacts(responseData.data);
      } else {
        console.error("Error! Mensaje:", responseData);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <IonContent>
      {[
        "Círculo de Máxima Confianza",
        "Círculo de Confianza",
        "Círculo de Confianza Extendida",
        "Bloqueados",
      ].map((title, index) => (
        <div key={index}>
          <IonItem
            onClick={() => toggleSection(index)}
            color={index === 3 ? "danger" : "sororilight"}
          >
            <IonLabel color="light">{title}</IonLabel>
            <IonIcon
              icon={openSections[index] ? chevronUpOutline : chevronDownOutline}
              slot="end"
              color="light"
            />
          </IonItem>

          <div
            ref={sectionRefs.current[index]}
            style={{
              height: `${heights[index]}px`,
              overflow: "hidden",
              transition: "height 0.5s ease-in-out",
            }}
          >
            <IonList className="py-1">
              {contacts.length > 0 ? (
                contacts.map((contact, idx) =>
                  contact.name ? (
                    <Link
                      to={`/user-details/${contact.id}`}
                      key={contact.id}
                      style={{ textDecoration: "none" }}
                    >
                      <IonItem>
                        <img
                          className="small-avatar"
                          src={
                            contact.profile_img_path
                              ? `${URL}${contact.profile_img_path}`
                              : defaultAvatar
                          }
                          alt="avatar"
                        />
                        <IonLabel
                          className="fw-bold text-center"
                          color={index === 3 ? "danger" : "sororidark"}
                        >
                          {contact.name}
                        </IonLabel>
                      </IonItem>
                    </Link>
                  ) : null
                )
              ) : (
                <IonItem>
                  {/* <Link to={`/explore`} style={{ textDecoration: "none" }}>
                    <IonIcon color="sororidark" icon={compassOutline} />
                  </Link> */}
                  <IonLabel
                    className="fw-bold text-center"
                    color={index === 3 ? "danger" : "sororidark"}
                  >
                    {index === 3
                      ? "No tienes contactos bloqueados"
                      : "Todavía no tienes contactos en este Círculo, ve a conocer gente!"}
                  </IonLabel>
                </IonItem>
              )}
            </IonList>
          </div>
        </div>
      ))}
    </IonContent>
  );
}
