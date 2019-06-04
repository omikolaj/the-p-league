export interface UserBase {
  id?: number;
  role?: string[];
  username?: string;
  password?: string;
}

export interface Admin extends UserBase {}

export interface User extends UserBase {}
