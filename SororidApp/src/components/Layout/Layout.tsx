
import "./Layout.css";

import { Menu } from "../Menu";

import { FooterComponent } from "./Footer";
export const Layout = ({ children, doLogout }) =>  {
  
  return (
    <>
      <Menu doLogout={doLogout}/>
      <div id="main">
        {children}
      </div>
     <FooterComponent/>
    </>
  );
}
