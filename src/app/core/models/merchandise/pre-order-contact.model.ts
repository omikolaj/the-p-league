import { ContactBase } from "../contact-base.model";

export interface PreOrderContact extends ContactBase {
  preOrderId?: number;
}
