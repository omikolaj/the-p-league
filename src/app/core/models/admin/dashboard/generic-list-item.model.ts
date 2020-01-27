import { Type } from '@angular/core';

export interface GenericListItem {
	name: string;
	component: Type<any>;
	icon?: string;
}
