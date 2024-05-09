import { UserModel } from "../models";

export namespace UserContextTypes {
  export type Props = {
    children: JSX.Element;
  };

  export type Context = {
    user: UserModel
  };
}
