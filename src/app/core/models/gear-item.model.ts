import { GearSize } from './gear-size.model';
import { GearImage } from './gear-image.model';

export interface GearItem{
  ID?: number,
  name: string,
  price: number,
  sizes: GearSize[],
  images?: GearImage[],
  inStock: boolean
}