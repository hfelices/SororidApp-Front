export interface UserModel {
    id: number;
    username: string;
    avatar: string;
    gender: string;
    town: number;
    birthdate: Date;
    alertPassword: string;
    onChangeUserProfile: (user: UserModel) => void;
    
  }
  