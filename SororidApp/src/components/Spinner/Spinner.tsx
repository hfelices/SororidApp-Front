import { IonSpinner } from "@ionic/react";
import "./Spinner.css";

export function Spinner() {
  return (
    <div className="spinner-container">
      <IonSpinner name="circles" color="sororidark" />
    </div>
  );
}
