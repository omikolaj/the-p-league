export interface TeamSignUpForm {
  name: string;
  contact: Contact;
}

export interface Contact {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
}
