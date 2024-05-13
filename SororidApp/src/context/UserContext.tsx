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
    authToken: "",
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
    authToken: "",
    onChangeUserProfile: () => {},
  });


  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  )
};

export default UserContext;
