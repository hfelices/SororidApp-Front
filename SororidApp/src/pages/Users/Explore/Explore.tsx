import { useEffect, useState } from "react";
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonHeader,
  IonSearchbar,
} from "@ionic/react";
import "./Explore.css";
import { API_URL, URL } from "../../../constants";
import defaultAvatar from "../../../assets/default-avatar.jpg";
import { Link } from 'react-router-dom';
export function Explore() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const user = JSON.parse(localStorage.getItem("user") || "");

  const getExploreUsers = async (page) => {
    try {
      const response = await fetch(
        `${API_URL}relations/${user.id}/explore?page=${page}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const responseData = await response.json();
      if (responseData.success === true) {
        return responseData.users.data;
      } else {
        console.log("Error! Mensaje:", responseData);
        return [];
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      return [];
    }
  };

  const generateItems = async () => {
    try {
      const newUsers = await getExploreUsers(page);
      if (newUsers.length > 0) {
        setUsers((prevUsers) => [...prevUsers, ...newUsers]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    generateItems();
  }, []);

  const loadMore = async (event) => {
    if (!hasMore) {
      event.target.disabled = true;
      return;
    }
    await generateItems();
    event.target.complete();
  };

  return (
    <>
   
    
 

   
    <IonSearchbar animated={true} placeholder="Buscar por Nombre"></IonSearchbar>
    <IonContent className="ion-padding">
    <IonList>
      {users.map((user, index) => (
        user.profile.name ? (
          <Link to={`/user-details/${user.id}`} key={user.id} style={{ textDecoration: 'none' }}>
            <IonItem>
              <IonAvatar className="mx-2" slot="start">
                <img
                  src={
                    user.profile.profile_img_path
                      ? URL + user.profile.profile_img_path
                      : defaultAvatar
                  }
                  alt="avatar"
                />
              </IonAvatar>
              <IonLabel className="text-center">{user.profile.name}</IonLabel>
            </IonItem>
          </Link>
          
        ) : <></>
      ))}
    </IonList>
    <IonInfiniteScroll
      threshold="100px"
      disabled={!hasMore}
      onIonInfinite={loadMore}
    >
      <IonInfiniteScrollContent loadingText="Cargando más usuarios..."></IonInfiniteScrollContent>
    </IonInfiniteScroll>
  </IonContent>
  </>
  );
}
