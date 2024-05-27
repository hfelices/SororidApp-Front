
import "./Layout.css";

import { Menu } from "../Menu";


export const Layout = ({ children, doLogout }) =>  {
  
  return (
    <>
      <Menu doLogout={doLogout}/>
      <div id="main">
        {children}
      </div>
    
    </>
  );
}
