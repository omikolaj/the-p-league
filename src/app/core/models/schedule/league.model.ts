export interface League {
	id?: string;
	active?: boolean;
	type?: string;
	teams?: string[];
	name: string;
	selected?: boolean;
	sportTypeID?: string;
}
