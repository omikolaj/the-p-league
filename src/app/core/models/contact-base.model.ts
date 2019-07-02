export interface ContactBase {
  id?: number;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  preferredContact: ContactPreference;
}

export enum ContactPreference {
  None = 0,
  Cell = 1,
  Email = 2
}
