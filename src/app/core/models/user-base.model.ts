export interface UserBase {
  id?: number;
  role?: Role;
  username?: string;
  password?: string;
}

export interface Admin extends UserBase {}

export interface User extends UserBase {}

export enum Role {
  user = 0,
  admin = 10
}
