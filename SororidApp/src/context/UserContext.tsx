import { createContext, useEffect, useState } from "react";
import { UserContextTypes } from "./UserContext.type";
import { UserModel } from "../models";
const UserContext = createContext<UserContextTypes.Context>({
  user: {
    id: 0,
    username: "",
    email:"",
    avatar: "",
    gender: "",
    town: "",
    birthdate: new Date(),
    alertPassword: "",
    onChangeUserProfile: () => {},
  },
});

export const UserContextProvider = (props: UserContextTypes.Props) => {
  const { children } = props;
  const [user, setUser] = useState({
    id: 0,
    username: "",
    email: "",
    avatar: "",
    gender: "",
    town: "",
    birthdate: new Date(),
    alertPassword: "",
    onChangeUserProfile: () => {},
  });

  useEffect(() => {
    localStorage.getItem("user");
   
    const fetchUser = async () => {
      try {
        const responseUser = await fetch("http://localhost:8000/api/users/1", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const responseData = await responseUser.json();
        if (responseData.success === true) {
          console.log("OK! Mensaje:", responseData);
          localStorage.setItem("user", JSON.stringify(responseData));
          setUser({
            id: responseData.data.id,
            username: responseData.profile.name,
            avatar: "",
            email: responseData.data.email ,
            gender: responseData.profile.gender,
            town: responseData.profile.town,
            birthdate: new Date(responseData.profile.birthdate),
            alertPassword: responseData.profile.alert_password,
            onChangeUserProfile: () => {}, 
          });

          
        } else {
          console.log("Error! Mensaje:", responseData);
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    };

    fetchUser();
    
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  )
};

export default UserContext;
