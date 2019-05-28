import { INgxGalleryImage } from "ngx-gallery";
import { ImageBase } from "./image-base.model";

export interface GearImage extends INgxGalleryImage, ImageBase {
  ID: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}
