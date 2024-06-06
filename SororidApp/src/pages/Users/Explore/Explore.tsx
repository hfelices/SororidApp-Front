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
  IonButton,
  IonIcon,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons"; // Importing search icon
import "./Explore.css";
import { API_URL, URL } from "../../../constants";
import defaultAvatar from "../../../assets/default-avatar.jpg";
import { Link } from 'react-router-dom';

export function Explore() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const user = JSON.parse(localStorage.getItem("user") || "");

  const getExploreUsers = async (page, searchTerm = "") => {
    console.log(`Fetching users with search term: ${searchTerm} and page: ${page}`); // Log
    try {
      const response = await fetch(
        `${API_URL}relations/${user.id}/explore?page=${page}&search=${searchTerm}`,
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

  const generateItems = async (reset = false) => {
    try {
      if (reset) {
        setPage(1);
        setHasMore(true);
        setUsers([]);
      }
      const newUsers = await getExploreUsers(reset ? 1 : page, searchTerm);
      if (reset) {
        setUsers(newUsers);
      } else {
        setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      }
      if (newUsers.length > 0) {
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    console.log(`Search term changed: ${searchTerm}`); // Log
    generateItems(true);
  }, [searchTerm]);

  const loadMore = async (event) => {
    if (!hasMore) {
      event.target.disabled = true;
      return;
    }
    await generateItems();
    event.target.complete();
  };

  const handleSearch = (e) => {
    const value = e.detail.value;
    setSearchTerm(value);
  };

  const handleSearchButtonClick = () => {
    generateItems(true);
  };

  return (
    <>
      <div className="main-content">
        <div className="searchbar-container">
          <IonSearchbar
            animated={true}
            placeholder="Buscar por Nombre"
            value={searchTerm}
            onIonChange={handleSearch}
            className="custom-searchbar"
            showCancelButton="never"
          ></IonSearchbar>
          <IonButton
            className="search-icon-button fw-bold"
            onClick={handleSearchButtonClick}
            fill="clear"
          >
            <IonIcon icon={searchOutline} />
          </IonButton>
        </div>
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
                    <IonLabel className="text-center fw-bold" color="sororidark">{user.profile.name}</IonLabel>
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
      </div>
    </>
  );
}
