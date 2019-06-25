import { NgxGalleryImage, INgxGalleryImage } from "ngx-gallery";
import { SafeResourceUrl } from "@angular/platform-browser";
import { ImageBase } from "./image-base.model";
import { Preview } from "./image-preview.model";

export interface LeaguePicture extends INgxGalleryImage, ImageBase {
  url?: string;
  hashTag?: string;
  delete?: boolean;
  formData?: FormData;
  preview?: Preview;
  orderId?: number;
}
