import { Size } from './gear-size.model';
import { PreOrderContact } from './pre-order-contact.model';

export interface PreOrderForm {
	id?: number;
	gearItemId: number;
	quantity: number;
	size: Size;
	contact: PreOrderContact;
}
