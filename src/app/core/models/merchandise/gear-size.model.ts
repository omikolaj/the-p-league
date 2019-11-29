export interface GearSize {
	id?: number;
	size?: Size;
	available: boolean;
	color: string;
}
export enum Size {
	NONE = 0,
	XS = 1,
	S = 2,
	M = 3,
	L = 4,
	XL = 5,
	XXL = 6,
	ALL = 10
}

export const gearSizesArray = [
	{ size: Size.XS, available: false, color: 'warn' },
	{ size: Size.S, available: false, color: 'warn' },
	{ size: Size.M, available: false, color: 'warn' },
	{ size: Size.L, available: false, color: 'warn' },
	{ size: Size.XL, available: false, color: 'warn' },
	{ size: Size.XXL, available: false, color: 'warn' }
];
