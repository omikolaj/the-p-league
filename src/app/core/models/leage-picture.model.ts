import { NgxGalleryImage, INgxGalleryImage } from "ngx-gallery";
import { SafeResourceUrl } from "@angular/platform-browser";

export interface LeaguePicture extends INgxGalleryImage {
  url: string;
  hashTag: string;
  name: string;
  delete?: boolean;
}
