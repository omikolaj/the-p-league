import { ContactBase } from "../contact-base.model";

export interface TeamSignUpForm {
  name: string;
  contact: Contact;
}

export interface Contact extends ContactBase {
  teamFormId?: number;
}
