import { createContext, useEffect, useState } from "react";
import { UserContextTypes } from "./UserContext.type";
import { UserModel } from "../models";
const UserContext = createContext<UserContextTypes.Context>({
  user: {
    id: 0,
    username: "",
    avatar: "",
    gender: "",
    town: 0,
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
    avatar: "",
    gender: "",
    town: 0,
    birthdate: new Date(),
    alertPassword: "",
    onChangeUserProfile: () => {},
  });

  useEffect(() => {
    localStorage.getItem("user");
    const fetchUser = async () => {
      try {
        const responseUser = await fetch("http://localhost:8000/api/users", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const responseData = await responseUser.json();
        if (responseData.success === true) {
          console.log("OK! Mensaje:", responseData);
          setUser(responseData);
        } else {
          console.log("Error! Mensaje:", responseData);
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    };

    fetchUser();
  }, []);
};

export default UserContext;
