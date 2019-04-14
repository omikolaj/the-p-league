export interface GearItem{
  name: string,
  price: number,
  sizes: Size[],
  inStock: boolean,
  imageUrl?: string
}

export enum Size{
  NONE = 0,
  XS = 1,
  S = 2,
  M = 3,
  L = 4,
  XL = 5,
  XXL = 6,
  ALL = 10
}