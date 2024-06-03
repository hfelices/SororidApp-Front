import { useEffect, useState, useRef } from "react";
import React from "react";
import { API_URL, URL } from "../../../constants";
import "./Cricle.css";
import {
  IonAvatar,
  IonChip,
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
  hourglassOutline,
  personAddOutline,
} from "ionicons/icons";
import { Spinner } from "../../../components";
export function Circle() {
  const [loading, setLoading] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [extendedContacts, setExtendedContacts] = useState([]);
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

  const getExtendedContacts = async () => {
    try {
      const response = await fetch(`${API_URL}relations/${user.id}/extended`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const responseData = await response.json();
      if (responseData.success) {
        setExtendedContacts(responseData.data);
        setLoading(false);
      } else {
        console.error("Error! Mensaje:", responseData);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  useEffect(() => {
    if (
      allContacts.length < contacts.length + extendedContacts.length ||
      (allContacts.length == 0 && loadingContacts)
    ) {
      setAllContacts(contacts.concat(extendedContacts));
      getContacts();
      getExtendedContacts();
      setLoadingContacts(false);
      console.log(allContacts);
    }
  }, [contacts, extendedContacts]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <IonContent>
          {[
            "Círculo de Máxima Confianza", // index 0
            "Círculo de Confianza", // index 1
            "Círculo de Confianza Extendida", // index 2
            "Bloqueados", // index 3
          ].map((title, index) => (
            <div key={index}>
              <IonItem
                onClick={() => toggleSection(index)}
                color={index === 3 ? "danger" : "sororilight"}
              >
                <IonLabel color="light">{title}</IonLabel>
                <IonIcon
                  icon={
                    openSections[index] ? chevronUpOutline : chevronDownOutline
                  }
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
                  {allContacts.length > 0 ? (
                    allContacts.map((contact, idx) =>
                      contact.name &&
                      ((index === 0 && contact.relation_type === "second") ||
                        (index === 1 && contact.relation_type === "first") ||
                        (index === 2 && contact.relation_type === "extended") ||
                        (index === 3 &&
                          contact.relation_type === "blocked")) ? (
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
                              color={
                                contact.status === "pending"
                                  ? index === 3
                                    ? "danger"
                                    : "sororilight"
                                  : index === 3
                                  ? "danger"
                                  : "sororidark"
                              }
                            >
                              {contact.name}
                              {contact.status == "pending" ? (
                                <IonIcon icon={hourglassOutline}></IonIcon>
                              ) : (
                                <></>
                              )}
                            </IonLabel>
                          </IonItem>
                        </Link>
                      ) : null
                    )
                  ) : (
                    <IonItem>
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
      )}
    </>
  );
}
