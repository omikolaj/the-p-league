import { ApplicationToken } from './token/ApplicationToken.model';

export interface Auth {
  id?: string;
  username?: string;
  password?: string;
  applicationToken?: ApplicationToken;
}
