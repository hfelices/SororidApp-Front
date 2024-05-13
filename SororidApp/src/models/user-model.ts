export interface UserModel {
    id: number;
    email: string;
    username: string;
    avatar: string;
    gender: string;
    town: string;
    birthdate: Date;
    alertPassword: string;
    authToken: string;
    onChangeUserProfile: (user: UserModel) => void;
    
  }
  