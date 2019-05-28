import { NgxGalleryImage, INgxGalleryImage } from "ngx-gallery";
import { SafeResourceUrl } from "@angular/platform-browser";
import { ImageBase } from "./image-base.model";

export interface LeaguePicture extends INgxGalleryImage, ImageBase {
  url?: string;
  hashTag?: string;
  delete?: boolean;
  formData?: FormData;
  preview?: Preview;
}

export interface Preview {
  src?: string | ArrayBuffer;
  error?: boolean;
  message?: string;
  file?: File;
}
